const fs = require("fs");
const Handlebars = require("handlebars");
const axios = require("axios");
const path = require("path");

async function generateHTML() {
  try {
    const response = await axios.get(
      "https://sansiriplc2.app.n8n.cloud/webhook-test/get-hijack-projects"
    );

    const projects = response.data.data;
    const templateContent = fs.readFileSync(
      path.join(__dirname, "template.html"),
      "utf-8"
    );
    const compileTemplate = Handlebars.compile(templateContent);

    // ตรวจว่ามีโฟลเดอร์ pages ถ้ายังไม่มีให้สร้าง
    const outputDir = path.join(__dirname, "pages");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    projects.forEach((project) => {
      const html = compileTemplate(project);
      const filename = `${project.projectSlug.replace(
        /[^a-z0-9\-]/gi,
        ""
      )}.html`;
      fs.writeFileSync(path.join(outputDir, filename), html, "utf-8");
      console.log(`✅ Generated: ${filename}`);
    });

    console.log("🎉 All HTML pages generated successfully!");
  } catch (error) {
    console.error("❌ Failed to generate HTML:", error.message);
  }
}

generateHTML();
