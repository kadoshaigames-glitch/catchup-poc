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

console.log('ELEVENLABS_API_KEY loaded: YES');

const VOICE_REF_PATH = path.join(ROOT_DIR, 'public', 'assets', 'audio', 'awang', 'Awang-intro.mp3');
if (!fs.existsSync(VOICE_REF_PATH)) {
  console.error('[Error] Voice reference sample not found at:', VOICE_REF_PATH);
  process.exit(1);
}

const welcomeText = "Welcome to Module 1: Understanding AI Basics and How to Use It. Artificial intelligence is no longer a future concept—it is an everyday workplace capability to help you work faster, think more clearly, and eliminate manual busywork. Over the next ten minutes, we will unpack what AI actually is, understand the prediction engine behind it, match your tasks to the right tools, and master prompt engineering using the CRE and 10-step frameworks.";

async function getOrCreateAwangVoice() {
  console.log('Querying ElevenLabs voices list...');
  const listRes = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': apiKey }
  });

  if (!listRes.ok) {
    const errText = await listRes.text();
    throw new Error(`Failed to query voices (${listRes.status}): ${errText}`);
  }

  const listData = await listRes.json();
  const existingAwang = listData.voices?.find(v => v.name?.toLowerCase().includes('awang'));

  if (existingAwang) {
    console.log(`Found existing Awang voice in account: "${existingAwang.name}" (ID: ${existingAwang.voice_id})`);
    return { voiceId: existingAwang.voice_id, isNew: false, name: existingAwang.name };
  }

  console.log('No existing Awang voice found in account. Creating instant voice clone from Awang-intro.mp3...');
  const audioBuffer = fs.readFileSync(VOICE_REF_PATH);
  const formData = new FormData();
  formData.append('name', 'Awang Corporate Instructor');
  formData.append('description', 'Official Awang 3D instructor voice for CatchUp AI training modules cloned from Awang-intro.mp3 reference sample.');
  formData.append('files', new Blob([audioBuffer], { type: 'audio/mpeg' }), 'Awang-intro.mp3');

  const addRes = await fetch('https://api.elevenlabs.io/v1/voices/add', {
    method: 'POST',
    headers: { 'xi-api-key': apiKey },
    body: formData
  });

  if (!addRes.ok) {
    const errText = await addRes.text();
    throw new Error(`Failed to clone voice (${addRes.status}): ${errText}`);
  }

  const addData = await addRes.json();
  console.log(`Successfully created new cloned voice ID: ${addData.voice_id}`);
  return { voiceId: addData.voice_id, isNew: true, name: 'Awang Corporate Instructor' };
}

async function synthesizeWelcomeAudio(voiceId) {
  console.log('Synthesizing Module 1 Welcome narration...');
  console.log(`Transcript Length: ${welcomeText.length} characters, ${welcomeText.split(/\s+/).length} words.`);

  const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text: welcomeText,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.50,
        similarity_boost: 0.85,
        style: 0.0,
        use_speaker_boost: true
      }
    })
  });

  if (!ttsRes.ok) {
    const errText = await ttsRes.text();
    throw new Error(`TTS synthesis failed (${ttsRes.status}): ${errText}`);
  }

  const arrayBuffer = await ttsRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const outputDir = path.join(ROOT_DIR, 'public', 'assets', 'audio', 'awang', 'module-1');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'welcome.mp3');
  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Saved generated audio file: ${outputPath} (${buffer.length} bytes)`);

  return { outputPath, fileSize: buffer.length };
}

async function main() {
  try {
    const voiceInfo = await getOrCreateAwangVoice();
    const synthInfo = await synthesizeWelcomeAudio(voiceInfo.voiceId);

    // Save metadata for inspection
    const resultMeta = {
      apiKeyDetected: true,
      voiceId: voiceInfo.voiceId,
      voiceName: voiceInfo.name,
      isNewClone: voiceInfo.isNew,
      transcript: welcomeText,
      outputFile: 'public/assets/audio/awang/module-1/welcome.mp3',
      fileSize: synthInfo.fileSize
    };

    fs.writeFileSync(path.join(ROOT_DIR, 'scratch', 'm1_welcome_synth_result.json'), JSON.stringify(resultMeta, null, 2));
    console.log('\nGeneration complete! Metadata saved to scratch/m1_welcome_synth_result.json');
  } catch (err) {
    console.error('\n[Error]:', err.message);
    process.exit(1);
  }
}

main();
