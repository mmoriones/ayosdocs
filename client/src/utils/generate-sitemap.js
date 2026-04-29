import fs from "fs";
import path from "path";

const guidesDir = path.resolve("./src/data/guides");
const baseUrl = "https://ayosdocs.com";

const files = fs.readdirSync(guidesDir);

const urls = files
    .filter(file => file.endsWith(".md"))
    .map(file => {
        const slug = file.replace(".md", "");
        return ` 
    <url>
        <loc>${baseUrl}/guides/${slug}</loc>
    </url>`;
    })
    .join("");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://ayosdocs.com/guides</loc>
    </url> 
${urls}
</urlset>`;

fs.writeFileSync("./public/sitemap.xml", sitemap);

console.log("sitemap.xml generated");
