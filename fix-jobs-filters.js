const fs = require('fs');
const path = require('path');

// Files that need fixing
const files = [
  'app/md-dashboard/page.tsx',
  'app/qa-dashboard/page.tsx', 
  'app/dashboard/page.tsx',
  'app/admin/client-database/page.tsx',
  'app/field-dashboard/page.tsx',
  'app/accountant-dashboard/page.tsx',
  'app/schedule-inspection/page.tsx',
  'app/quality-assurance/page.tsx',
  'app/admin/report-review/page.tsx',
  'app/admin/report-management/page.tsx',
  'app/admin/job-assignments/page.tsx'
];

files.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Fix jobs.filter patterns
    content = content.replace(/jobs\.filter/g, 'jobs?.filter');
    content = content.replace(/jobs\.reduce/g, 'jobs?.reduce');
    content = content.replace(/jobs\.slice/g, 'jobs?.slice');
    content = content.replace(/jobs\.map/g, 'jobs?.map');
    
    // Fix .length after filter operations
    content = content.replace(/jobs\?\.filter\([^)]+\)\.length/g, '(jobs?.filter$1?.length || 0)');
    
    // Fix specific patterns
    content = content.replace(/jobs\?\.filter\(([^)]+)\)\.length/g, '(jobs?.filter($1)?.length || 0)');
    
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed: ${filePath}`);
  }
});

console.log('All jobs filter operations fixed!');
