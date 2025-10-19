const express = require('express');
const { ElevenLabsClient, play } = require('@elevenlabs/elevenlabs-js');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());

const elevenlabs = new ElevenLabsClient();

app.post('/tts', async (req, res) => {
  const {status, issueKey, issueName } = req.body;

  try {

    // message = `Bus number ${issueKey} has moved to ${status}`;
    // voiceId = 'JBFqnCBsd6RMkjVDRZzb';

    // if (issueKey === 'RD-2') {
    //     message = `Bus number ${issueKey} has moved to ${status}`;
    //     voiceId = 'JBFqnCBsd6RMkjVDRZzb';
    // }

    // if (issueName === 'Bus 1') {
    //     message = `Awoo! ${issueName} has moved to ${status}`;
    //     voiceId = 'JBFqnCBsd6RMkjVDRZzb'; 
    // }

    if (issueName === 'Awoo Stu (Bus 4)') {
        message = `Awoo! ${issueName} has moved to ${status}`;
        voiceId = 'JBFqnCBsd6RMkjVDRZzb'; 
    }

    if (issueName === 'Howly Hank (Bus 5)') {
        message = `All Aboard! ${issueName} has arrived at ${status}`;
        //message = `Bus ${issueName} has moved to ${status}`;
        voiceId = 'JBFqnCBsd6RMkjVDRZzb'; 
    }

    if (issueName === 'Skye (Bus 6)') {
        //message = `Bus ${issueName} has moved to ${status}`;
        message = `Let's take to the sky! ${issueName} pulling up to ${status}`;
        voiceId = 'JBFqnCBsd6RMkjVDRZzb'; 
    }

    if (issueName === 'Ecstatic Pup (Bus 3)') {
        //message = `Bus ${issueName} has moved to ${status}`;
        message = `Get ecstatic because ${issueName} has moved to ${status}`;
        voiceId = 'JBFqnCBsd6RMkjVDRZzb'; 
    }

    if (issueName === 'Intelli-Dog (Bus 1)') {
        //message = `Bus ${issueName} has moved to ${status}`;
        message = `${issueName} has moved to ${status}, ready to rescue more riders`;
        voiceId = 'JBFqnCBsd6RMkjVDRZzb'; 
    }

    if (issueName === 'Purple Patrol (7)') {
        //message = `Bus ${issueName} has moved to ${status}`;
        message = `${issueName} is patrolling to ${status}`;
        voiceId = 'EXAVITQu4vr4xnSDxMaL'; 
    }

    if (issueName === 'Shadow Paw (Bus 2)') {
        message = `A shadow descends as ${issueName} moves to ${status}`;
        //message = `Bus ${issueName} has moved to ${status}`;
        voiceId = 'JBFqnCBsd6RMkjVDRZzb'; 
    }

    const audio = await elevenlabs.textToSpeech.convert(voiceId, {
      text: message,
      modelId: 'eleven_multilingual_v2',
      outputFormat: 'mp3_44100_128',
    });

    await play(audio);
    res.status(200).send('TTS played successfully');
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).send('Error playing TTS');
  }
});

app.listen(port, () => {
  console.log(`TTS server listening at http://localhost:${port}`);
});
