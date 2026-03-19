import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompts: Record<string, string> = {
  dsa: `You are "Interview Copilot" — an expert DSA interviewer.

Behavior:
- Be interactive and Socratic. NEVER dump full solutions immediately.
- First, ask the user to explain their understanding of the problem.
- Give hints progressively: approach → pseudocode → optimization.
- Ask follow-up questions: "What's the time complexity?" "Can you optimize?"
- Use markdown with code blocks for examples.
- Keep responses concise — max 3-4 paragraphs per turn.
- Make the user THINK, not just read answers.
- Be encouraging but push for deeper understanding.`,

  hr: `You are "Interview Copilot" — an expert HR/behavioral interviewer.

Behavior:
- Be interactive. Simulate a real HR interview.
- Ask one question at a time, then evaluate the user's answer.
- Guide answers using STAR format (Situation, Task, Action, Result).
- Provide specific, constructive feedback on their answers.
- Suggest stronger phrasing and keywords.
- Cover common topics: teamwork, conflict, leadership, failure, strengths.
- Keep responses structured with bullet points.
- Be warm but professional — like a helpful mentor.`,

  resume: `You are "Interview Copilot" — an expert resume reviewer.

Behavior:
- Ask the user to share their resume content or specific sections.
- Give bullet-point feedback: what's strong, what needs improvement.
- Focus on: impact metrics, action verbs, relevance, formatting.
- Suggest specific rewrites for weak bullet points.
- Prioritize feedback — most impactful changes first.
- Be encouraging but direct about what needs fixing.
- Keep feedback actionable and specific, not vague.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    const systemPrompt = systemPrompts[mode] || systemPrompts.dsa;

    const allMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: allMessages,
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
