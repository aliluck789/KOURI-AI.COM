const fetch = require('node-fetch');
const FormData = require('form-data');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { image } = req.body || {};

    if (!image) {
      res.status(400).json({ error: 'No image provided' });
      return;
    }

    const matches = image.match(/^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/);
    if (!matches) {
      res.status(400).json({ error: 'Invalid image format. Expecting data URL.' });
      return;
    }

    const mime = matches[1];
    const base64Data = matches[3];
    const buffer = Buffer.from(base64Data, 'base64');

    const DEEP_AI_KEY = process.env.DEEP_AI_KEY;
    if (!DEEP_AI_KEY) {
      res.status(500).json({ error: 'Server misconfigured: missing DEEP_AI_KEY' });
      return;
    }

    const form = new FormData();
    form.append('image', buffer, { filename: 'upload.png', contentType: mime });

    const response = await fetch('https://api.deepai.org/api/torch-srgan', {
      method: 'POST',
      headers: { 'api-key': DEEP_AI_KEY },
      body: form
    });

    const json = await response.json();

    res.status(response.ok ? 200 : 500).json(json);
  } catch (err) {
    console.error('Error in /api/enhance:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
