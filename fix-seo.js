const fs = require('fs');
const path = require('path');

function findPageFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findPageFiles(fullPath));
    } else if (file === 'page.tsx') {
      results.push(fullPath);
    }
  });
  return results;
}

const pages = findPageFiles('app');
let modifiedCount = 0;

pages.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. Remove Avorria from title
  content = content.replace(/title:\s*['"](.*?)['"]/g, (match, titleStr) => {
    let newTitle = titleStr
      .replace(/^Avorria\s*[—|-]\s*/i, '') // "Avorria - " or "Avorria — " at start
      .replace(/\s*\|\s*Avorria$/i, '')    // " | Avorria" at end
      .replace(/\s*\|\s*CertifyIQ\s*\|\s*Avorria$/i, '') // blog
      .replace(/\s*\|\s*CertifyIQ$/i, '') // in case CertifyIQ is at end
      .replace(/\s*—\s*Avorria$/i, '');   // " — Avorria" at end
    return `title: '${newTitle}'`;
  });

  // 2. Remove keywords block
  // Matches `keywords: ['foo', 'bar'],` or `keywords: 'foo, bar',`
  content = content.replace(/\s*keywords:\s*\[[^\]]*\],?/g, '');
  content = content.replace(/\s*keywords:\s*['"][^'"]*['"],?/g, '');

  // 3. Update or Add openGraph and alternates canonical
  // We will calculate the URL path by stripping routing groups
  let routePath = file
    .replace(/^app\//, '/')
    .replace(/\/\(marketing\)/, '')
    .replace(/\/\(customer\)/, '')
    .replace(/\/\(admin\)/, '')
    .replace(/\/page\.tsx$/, '') || '/';
  
  if (routePath === '') routePath = '/';
  // Replace multiple slashes
  routePath = routePath.replace(/\/+/g, '/');

  const fullUrl = `https://avorria.co.uk${routePath === '/' ? '' : routePath}`;

  // If page exports metadata object
  if (content.includes('export const metadata') && !content.includes('generateMetadata')) {
    // Check if openGraph already exists
    if (content.match(/openGraph:\s*\{/)) {
      // It exists, let's inject or replace url
      if (content.match(/url:\s*['"][^'"]*['"]/)) {
        content = content.replace(/(openGraph:\s*\{[^}]*?)url:\s*['"][^'"]*['"]/s, `$1url: '${fullUrl}'`);
      } else {
        content = content.replace(/(openGraph:\s*\{)/, `$1\n    url: '${fullUrl}',`);
      }
    } else {
      // Add openGraph
      content = content.replace(/(export const metadata[^=]*=\s*\{)/, `$1\n  openGraph: {\n    url: '${fullUrl}',\n  },`);
    }

    // Check if alternates already exists
    if (content.match(/alternates:\s*\{/)) {
      if (content.match(/canonical:\s*['"][^'"]*['"]/)) {
        content = content.replace(/(alternates:\s*\{[^}]*?)canonical:\s*['"][^'"]*['"]/s, `$1canonical: '${fullUrl}'`);
      } else {
        content = content.replace(/(alternates:\s*\{)/, `$1\n    canonical: '${fullUrl}',`);
      }
    } else {
      // Add alternates
      content = content.replace(/(export const metadata[^=]*=\s*\{)/, `$1\n  alternates: {\n    canonical: '${fullUrl}',\n  },`);
    }
  }

  // 4. Update phone numbers
  content = content.replace(/01246\s*000\s*000/g, "{SITE_CONFIG.phone}"); // Wait, inside JSX it might need curly braces, inside string it doesn't.
  // Actually, string replacement in code could break. The user said:
  // "Import SITE_CONFIG everywhere phone/email appears."
  // I will just let the script do basic replacements and then I'll use grep_search to find remaining occurrences and fix them manually.

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
  }
});

console.log(`Modified ${modifiedCount} files.`);
