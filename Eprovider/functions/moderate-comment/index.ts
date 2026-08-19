export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { commentId, action, reason, moderatorId } = await request.json();

    if (!commentId || !["approve", "reject", "spam"].includes(action)) {
      return new Response(JSON.stringify({ error: "Invalid action or commentId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newStatus = action === "approve" ? "approved" : action === "reject" ? "rejected" : "spam";

    return new Response(
      JSON.stringify({
        success: true,
        commentId,
        status: newStatus,
        moderatedBy: moderatorId,
        reason: reason || "Reviewed by moderator",
        timestamp: new Date().toISOString(),
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