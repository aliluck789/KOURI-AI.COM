import fetch from "node-fetch";
import FormData from "form-data";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const DEEP_AI_KEY = 66ee75ca-89d7-4793-a627-83a272830007;
    if (!DEEP_AI_KEY) {
      return res.status(500).json({ error: "Missing DeepAI API Key" });
    }

    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch("https://api.deepai.org/api/torch-srgan", {
      method: "POST",
      headers: { "api-key": DEEP_AI_KEY },
      body: formData,
    });

    const data = await response.json();

    if (data.output_url) {
      res.status(200).json({ output_url: data.output_url });
    } else {
      res.status(500).json({ error: data.error || "Unknown error" });
    }
  } catch (error) {
    console.error("Enhance API Error:", error);
    res.status(500).json({ error: "Server error occurred" });
  }
}
