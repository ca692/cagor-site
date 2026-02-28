const fs = require('fs');
const path = require('path');

// Read data files
const contact = JSON.parse(fs.readFileSync('_data/contact.json', 'utf8'));
const homepage = JSON.parse(fs.readFileSync('_data/homepage.json', 'utf8'));

// Read news files
const newsDir = '_news';
const newsFiles = fs.readdirSync(newsDir).filter(f => f.endsWith('.md'));
const news = newsFiles.map(file => {
    const content = fs.readFileSync(path.join(newsDir, file), 'utf8');
    const frontmatter = content.match(/---\n([\s\S]*?)\n---/);
    if (!frontmatter) return null;
    const data = {};
    frontmatter[1].split('\n').forEach(line => {
        const match = line.match(/^(\w+):\s*"?(.*?)"?\s*$/);
        if (match) data[match[1]] = match[2].replace(/^"|"$/g, '');
    });
    return data;
}).filter(Boolean).sort((a, b) => {
    // Sort by date descending (newest first)
    return newsFiles.indexOf(newsFiles.find(f => f.includes(b.date))) -
           newsFiles.indexOf(newsFiles.find(f => f.includes(a.date)));
});

// Read the template
let html = fs.readFileSync('templates/index.template.html', 'utf8');

// Replace all placeholders using a helper
function replaceAll(str, find, replacement) {
    return str.split(find).join(replacement);
}

// Replace contact info
html = replaceAll(html, '{{contact.address_fr}}', contact.address_fr);
html = replaceAll(html, '{{contact.address_ar}}', contact.address_ar || '');
html = replaceAll(html, '{{contact.phone1}}', contact.phone1);
html = replaceAll(html, '{{contact.phone2}}', contact.phone2);
html = replaceAll(html, '{{contact.email1}}', contact.email1);
html = replaceAll(html, '{{contact.email2}}', contact.email2);
html = replaceAll(html, '{{contact.hours_fr}}', contact.hours_fr);
html = replaceAll(html, '{{contact.hours_ar}}', contact.hours_ar || '');
html = replaceAll(html, '{{contact.facebook}}', contact.facebook);
html = replaceAll(html, '{{contact.maps_url}}', contact.maps_url);

// Replace homepage content
html = replaceAll(html, '{{hero.title_fr}}', homepage.hero.title_fr);
html = replaceAll(html, '{{hero.title_ar}}', homepage.hero.title_ar || '');
html = replaceAll(html, '{{hero.btn1_fr}}', homepage.hero.btn1_fr);
html = replaceAll(html, '{{hero.btn2_fr}}', homepage.hero.btn2_fr);
html = replaceAll(html, '{{about.title_fr}}', homepage.about.title_fr);
html = replaceAll(html, '{{about.title_ar}}', homepage.about.title_ar || '');
html = replaceAll(html, '{{about.p1_fr}}', homepage.about.p1_fr);
html = replaceAll(html, '{{about.p1_ar}}', homepage.about.p1_ar || '');
html = replaceAll(html, '{{about.p2_fr}}', homepage.about.p2_fr);
html = replaceAll(html, '{{about.p2_ar}}', homepage.about.p2_ar || '');
html = replaceAll(html, '{{about.p3_fr}}', homepage.about.p3_fr);
html = replaceAll(html, '{{about.p3_ar}}', homepage.about.p3_ar || '');

// Generate news HTML
const newsHTML = news.slice(0, 6).map(item => `
                <div class="news-card">
                    <div class="news-image">
                        <i class="${item.icon || 'fas fa-star'}"></i>
                    </div>
                    <div class="news-content">
                        <div class="news-date">${item.date}</div>
                        <h3 data-fr="${item.title_fr}" data-ar="${item.title_ar || item.title_fr}">${item.title_fr}</h3>
                        <p data-fr="${item.summary_fr}" data-ar="${item.summary_ar || item.summary_fr}">${item.summary_fr}</p>
                    </div>
                </div>`).join('\n');

html = html.replace('{{NEWS_CARDS}}', newsHTML);

// Write output
const outputDir = '_site';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, 'index.html'), html);

// Copy static assets
const assets = [
    'logo-cagor.png',
    'Mouton_(16).jpg',
];

assets.forEach(asset => {
    if (fs.existsSync(asset)) {
        fs.copyFileSync(asset, path.join(outputDir, asset));
    }
});

// Copy Site folder (region map)
function copyDir(src, dest) {
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}
copyDir('Site', path.join(outputDir, 'Site'));

// Copy admin folder
copyDir('admin', path.join(outputDir, 'admin'));

// Copy images folder if it exists
copyDir('images', path.join(outputDir, 'images'));

console.log(`✅ Site built successfully! ${news.length} news articles.`);
console.log(`   Output: ${outputDir}/`);
