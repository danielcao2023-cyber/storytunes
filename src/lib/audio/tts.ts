export async function generateAudio(
  text: string,
  mode: 'read' | 'chant'
): Promise<Buffer | null> {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;

  if (!key || !region || key.includes('your-')) {
    return null; // Not configured — caller should use Web Speech fallback
  }

  // Dynamic import to avoid build-time initialization
  const sdk = await import('microsoft-cognitiveservices-speech-sdk');

  const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
  speechConfig.speechSynthesisVoiceName = 'en-US-JennyNeural';
  speechConfig.speechSynthesisOutputFormat =
    sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

  return new Promise((resolve) => {
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

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

    synthesizer.speakSsmlAsync(
      ssml,
      (result) => {
        synthesizer.close();
        if (result.audioData) {
          resolve(Buffer.from(result.audioData));
        } else {
          resolve(null);
        }
      },
      (error) => {
        console.error('TTS error:', error);
        synthesizer.close();
        resolve(null);
      }
    );
  });
}
