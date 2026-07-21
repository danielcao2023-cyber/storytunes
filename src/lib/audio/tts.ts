const TTS_API = (region: string) =>
  `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

export async function generateAudio(
  text: string,
  mode: 'read' | 'chant'
): Promise<Buffer | null> {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;

  if (!key || !region || key.includes('your-')) {
    return null;
  }

  let ssml: string;
  if (mode === 'chant') {
    const lines = text
      .split('\n')
      .map((line) => `<p>${line}</p>`)
      .join('');
    ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="en-US-JennyNeural">
          <prosody rate="0.7" pitch="+10%">
            ${lines}
          </prosody>
        </voice>
      </speak>
    `;
  } else {
    ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="en-US-JennyNeural">
          <prosody rate="0.85">
            ${text}
          </prosody>
        </voice>
      </speak>
    `;
  }

  try {
    const response = await fetch(TTS_API(region), {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
      },
      body: ssml.trim(),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`Azure TTS error ${response.status}:`, err);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Azure TTS request failed:', error);
    return null;
  }
}
