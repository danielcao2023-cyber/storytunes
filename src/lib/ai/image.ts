const QWEN_API =
  'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';

export async function generateImage(prompt: string): Promise<string> {
  const apiKey = process.env.QWEN_IMAGE_API_KEY;

  if (!apiKey || apiKey.includes('your-')) {
    return ''; // Not configured — will use placeholder
  }

  const body = {
    model: 'qwen-image-2.0',
    input: {
      messages: [
        {
          role: 'user',
          content: [
            {
              text: `Children's book illustration, watercolor style, warm colors, cute, simple composition. No text, no words. ${prompt}`,
            },
          ],
        },
      ],
    },
    parameters: {
      size: '1024*1024',
      n: 1,
      prompt_extend: true,
      watermark: false,
    },
  };

  const response = await fetch(QWEN_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Qwen-Image API error: ${response.status} ${err}`);
  }

  const data = await response.json();

  let imageUrl = '';

  // Qwen sync mode: returns image URL in content.image or content.image_url
  const choices = data.output?.choices;
  if (choices) {
    for (const choice of choices) {
      for (const content of choice.message?.content || []) {
        if (content.image && typeof content.image === 'string') {
          imageUrl = content.image;
        }
        if (content.image_url?.url) {
          imageUrl = content.image_url.url;
        }
      }
    }
  }

  // Download and re-encode as base64 data URI (Qwen URLs expire)
  if (imageUrl && imageUrl.startsWith('http')) {
    const imgRes = await fetch(imageUrl);
    if (imgRes.ok) {
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      const mime = imgRes.headers.get('content-type') || 'image/png';
      return `data:${mime};base64,${buffer.toString('base64')}`;
    }
  }

  return imageUrl; // Fallback: raw URL (may expire)
}
