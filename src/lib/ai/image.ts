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

  // Check for sync mode output with base64 image
  const choices = data.output?.choices;
  if (choices) {
    for (const choice of choices) {
      for (const content of choice.message?.content || []) {
        if (content.image) {
          return `data:image/png;base64,${content.image}`;
        }
        if (content.image_url?.url) {
          return content.image_url.url;
        }
      }
    }
  }

  // Fallback: check for async task
  if (data.output?.task_id) {
    return pollTaskResult(data.output.task_id, apiKey);
  }

  return '';
}

async function pollTaskResult(taskId: string, apiKey: string): Promise<string> {
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 2000));

    const response = await fetch(
      `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    if (!response.ok) continue;

    const data = await response.json();

    if (data.output?.task_status === 'SUCCEEDED') {
      return data.output?.results?.[0]?.url || '';
    }

    if (data.output?.task_status === 'FAILED') {
      throw new Error('Image generation failed');
    }
  }

  throw new Error('Image generation timed out');
}
