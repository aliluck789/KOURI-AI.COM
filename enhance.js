import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;
    if (!REPLICATE_API_KEY) {
      return res.status(500).json({ error: "Missing Replicate API key" });
    }

    // إرسال الصورة إلى نموذج Real-ESRGAN على Replicate
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "fac1b2e68fae2f3cd2d5300de4eae0d96e58caa6bfb1c3dc1d47f8d609a9924f", // Real-ESRGAN
        input: { image }
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    // جلب النتيجة بعد اكتمال المعالجة
    const resultUrl = data.output?.[0];
    if (!resultUrl) {
      return res.status(202).json({ message: "Processing... please wait." });
    }

    res.status(200).json({ output_url: resultUrl });
  } catch (error) {
    console.error("Replicate API Error:", error);
    res.status(500).json({ error: "Server error occurred" });
  }
}
