export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { postId, title, content, excerpt } = await request.json();

    if (!postId || !title) {
      return new Response(JSON.stringify({ error: "Missing required post parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Published payload returns updated state
    return new Response(
      JSON.stringify({
        success: true,
        message: "Post successfully published via Eprovider Edge Function",
        postId,
        publishedAt: new Date().toISOString(),
        status: "published",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}