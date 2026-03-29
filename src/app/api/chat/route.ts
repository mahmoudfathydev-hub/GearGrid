import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    console.log("Server: API Key status:", apiKey ? "Present" : "Missing");
    console.log("Server: API Key length:", apiKey?.length || 0);

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 },
      );
    }

    const prompt = `You are a knowledgeable car expert. Answer the user's question accurately and helpfully about cars, automotive features, recommendations, or general automotive advice.

User Question: ${message}

Provide a detailed, helpful response. Be conversational and friendly.`;

    console.log("Server: Making Gemini API call...");
    console.log("Server: Prompt length:", prompt.length);
    console.log(
      "Server: API URL:",
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey?.substring(0, 10)}...`,
    );

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500,
          },
        }),
      },
    );

    console.log("Server: Gemini response status:", response.status);
    console.log(
      "Server: Gemini response headers:",
      Object.fromEntries(response.headers.entries()),
    );
    console.log("Server: Gemini response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server: Gemini API Error:", errorText);
      console.error(
        "Server: Error details:",
        JSON.stringify(errorText, null, 2),
      );

      // Return a helpful fallback response when Gemini fails
      const fallbackResponses = [
        "I'm here to help with car questions! While my AI services are temporarily unavailable, I can tell you that I'm designed to assist with car recommendations, feature comparisons, and automotive advice. Please try again in a few moments.",
        "Thanks for your question about cars! My AI services are experiencing some technical difficulties right now. I'm normally able to help with car recommendations, comparisons, and general automotive advice. Please try again shortly.",
        "I'd love to help with your car question! It seems my AI connection is temporarily down. I'm usually able to assist with vehicle recommendations, feature explanations, and automotive guidance. Please give me another try in a moment.",
      ];

      const fallbackResponse =
        fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      console.log("Server: Using fallback response:", fallbackResponse);
      return NextResponse.json({ response: fallbackResponse });
    }

    const data = await response.json();

    console.log("Server: Gemini response data:", data);

    // Gemini response format
    const responseText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't generate a response. Please try again.";

    console.log("Server: Final response text:", responseText);
    console.log("Server: Response text length:", responseText?.length || 0);

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
