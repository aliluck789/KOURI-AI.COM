/* KOURI AI — script.js (sends base64 to serverless /api/enhance) */
document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const body = document.body;
  const btnEn = document.getElementById("btn-en");
  const btnAr = document.getElementById("btn-ar");
  const uploadForm = document.getElementById("uploadForm");
  const imageInput = document.getElementById("imageInput");
  const beforeImage = document.getElementById("beforeImage");
  const resultImage = document.getElementById("resultImage");
  const loadingEl = document.getElementById("loading");
  const downloadLink = document.getElementById("downloadLink");
  const resetBtn = document.getElementById("resetBtn");

  function setLang(lang) {
    if (lang === "ar") {
      body.classList.remove("en");
      body.classList.add("ar");
      html.lang = "ar";
      html.dir = "rtl";
      btnAr.classList.add("active");
      btnEn.classList.remove("active");
    } else {
      body.classList.remove("ar");
      body.classList.add("en");
      html.lang = "en";
      html.dir = "ltr";
      btnEn.classList.add("active");
      btnAr.classList.remove("active");
    }
    // translate text nodes with data-en / data-ar attributes
    document.querySelectorAll("[data-en]").forEach(el => {
      const en = el.getAttribute("data-en");
      const ar = el.getAttribute("data-ar");
      el.textContent = (lang === "ar") ? ar : en;
    });
  }

  // default
  setLang("en");

  btnEn.addEventListener("click", () => setLang("en"));
  btnAr.addEventListener("click", () => setLang("ar"));

  // preview selected image and prepare base64
  let imageBase64 = null;
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      beforeImage.src = ev.target.result;
      imageBase64 = ev.target.result; // data URL
    };
    reader.readAsDataURL(file);
    // hide previous results
    resultImage.src = "";
    downloadLink.style.display = "none";
  });

  resetBtn.addEventListener("click", () => {
    imageInput.value = "";
    beforeImage.src = "";
    resultImage.src = "";
    downloadLink.style.display = "none";
    imageBase64 = null;
  });

  uploadForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    if (!imageBase64) {
      alert((document.documentElement.lang === "ar") ? "المرجو اختيار صورة أولاً" : "Please choose an image first");
      return;
    }

    loadingEl.style.display = "flex";
    resultImage.src = "";
    downloadLink.style.display = "none";

    try {
      const resp = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageBase64 })
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error("Proxy error:", text);
        throw new Error("Proxy returned an error");
      }

      const json = await resp.json();

      if (json.output_url) {
        resultImage.src = json.output_url;
        downloadLink.href = json.output_url;
        downloadLink.style.display = "inline-block";
      } else if (json.error) {
        console.error("Backend error:", json);
        alert((document.documentElement.lang === "ar") ? "حدث خطأ أثناء المعالجة" : "An error occurred while processing the image.");
      } else {
        console.error("Unexpected response:", json);
        alert((document.documentElement.lang === "ar") ? "حدث خطأ أثناء المعالجة" : "An error occurred while processing the image.");
      }
    } catch (err) {
      console.error(err);
      alert((document.documentElement.lang === "ar") ? "فشل الاتصال بالخدمة" : "Failed to connect to the service.");
    } finally {
      loadingEl.style.display = "none";
    }
  });
});
