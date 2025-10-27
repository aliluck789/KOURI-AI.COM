KOURI AI — Vercel-ready deployment (EN/AR)
-------------------------------------------

This project is prepared for deployment to Vercel as a static site with a serverless function.

How it works:
- Frontend (index.html, script.js, style.css) is static and sends the selected image as a base64 data URL to /api/enhance.
- /api/enhance is a Vercel serverless function (Node.js) that reads the DEEP_AI_KEY from environment variables,
  converts the base64 image to a buffer and forwards it to DeepAI (torch-srgan). It returns DeepAI's response JSON to the client.

Setup & deploy on Vercel:
1) Create a new project on Vercel and connect the repository (or upload files).
2) In Project Settings → Environment Variables add:
   - Key: DEEP_AI_KEY
   - Value: <your DeepAI API key>
   Set the environment for Preview and Production as needed.
3) Deploy. The function will run as /api/enhance.
4) For local testing you can use `vercel dev` (install Vercel CLI) or test by setting env and using a simple server.

Notes:
- The project expects DEEP_AI_KEY to be set in Vercel's Environment Variables. Do NOT hardcode the key in the code.
- DeepAI may return an output_url pointing to the enhanced image; the frontend will display it.
- If you hit rate limits or errors, check Vercel function logs and DeepAI account limits.
