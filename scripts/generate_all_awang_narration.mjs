import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const envPath = path.join(ROOT_DIR, '.env');

if (!fs.existsSync(envPath)) {
  console.error('[Error] .env file not found.');
  process.exit(1);
}

// 1. Read API key safely without exposing it
let apiKey = '';
const envContent = fs.readFileSync(envPath, 'utf-8');
for (const line of envContent.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (trimmed.startsWith('#') || !trimmed) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx !== -1) {
    const k = trimmed.slice(0, eqIdx).trim();
    let v = trimmed.slice(eqIdx + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (k === 'ELEVENLABS_API_KEY' || k === 'XI_API_KEY') {
      apiKey = v;
    }
  }
}

if (!apiKey) {
  console.error('[Error] ELEVENLABS_API_KEY not found in .env.');
  process.exit(1);
}

// 2. Approved Voice Configuration
const VOICE_ID = 'tvQGOnWONjnDZvoIJFmH'; // Approved Awang Voice
const MODEL_ID = 'eleven_multilingual_v2';
const VOICE_SETTINGS = {
  stability: 0.50,
  similarity_boost: 0.85,
  style: 0.0,
  use_speaker_boost: true
};

// 3. Load Manifest of All 55 Cues
const manifestPath = path.join(ROOT_DIR, 'scratch', 'all_cues_manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('[Error] all_cues_manifest.json not found at scratch/all_cues_manifest.json');
  process.exit(1);
}

const allCues = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
console.log('================================================================');
console.log('       FULL AWANG NARRATION ROLLOUT (ALL 6 MODULES)');
console.log('================================================================');
console.log(`Voice ID: ${VOICE_ID} (Awang)`);
console.log(`Model:    ${MODEL_ID}`);
console.log(`Total Spoken Cues: ${allCues.length}`);
console.log('----------------------------------------------------------------\n');

// Helper: Calculate exact MP3 duration
function getMp3Duration(buffer) {
  let offset = 0;
  if (buffer.toString('utf-8', 0, 3) === 'ID3') {
    const tagSize = (
      ((buffer[6] & 0x7f) << 21) |
      ((buffer[7] & 0x7f) << 14) |
      ((buffer[8] & 0x7f) << 7) |
      (buffer[9] & 0x7f)
    );
    offset = 10 + tagSize;
  }

  const bitrates = {
    1: [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448],
    2: [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384],
    3: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
  };

  const sampleRates = {
    0: [44100, 48000, 32000],
    2: [22050, 24000, 16000],
    3: [11025, 12000, 8000]
  };

  let totalSamples = 0;
  let sampleRate = 44100;
  let frameCount = 0;

  while (offset < buffer.length - 4) {
    if (buffer[offset] === 0xFF && (buffer[offset + 1] & 0xE0) === 0xE0) {
      const b1 = buffer[offset + 1];
      const b2 = buffer[offset + 2];
      const versionId = (b1 >> 3) & 0x03;
      const layerId = (b1 >> 1) & 0x03;
      const bitrateIdx = (b2 >> 4) & 0x0F;
      const srIdx = (b2 >> 2) & 0x03;
      const padding = (b2 >> 1) & 0x01;

      if (versionId === 3 && layerId === 1 && bitrateIdx > 0 && bitrateIdx < 15 && srIdx < 3) {
        sampleRate = sampleRates[0][srIdx];
        const bitrate = bitrates[3][bitrateIdx] * 1000;
        const frameLength = Math.floor((144 * bitrate) / sampleRate) + padding;

        totalSamples += 1152;
        frameCount++;
        offset += frameLength;
        continue;
      }
    }
    offset++;
  }

  return totalSamples / sampleRate;
}

// Helper: Check if file already exists and is valid
function isValidExistingAudio(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const stat = fs.statSync(filePath);
  if (stat.size < 1000) return false;
  const buf = Buffer.alloc(10);
  const fd = fs.openSync(filePath, 'r');
  fs.readSync(fd, buf, 0, 10, 0);
  fs.closeSync(fd);
  const isId3 = buf.toString('utf-8', 0, 3) === 'ID3';
  const isSync = buf[0] === 0xFF && (buf[1] & 0xE0) === 0xE0;
  return isId3 || isSync;
}

async function synthesizeWithRetry(text, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: VOICE_SETTINGS
      })
    });

    if (res.ok) {
      const ab = await res.arrayBuffer();
      return Buffer.from(ab);
    }

    const errText = await res.text();
    console.warn(`    [Attempt ${attempt} Failed]: (${res.status}) ${errText.slice(0, 100)}`);

    if (res.status === 429) {
      console.log('    Rate limit hit. Waiting 5s before retry...');
      await new Promise(r => setTimeout(r, 5000));
    } else {
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  throw new Error(`Failed after ${retries} attempts.`);
}

async function runRollout() {
  const rolloutResults = [];
  let newlyGenerated = 0;
  let alreadyExisting = 0;
  let failedCount = 0;
  let totalDurationSec = 0;
  let totalCharsProcessed = 0;

  for (let i = 0; i < allCues.length; i++) {
    const cue = allCues[i];
    const fullPath = path.join(ROOT_DIR, cue.targetFile);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    process.stdout.write(`[${i + 1}/${allCues.length}] M${cue.moduleNumber} (${cue.cueId}): `);

    // Resumability check: Do not regenerate approved or existing valid files
    if (isValidExistingAudio(fullPath)) {
      const buf = fs.readFileSync(fullPath);
      const duration = getMp3Duration(buf);
      console.log(`ALREADY EXISTS ✓ (${buf.length} bytes, ${duration.toFixed(2)}s)`);
      alreadyExisting++;
      totalDurationSec += duration;
      totalCharsProcessed += cue.narration.length;

      rolloutResults.push({
        moduleNumber: cue.moduleNumber,
        cueId: cue.cueId,
        hudLabel: cue.hudLabel,
        targetFile: cue.targetFile,
        audioSrcPath: cue.audioSrcPath,
        wordCount: cue.wordCount,
        charCount: cue.charCount,
        fileSize: buf.length,
        durationSec: Number(duration.toFixed(3)),
        status: 'EXISTING_VALID',
        transcript: cue.narration
      });
      continue;
    }

    // Synthesize new file
    try {
      process.stdout.write('Synthesizing... ');
      const startMs = Date.now();
      const audioBuffer = await synthesizeWithRetry(cue.narration);
      fs.writeFileSync(fullPath, audioBuffer);
      const duration = getMp3Duration(audioBuffer);
      const elapsedMs = Date.now() - startMs;
      console.log(`SAVED ✓ (${audioBuffer.length} bytes, ${duration.toFixed(2)}s in ${(elapsedMs / 1000).toFixed(1)}s)`);

      newlyGenerated++;
      totalDurationSec += duration;
      totalCharsProcessed += cue.narration.length;

      rolloutResults.push({
        moduleNumber: cue.moduleNumber,
        cueId: cue.cueId,
        hudLabel: cue.hudLabel,
        targetFile: cue.targetFile,
        audioSrcPath: cue.audioSrcPath,
        wordCount: cue.wordCount,
        charCount: cue.charCount,
        fileSize: audioBuffer.length,
        durationSec: Number(duration.toFixed(3)),
        status: 'GENERATED_SUCCESS',
        transcript: cue.narration
      });

      // Controlled pacing delay between API calls to prevent rate limits
      await new Promise(r => setTimeout(r, 400));
    } catch (err) {
      console.error(`FAILED ✗: ${err.message}`);
      failedCount++;
      rolloutResults.push({
        moduleNumber: cue.moduleNumber,
        cueId: cue.cueId,
        hudLabel: cue.hudLabel,
        targetFile: cue.targetFile,
        audioSrcPath: cue.audioSrcPath,
        wordCount: cue.wordCount,
        charCount: cue.charCount,
        fileSize: 0,
        durationSec: 0,
        status: 'FAILED',
        error: err.message,
        transcript: cue.narration
      });
    }
  }

  console.log('\n================================================================');
  console.log('                   ROLLOUT EXECUTION SUMMARY');
  console.log('================================================================');
  console.log(`Total Cues Checked:    ${allCues.length}`);
  console.log(`Pre-existing Approved: ${alreadyExisting}`);
  console.log(`Newly Generated:       ${newlyGenerated}`);
  console.log(`Failed Generations:    ${failedCount}`);
  console.log(`Total Spoken Duration: ${(totalDurationSec / 60).toFixed(1)} minutes (${totalDurationSec.toFixed(1)}s)`);
  console.log(`Total Characters:      ${totalCharsProcessed}`);
  console.log('================================================================');

  fs.writeFileSync(
    path.join(ROOT_DIR, 'scratch', 'full_rollout_manifest.json'),
    JSON.stringify(rolloutResults, null, 2)
  );
  console.log('Saved detailed manifest to scratch/full_rollout_manifest.json');
}

runRollout();
