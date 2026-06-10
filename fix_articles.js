
const fs = require('fs');
const file = 'c:/Users/MSI/IdeaProjects/minigameHCM202/backend/src/database/setup.js';
let content = fs.readFileSync(file, 'utf8');

const mapping = {
  'why-socialism': '/images/ideology/why-socialism.jpg',
  'national-independence-socialism': '/images/ideology/national-independence-socialism.jpg',
  'role-of-patriotism': '/images/ideology/role-of-patriotism.jpg',
  'preparation-cpv': '/images/ideology/preparation-cpv.jpg'
};

for (const [slug, img] of Object.entries(mapping)) {
  const targetSlug = 'slug: \'' + slug + '\'';
  const slugIndex = content.indexOf(targetSlug);
  if (slugIndex !== -1) {
    const imgIndex = content.indexOf('image_url:', slugIndex);
    if (imgIndex !== -1) {
      const startQuote = content.indexOf('\'', imgIndex);
      const endQuote = content.indexOf('\'', startQuote + 1);
      if (startQuote !== -1 && endQuote !== -1) {
        content = content.substring(0, startQuote + 1) + img + content.substring(endQuote);
      }
    }
  }
}
fs.writeFileSync(file, content);

