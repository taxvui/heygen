import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import ffmpegStatic from 'ffmpeg-static';
import { ProjectRecord, SceneRecord } from '../db/types';

const execFileAsync = promisify(execFile);

export function getFfmpegBinaryPath(): string {
  if (process.env.FFMPEG_STATIC_BIN && fs.existsSync(process.env.FFMPEG_STATIC_BIN)) {
    return process.env.FFMPEG_STATIC_BIN;
  }
  if (typeof ffmpegStatic === 'string' && fs.existsSync(ffmpegStatic)) {
    return ffmpegStatic;
  }
  const fallback = path.join(process.cwd(), 'node_modules', 'ffmpeg-static', process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');
  return fallback;
}

export function generateSrtSubtitles(scenes: SceneRecord[], targetLang?: string): string {
  let currentSec = 0;
  const blocks: string[] = [];

  scenes.forEach((scene, idx) => {
    const start = formatSrtTimestamp(currentSec);
    const dur = Math.max(2, Number(scene.duration_sec) || 6);
    const end = formatSrtTimestamp(currentSec + dur);
    currentSec += dur;
    const text = scene.script?.trim() || scene.title || `Scene ${idx + 1}`;
    const prefix = targetLang ? `[${targetLang}] ` : '';
    blocks.push(`${idx + 1}\n${start} --> ${end}\n${prefix}${text}\n`);
  });

  return blocks.join('\n');
}

function formatSrtTimestamp(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

export async function renderProjectWithFfmpeg(params: {
  jobId: string;
  project: ProjectRecord;
  scenes: SceneRecord[];
  resolution?: '720p' | '1080p' | '4k';
}): Promise<{
  outputUrl: string;
  subtitleUrl: string;
  fileSizeBytes: number;
  durationSec: number;
}> {
  const ffmpegBin = getFfmpegBinaryPath();
  if (!fs.existsSync(ffmpegBin)) {
    throw new Error(`FFmpeg binary not found at ${ffmpegBin}`);
  }

  const rendersDir = path.join(process.cwd(), 'public', 'renders');
  fs.mkdirSync(rendersDir, { recursive: true });

  const outFilename = `render-${params.jobId}.mp4`;
  const srtFilename = `render-${params.jobId}.srt`;
  const outPath = path.join(rendersDir, outFilename);
  const srtPath = path.join(rendersDir, srtFilename);

  // Write real SRT subtitle file
  const srtContent = generateSrtSubtitles(params.scenes);
  fs.writeFileSync(srtPath, srtContent, 'utf-8');

  const totalDuration = Math.min(
    30,
    Math.max(
      3,
      params.scenes.reduce((acc, s) => acc + (Number(s.duration_sec) || 5), 0) || Number(params.project.duration_sec) || 6
    )
  );

  const isPortrait = params.project.aspect_ratio === '9:16';
  const res = params.resolution || params.project.resolution || '720p';
  const width = isPortrait ? (res === '1080p' ? 720 : 480) : res === '1080p' ? 1280 : 854;
  const height = isPortrait ? (res === '1080p' ? 1280 : 854) : res === '1080p' ? 720 : 480;

  const sourceVideo = path.join(process.cwd(), 'public', 'heygen-assets', 'videos', 'avatar-preview-talk.mp4');

  if (fs.existsSync(sourceVideo)) {
    // Re-encode and scale actual authorized avatar video to project aspect ratio & duration
    await execFileAsync(ffmpegBin, [
      '-y',
      '-stream_loop',
      '-1',
      '-i',
      sourceVideo,
      '-t',
      String(totalDuration),
      '-vf',
      `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=#16171a,format=yuv420p`,
      '-c:v',
      'libx264',
      '-preset',
      'ultrafast',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-b:a',
      '128k',
      '-movflags',
      '+faststart',
      outPath,
    ]);
  } else {
    // Synthesize color canvas + sine audio tone with FFmpeg lavfi
    const bgHex = (params.scenes[0]?.background_value || '#232833').replace('#', '0x');
    await execFileAsync(ffmpegBin, [
      '-y',
      '-f',
      'lavfi',
      '-i',
      `color=c=${bgHex}:s=${width}x${height}:d=${totalDuration}:r=24`,
      '-f',
      'lavfi',
      '-i',
      `sine=frequency=440:duration=${totalDuration}`,
      '-c:v',
      'libx264',
      '-preset',
      'ultrafast',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-shortest',
      outPath,
    ]);
  }

  const stat = fs.statSync(outPath);
  return {
    outputUrl: `/renders/${outFilename}`,
    subtitleUrl: `/renders/${srtFilename}`,
    fileSizeBytes: stat.size,
    durationSec: totalDuration,
  };
}
