const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

(async () => {
    try {
        const browser = await chromium.launch();
        const context = await browser.newContext({
            deviceScaleFactor: 2, // High resolution for crisp text
        });
        const page = await context.newPage();

        const inputHtmlPath = path.join(__dirname, "card_html", "customRef.html");
        
        // Output directory
        const outputDir = path.join(__dirname, "card_photo");
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const fileUrl = `file://${inputHtmlPath}`;
        console.log(`Loading: ${fileUrl}`);

        await page.goto(fileUrl, { waitUntil: "networkidle" });

        // Get all card elements
        const cards = await page.$$('.card');
        console.log(`Found ${cards.length} cards.`);

        if (cards.length === 0) {
            console.error("No cards found! Check selector .card");
        }

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const safeIndex = (i + 1).toString().padStart(2, '0');
            const outputPath = path.join(outputDir, `customRef_card_${safeIndex}.png`);

            await card.screenshot({
                path: outputPath,
                type: "png",
                omitBackground: true
            });

            console.log(`Saved: ${outputPath}`);
        }

        await browser.close();
        console.log("Done!");

    } catch (error) {
        console.error("An error occurred:", error);
    }
})();
