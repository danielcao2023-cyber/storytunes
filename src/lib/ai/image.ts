const QWEN_API_BASE =
  'https://dashscope.aliyuncs.com/api/v1/services/aigc/image-generation/generation';

export async function generateImage(prompt: string): Promise<string> {
  const response = await fetch(QWEN_API_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.QWEN_IMAGE_API_KEY}`,
      'Content-Type': 'application/json',
      'X-DashScope-Async': 'enable',
    },
    body: JSON.stringify({
      model: 'qwen-image-2.0',
      input: {
        prompt: `Children's book illustration, watercolor style, warm colors, cute, simple composition. No text, no words. ${prompt}`,
      },
      parameters: {
        size: '1024*1024',
        n: 1,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Qwen-Image API error: ${response.status} ${err}`);
  }

  const data = await response.json();

  if (data.output?.task_id) {
    return pollTaskResult(data.output.task_id);
  }

  return data.output?.results?.[0]?.url || '';
}

async function pollTaskResult(taskId: string): Promise<string> {
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 2000));

    const response = await fetch(
      `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.QWEN_IMAGE_API_KEY}`,
        },
      }
    );

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
