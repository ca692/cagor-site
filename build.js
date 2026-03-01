const fs = require('fs');
const path = require('path');

// Helper function
function replaceAll(str, find, replacement) {
    return str.split(find).join(replacement);
}

// Read all data files
const contact = JSON.parse(fs.readFileSync('_data/contact.json', 'utf8'));
const homepage = JSON.parse(fs.readFileSync('_data/homepage.json', 'utf8'));
const services = JSON.parse(fs.readFileSync('_data/services.json', 'utf8'));
const missions = JSON.parse(fs.readFileSync('_data/missions.json', 'utf8'));
const plan = JSON.parse(fs.readFileSync('_data/plan.json', 'utf8'));
const organisation = JSON.parse(fs.readFileSync('_data/organisation.json', 'utf8'));
const vulgarisation = JSON.parse(fs.readFileSync('_data/vulgarisation.json', 'utf8'));
const formation = JSON.parse(fs.readFileSync('_data/formation.json', 'utf8'));
const region = JSON.parse(fs.readFileSync('_data/region.json', 'utf8'));
const liens = JSON.parse(fs.readFileSync('_data/liens.json', 'utf8'));

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
}).filter(Boolean).reverse();

// Read template
let html = fs.readFileSync('templates/index.template.html', 'utf8');

// === REPLACE CONTACT PLACEHOLDERS ===
html = replaceAll(html, '{{contact.address_fr}}', contact.address_fr);
html = replaceAll(html, '{{contact.address_ar}}', contact.address_ar || '');
html = replaceAll(html, '{{contact.phone1}}', contact.phone1);
html = replaceAll(html, '{{contact.fax}}', contact.fax || '');
html = replaceAll(html, '{{contact.email1}}', contact.email1);
html = replaceAll(html, '{{contact.hours_fr}}', contact.hours_fr);
html = replaceAll(html, '{{contact.hours_ar}}', contact.hours_ar || '');
html = replaceAll(html, '{{contact.facebook}}', contact.facebook);
html = replaceAll(html, '{{contact.maps_url}}', contact.maps_url);

// === REPLACE HOMEPAGE PLACEHOLDERS ===
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

// === GENERATE SERVICES SECTION ===
const servicesHTML = `
        <div class="services-container">
            <h2 class="section-title" data-fr="${services.section_title_fr}" data-ar="${services.section_title_ar || ''}">${services.section_title_fr}</h2>
            <div class="services-grid">
${services.items.map(item => `
                <div class="service-card">
                    <div class="service-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <h3 data-fr="${item.title_fr}" data-ar="${item.title_ar || ''}">${item.title_fr}</h3>
                    <p data-fr="${item.description_fr}" data-ar="${item.description_ar || ''}">${item.description_fr}</p>
                    <a href="${item.link}" class="btn-small" data-fr="En savoir plus" data-ar="اعرف أكثر">
                        <span>En savoir plus</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>`).join('\n')}
            </div>
        </div>`;
html = replaceAll(html, '{{SERVICES_CONTENT}}', servicesHTML);

// === GENERATE MISSIONS SECTION ===
const missionsHTML = `
        <div class="missions-container">
            <h2 class="section-title" data-fr="${missions.section_title_fr}" data-ar="${missions.section_title_ar || ''}">${missions.section_title_fr}</h2>
            <div class="missions-grid">
${missions.items.map((item, idx) => `
                <div class="mission-card">
                    <div class="mission-number">${String(idx + 1).padStart(2, '0')}</div>
                    <h3 data-fr="${item.title_fr}" data-ar="${item.title_ar || ''}">${item.title_fr}</h3>
                    <p data-fr="${item.description_fr}" data-ar="${item.description_ar || ''}">${item.description_fr}</p>
                </div>`).join('\n')}
            </div>
        </div>`;
html = replaceAll(html, '{{MISSIONS_CONTENT}}', missionsHTML);

// === GENERATE PLAN SECTION ===
const planHTML = `
        <div class="services-container">
            <h2 class="section-title" data-fr="${plan.section_title_fr}" data-ar="${plan.section_title_ar || ''}">${plan.section_title_fr}</h2>
            <p style="text-align:center; max-width:800px; margin:0 auto 40px; color:var(--gray); font-size:1.05rem;" data-fr="${plan.intro_fr}" data-ar="${plan.intro_ar || ''}">${plan.intro_fr}</p>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:25px; margin-bottom:40px;">
${plan.axes.map((item, idx) => `
                <div style="background:var(--white); padding:30px; border-radius:12px; box-shadow:var(--shadow-md); border-top:4px solid var(--${idx % 2 === 0 ? 'primary' : 'accent'}); ">
                    <div style="width:50px; height:50px; background:linear-gradient(135deg, var(--${idx % 2 === 0 ? 'primary' : 'accent'}), var(--${idx % 2 === 0 ? 'secondary' : 'accent-light'})); border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:15px; color:white; font-weight:800; font-size:1.2rem;">${idx + 1}</div>
                    <h3 style="color:var(--primary); font-family:'Plus Jakarta Sans',sans-serif; margin-bottom:10px;" data-fr="${item.title_fr}" data-ar="${item.title_ar || ''}">${item.title_fr}</h3>
                    <p style="color:var(--gray); font-size:0.95rem;" data-fr="${item.description_fr}" data-ar="${item.description_ar || ''}">${item.description_fr}</p>
                </div>`).join('\n')}
            </div>
        </div>`;
html = replaceAll(html, '{{PLAN_CONTENT}}', planHTML);

// === GENERATE ORGANISATION SECTION ===
const orgHTML = `
        <div class="services-container">
            <h2 class="section-title" data-fr="${organisation.section_title_fr}" data-ar="${organisation.section_title_ar || ''}">${organisation.section_title_fr}</h2>
            <p style="text-align:center; max-width:800px; margin:0 auto 40px; color:var(--gray); font-size:1.05rem;" data-fr="${organisation.intro_fr}" data-ar="${organisation.intro_ar || ''}">${organisation.intro_fr}</p>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px; margin-bottom:30px;">
${organisation.services.map(item => `
                <div style="background:linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); padding:25px; border-radius:12px; color:white;">
                    <i class="${item.icon}" style="font-size:2rem; margin-bottom:15px; color:var(--accent);"></i>
                    <h3 style="font-family:'Plus Jakarta Sans',sans-serif; margin-bottom:10px;" data-fr="${item.title_fr}" data-ar="${item.title_ar || ''}">${item.title_fr}</h3>
                    <p style="opacity:0.9; font-size:0.9rem;" data-fr="${item.description_fr}" data-ar="${item.description_ar || ''}">${item.description_fr}</p>
                </div>`).join('\n')}
            </div>
            <div style="background:var(--white); padding:30px; border-radius:12px; box-shadow:var(--shadow-md); display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:20px;">
${organisation.annexes.map(item => `
                <div style="text-align:center; padding:20px;">
                    <i class="fas fa-building" style="font-size:2.5rem; color:var(--accent); margin-bottom:10px;"></i>
                    <h4 style="color:var(--primary); font-family:'Plus Jakarta Sans',sans-serif;" data-fr="${item.title_fr}" data-ar="${item.title_ar || ''}">${item.title_fr}</h4>
                    <p style="color:var(--gray); font-size:0.85rem;" data-fr="${item.description_fr}" data-ar="${item.description_ar || ''}">${item.description_fr}</p>
                </div>`).join('\n')}
            </div>
        </div>`;
html = replaceAll(html, '{{ORGANISATION_CONTENT}}', orgHTML);

// === GENERATE VULGARISATION SECTION ===
const vulgHTML = `
        <div class="services-container">
            <h2 class="section-title" data-fr="${vulgarisation.section_title_fr}" data-ar="${vulgarisation.section_title_ar || ''}">${vulgarisation.section_title_fr}</h2>
            <p style="text-align:center; max-width:800px; margin:0 auto 40px; color:var(--gray); font-size:1.05rem;" data-fr="${vulgarisation.intro_fr}" data-ar="${vulgarisation.intro_ar || ''}">${vulgarisation.intro_fr}</p>
            <div class="services-grid">
${vulgarisation.cards.map(item => `
                <div class="service-card">
                    <div class="service-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <h3 data-fr="${item.title_fr}" data-ar="${item.title_ar || ''}">${item.title_fr}</h3>
                    <p data-fr="${item.description_fr}" data-ar="${item.description_ar || ''}">${item.description_fr}</p>
                </div>`).join('\n')}
            </div>
            <div style="margin-top:40px; background:var(--white); padding:30px; border-radius:12px; box-shadow:var(--shadow-md); display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:25px;">
${vulgarisation.topics.map(item => `
                <div style="padding:20px; border-left:4px solid var(--accent); background:linear-gradient(135deg, rgba(10,61,46,0.02) 0%, rgba(212,160,23,0.02) 100%); border-radius:0 8px 8px 0;">
                    <h4 style="color:var(--primary); font-family:'Plus Jakarta Sans',sans-serif; margin-bottom:8px;" data-fr="${item.title_fr}" data-ar="${item.title_ar || ''}">${item.title_fr}</h4>
                    <p style="color:var(--gray); font-size:0.9rem;" data-fr="${item.description_fr}" data-ar="${item.description_ar || ''}">${item.description_fr}</p>
                </div>`).join('\n')}
            </div>
        </div>`;
html = replaceAll(html, '{{VULGARISATION_CONTENT}}', vulgHTML);

// === GENERATE FORMATION SECTION ===
const formationChaines = Array.isArray(formation.chaines)
    ? formation.chaines.map(c => typeof c === 'string' ? c : c.nom || c)
    : [];
const formHTML = `
        <div class="services-container">
            <h2 class="section-title" data-fr="${formation.section_title_fr}" data-ar="${formation.section_title_ar || ''}">${formation.section_title_fr}</h2>
            <div style="background: var(--white); padding: 40px; border-radius: 12px; box-shadow: var(--shadow-md); margin-bottom: 40px;">
                <h3 style="color: var(--primary); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.3rem; margin-bottom: 20px;" data-fr="Chaînes de Production Couvertes" data-ar="سلاسل الإنتاج المغطاة">Chaînes de Production Couvertes</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
${formationChaines.map(c => `
                    <div style="padding: 15px; background: linear-gradient(135deg, rgba(10, 61, 46, 0.05) 0%, rgba(212, 160, 23, 0.05) 100%); border-radius: 8px; border-left: 4px solid var(--accent);"><strong style="color: var(--primary);">${c}</strong></div>`).join('\n')}
                </div>
            </div>
            <div class="services-grid">
${formation.cards.map(item => `
                <div class="service-card">
                    <div class="service-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <h3 data-fr="${item.title_fr}" data-ar="${item.title_ar || ''}">${item.title_fr}</h3>
                    <p data-fr="${item.description_fr}" data-ar="${item.description_ar || ''}">${item.description_fr}</p>
                    <a href="${item.link_url}" class="btn-small" ${item.link_url.startsWith('http') ? 'target="_blank"' : ''} data-fr="${item.link_text_fr}" data-ar="${item.link_text_fr}">
                        <span>${item.link_text_fr}</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>`).join('\n')}
            </div>
        </div>`;
html = replaceAll(html, '{{FORMATION_CONTENT}}', formHTML);

// === GENERATE REGION SECTION ===
const regionProvinces = Array.isArray(region.provinces)
    ? region.provinces.map(p => typeof p === 'string' ? p : p.nom || p)
    : [];
const regionHTML = `
        <div class="region-container">
            <div class="region-content">
                <div class="region-image">
                    <img src="Site/Cartes/Cartes/Region/region.png" alt="Région de l'Oriental" onerror="this.style.display='none'">
                </div>
                <div class="region-text">
                    <h2 data-fr="${region.section_title_fr}" data-ar="${region.section_title_ar || ''}">${region.section_title_fr}</h2>
                    <p data-fr="${region.description1_fr}" data-ar="${region.description1_ar || ''}">${region.description1_fr}</p>
                    <p data-fr="${region.description2_fr}" data-ar="${region.description2_ar || ''}">${region.description2_fr}</p>
                    <h3 style="color: var(--accent); margin-top: 30px; margin-bottom: 15px; font-family: 'Plus Jakarta Sans', sans-serif;" data-fr="Les 8 Provinces" data-ar="الولايات الثمانية">Les 8 Provinces</h3>
                    <div class="provinces-list">
${regionProvinces.map(p => `                        <div class="province-badge">${p}</div>`).join('\n')}
                    </div>
                </div>
            </div>
        </div>`;
html = replaceAll(html, '{{REGION_CONTENT}}', regionHTML);

// === GENERATE LIENS SECTION ===
const liensHTML = `
        <div class="liens-container">
            <h2 class="section-title" data-fr="${liens.section_title_fr}" data-ar="${liens.section_title_ar || ''}">${liens.section_title_fr}</h2>
            <div class="liens-grid">
${liens.items.map(item => `
                <div class="lien-card">
                    ${item.image
                        ? `<img src="${item.image}" alt="${item.title_fr}" class="lien-logo">`
                        : `<i class="${item.icon}"></i>`}
                    <h3 data-fr="${item.title_fr}" data-ar="${item.title_ar || ''}">${item.title_fr}</h3>
                    <a href="${item.url}" target="_blank">Visiter</a>
                </div>`).join('\n')}
            </div>
        </div>`;
html = replaceAll(html, '{{LIENS_CONTENT}}', liensHTML);

// === GENERATE NEWS CARDS ===
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

// === WRITE OUTPUT ===
const outputDir = '_site';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'index.html'), html);

// Copy static assets
['logo-cagor.png', 'Mouton_(16).jpg'].forEach(asset => {
    if (fs.existsSync(asset)) {
        fs.copyFileSync(asset, path.join(outputDir, asset));
    }
});

// Copy directories
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
copyDir('admin', path.join(outputDir, 'admin'));
copyDir('images', path.join(outputDir, 'images'));

console.log('✅ Site built successfully! ' + news.length + ' news articles.');
console.log('   Sections: Services, Missions, Plan, Organisation, Vulgarisation, Formation, Région, Liens');
console.log('   Output: ' + outputDir + '/');
