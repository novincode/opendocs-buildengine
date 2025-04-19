import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import matter from 'gray-matter';
import { renderMdxToHtml } from "./render-mdx";

config();

const DOCS_REPO = process.env.DOCS_REPO;
if (!DOCS_REPO) {
    console.error('❌ DOCS_REPO environment variable not set.');
    process.exit(1);
}

const TEMP_DIR = 'tempdocs';
const OUTPUT_DIR = path.join(process.cwd(), "htmlrepo", DOCS_REPO); // Output to htmlrepo/${DOCS_REPO}

// Clean up tempdocs and output dir if they exist
if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
if (fs.existsSync(OUTPUT_DIR)) fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });

// Clone the docs repo
console.log(`🚚 Cloning https://github.com/novincode/${DOCS_REPO} ...`);
execSync(`git clone --depth=1 https://github.com/novincode/${DOCS_REPO} ${TEMP_DIR}`, { stdio: 'inherit' });

// Find all .mdx files in tempdocs
function findMdxFiles(dir: string): string[] {
    let results: string[] = [];
    for (const file of fs.readdirSync(dir)) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
            results = results.concat(findMdxFiles(full));
        } else if (file.endsWith('.mdx')) {
            results.push(full);
        }
    }
    return results;
}

const mdxFiles = findMdxFiles(TEMP_DIR);
if (!mdxFiles.length) {
    console.warn('⚠️ No .mdx files found.');
    process.exit(0);
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Convert each .mdx file to HTML
(async () => {
    // Process files
    for (const file of mdxFiles) {
        const rel = path.relative(TEMP_DIR, file);
        const outPath = path.join(OUTPUT_DIR, rel.replace(/\.mdx$/, '.html'));
        fs.mkdirSync(path.dirname(outPath), { recursive: true }); // Ensure output subdirs exist
        const mdxSource = fs.readFileSync(file, 'utf8');
        const { content, data } = matter(mdxSource);
        const html = await renderMdxToHtml(content);
        fs.writeFileSync(outPath, html);
        console.log(`✅ Built: ${outPath}`);
    }
    console.log('🎉 All docs built!');
    // Remove tempdocs after building
    if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
})();