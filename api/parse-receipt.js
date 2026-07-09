// Vercel serverless function: parses a receipt photo into structured line
// items with Gemini. The API key stays server-side (Vercel env var).
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const PROMPT = [
  "Extract structured data from this receipt photo.",
  "Rules:",
  "- items: one entry per purchased line item. name is a short cleaned-up item name.",
  "  quantity is the number of units (1 if not shown). totalPrice is the line's total",
  "  price as printed (already multiplied by quantity).",
  "- Never include subtotal, tax, tip, service charge, or total lines as items.",
  "- Include discounts or promotions as items with a negative totalPrice.",
  "- tax: total tax/VAT/GST if shown separately, otherwise 0.",
  "- tip: tip or service charge if shown, otherwise 0.",
  "- total: the grand total printed on the receipt.",
  "- currency: ISO 4217 code (GBP, USD, EUR, ...) inferred from symbols or locale; empty string if unknown.",
  "- merchant: the store or restaurant name; empty string if unreadable.",
  "- date: purchase date as YYYY-MM-DD; empty string if unreadable."
].join("\n");

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    merchant: { type: "STRING" },
    date: { type: "STRING" },
    currency: { type: "STRING" },
    items: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          quantity: { type: "NUMBER" },
          totalPrice: { type: "NUMBER" }
        },
        required: ["name", "totalPrice"]
      }
    },
    tax: { type: "NUMBER" },
    tip: { type: "NUMBER" },
    total: { type: "NUMBER" }
  },
  required: ["items"]
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Receipt scanning is not configured (missing GEMINI_API_KEY)." });
    return;
  }

  const { data, mimeType } = req.body || {};
  if (typeof data !== "string" || !data || !ALLOWED_TYPES.has(mimeType)) {
    res.status(400).json({ error: "Send JSON with base64 `data` and an image `mimeType`." });
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ inlineData: { mimeType, data } }, { text: PROMPT }] }],
          generationConfig: {
            temperature: 0,
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA
          }
        })
      }
    );

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      res.status(502).json({ error: payload?.error?.message || `Gemini returned ${response.status}.` });
      return;
    }

    const text = (payload?.candidates?.[0]?.content?.parts || [])
      .map((part) => part.text || "")
      .join("");
    const parsed = text ? JSON.parse(text) : null;
    if (!parsed || !Array.isArray(parsed.items)) throw new Error("no-items");

    res.status(200).json(parsed);
  } catch (error) {
    res.status(502).json({ error: "Could not read the receipt. Try a clearer photo." });
  }
};
