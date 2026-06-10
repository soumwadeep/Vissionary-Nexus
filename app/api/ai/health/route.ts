export async function GET() {
  try {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return Response.json(
        { 
          apiKeyDetected: false,
          nvidiaConnected: false,
          modelReachable: false
        },
        { status: 200 }
      );
    }

    // Test connection to NVIDIA API
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "meta/llama-3.3-70b-instruct",
        messages: [
          {
            role: "user",
            content: "Hello",
          },
        ],
        max_tokens: 1,
        temperature: 0.5,
      }),
    });

    const apiKeyDetected = true;
    const nvidiaConnected = response.ok;
    const modelReachable = response.ok;

    return Response.json({
      apiKeyDetected,
      nvidiaConnected,
      modelReachable,
      status: "connected"
    }, { status: 200 });
  } catch (error) {
    console.error("AI Health Check Error:", error);
    return Response.json(
      { 
        apiKeyDetected: !!process.env.NVIDIA_API_KEY,
        nvidiaConnected: false,
        modelReachable: false
      },
      { status: 200 }
    );
  }
}
