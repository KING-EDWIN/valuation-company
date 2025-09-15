const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/admin/client-database/page.tsx');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Revert Grid2 syntax back to original Grid syntax
  content = content.replace(/<Grid size={{ xs: (\d+), md: (\d+), lg: (\d+) }}/g, '<Grid item xs={$1} md={$2} lg={$3}');
  content = content.replace(/<Grid size={{ xs: (\d+), md: (\d+) }}/g, '<Grid item xs={$1} md={$2}');
  content = content.replace(/<Grid size={{ xs: (\d+) }}/g, '<Grid item xs={$1}');
  content = content.replace(/<Grid size={{ xs: 12 }}/g, '<Grid item xs={12}');
  
  fs.writeFileSync(filePath, content);
  console.log('Reverted Grid usage back to original syntax');
} else {
  console.log('File not found');
}
