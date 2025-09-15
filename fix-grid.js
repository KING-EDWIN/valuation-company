const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/admin/client-database/page.tsx');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix Grid usage to Grid2 syntax
  content = content.replace(/<Grid item xs={(\d+)} md={(\d+)} lg={(\d+)}/g, '<Grid size={{ xs: $1, md: $2, lg: $3 }}');
  content = content.replace(/<Grid item xs={(\d+)} md={(\d+)}/g, '<Grid size={{ xs: $1, md: $2 }}');
  content = content.replace(/<Grid item xs={(\d+)}/g, '<Grid size={{ xs: $1 }}');
  content = content.replace(/<Grid item/g, '<Grid');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed Grid usage in client-database page');
} else {
  console.log('File not found');
}
