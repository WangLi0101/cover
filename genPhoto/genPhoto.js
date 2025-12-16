const { chromium } = require("playwright");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch();
  // Use a new context with high device scale factor (Retina display simulation) for better clarity
  const context = await browser.newContext({
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const width = 1280;
  const height = 720;

  await page.setViewportSize({ width, height });

  // Update path to html file (assuming it's in html folder based on ls -R)
  // The previous code had 'markdown_files', but ls -R showed it in 'html' folder
  // Wait, the ls -R showed: ./genPhoto/html: useEffect-cover.html
  // And this script is in ./genPhoto/genPhoto.js
  // So the relative path is ./html/useEffect-cover.html

  // const filePath = path.join(__dirname, "html", "safe-integer-cyber-cover.html");
  const filePath = path.join(__dirname, "html", "lets_encrypt_vaporwave_cover.html");
  const fileUrl = `file://${filePath}`;

  console.log(`Loading: ${fileUrl}`);
  try {
    await page.goto(fileUrl, { waitUntil: "networkidle" });
  } catch (error) {
    console.error(`Failed to load page: ${error.message}`);
    await browser.close();
    return;
  }

  const element = await page.$("#cover-container");

  if (element) {
    const box = await element.boundingBox();
    if (box) {
      // Define output directory and files
      const outputDir = path.join(__dirname, "photo");

      // Ensure output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const pngPath = path.join(outputDir, "lets_encrypt_vaporwave_cover.png");
      const webpPath = path.join(outputDir, "lets_encrypt_vaporwave_cover.webp");

      // 1. Save as PNG using Playwright
      await page.screenshot({
        path: pngPath,
        type: "png",
        clip: box,
        omitBackground: true, // Ensure transparent background
      });
      console.log(`Saved intermediate PNG to: ${pngPath}`);

      // 2. Convert PNG to WebP using ffmpeg via spawn
      console.log("Converting to WebP using ffmpeg...");

      await new Promise((resolve, reject) => {
        const ffmpeg = spawn("ffmpeg", [
          "-i",
          pngPath,
          "-vf",
          "scale=1200:-1:flags=lanczos", // Scale width to 1200px
          "-c:v",
          "libwebp",
          "-lossless",
          "0", // Switch back to LOSSY mode
          "-quality",
          "75", // Quality 75
          "-compression_level",
          "6", // Highest compression effort
          "-preset",
          "text", // Optimize for text/graphics
          "-y",
          webpPath,
        ]);

        ffmpeg.stdout.on("data", (data) => {
          // console.log(`ffmpeg stdout: ${data}`);
        });

        ffmpeg.stderr.on("data", (data) => {
          // ffmpeg logs to stderr
          // console.log(`ffmpeg stderr: ${data}`);
        });

        ffmpeg.on("close", (code) => {
          if (code === 0) {
            const stats = fs.statSync(webpPath);
            const fileSizeInBytes = stats.size;
            const fileSizeInKB = fileSizeInBytes / 1024;
            console.log(`Successfully converted to: ${webpPath}`);
            console.log(`File size: ${fileSizeInKB.toFixed(2)} KB`);
            resolve();
          } else {
            console.error(`ffmpeg process exited with code ${code}`);
            reject(new Error(`ffmpeg exited with code ${code}`));
          }
        });

        ffmpeg.on("error", (err) => {
          console.error("Failed to start ffmpeg process:", err);
          reject(err);
        });
      });

      // Optional: Delete the intermediate PNG file
      // fs.unlinkSync(pngPath);
      // console.log('Deleted intermediate PNG file.');
    }
  } else {
    console.error("Could not find #cover-container element.");
  }

  await browser.close();
})();
