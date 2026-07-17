/**
 * Notification helper for sending alerts to the project owner
 */
export async function notifyOwner({
  title,
  content,
}: {
  title: string;
  content: string;
}): Promise<boolean> {
  try {
    const forgeApiUrl = process.env.BUILT_IN_FORGE_API_URL;
    const forgeApiKey = process.env.BUILT_IN_FORGE_API_KEY;

    if (!forgeApiUrl || !forgeApiKey) {
      console.warn("[Notification] Missing Forge API credentials");
      return false;
    }

    const response = await fetch(`${forgeApiUrl}/notification/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${forgeApiKey}`,
      },
      body: JSON.stringify({
        title,
        content,
        type: "info",
      }),
    });

    if (!response.ok) {
      console.warn("[Notification] Failed to send notification:", response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Notification] Error sending notification:", error);
    return false;
  }
}
