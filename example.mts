import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';
import 'dotenv/config';

const elevenlabs = new ElevenLabsClient();

async function main() {
  let b1 = false;

  if (b1) {
    const audio = await elevenlabs.textToSpeech.convert('2EiwWnXFnvU5JabPnv8n', {
      text: 'Bus 1 is x minutes away.',
      modelId: 'eleven_multilingual_v2',
      outputFormat: 'mp3_44100_128',
    });
    await play(audio);
  }
  else{
      const audio = await elevenlabs.textToSpeech.convert('PPzYpIqttlTYA83688JI', {
      text: 'Bus 2 is x minutes away.',
      modelId: 'eleven_multilingual_v2',
      outputFormat: 'mp3_44100_128',
    });
    await play(audio);
  }

  b1 = true;
  if (b1) {
    const audio = await elevenlabs.textToSpeech.convert('KSsyodh37PbfWy29kPtx', {
      text: 'Bus 1 is x minutes away.',
      modelId: 'eleven_multilingual_v2',
      outputFormat: 'mp3_44100_128',
    });
    await play(audio);
  }
  else{
      const audio = await elevenlabs.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', {
      text: 'hello world.',
      modelId: 'eleven_multilingual_v2',
      outputFormat: 'mp3_44100_128',
    });
    await play(audio);
  }
}

main().catch(console.error);
