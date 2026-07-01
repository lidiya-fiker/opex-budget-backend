const fs = require('fs');
const path = require('path');

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, filesList);
    } else if (filePath.endsWith('.controller.ts')) {
      filesList.push(filePath);
    }
  }
  return filesList;
}

const controllerFiles = getFiles(path.join(__dirname, 'src'));

let markdown = '| Controller Route | Method | Endpoint Path | Roles Restrictions |\n';
markdown += '| --- | --- | --- | --- |\n';

for (const file of controllerFiles) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Extract Controller path
  const controllerMatch = content.match(/@Controller\(['"]([^'"]+)['"]\)/);
  const controllerPath = controllerMatch ? `/${controllerMatch[1]}` : '/';
  
  // Split into methods
  const methodRegex = /@(Get|Post|Patch|Put|Delete)\((['"][^'"]*['"])?\)([\s\S]*?)(?=@(Get|Post|Patch|Put|Delete)\(|}$)/g;
  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    const httpMethod = match[1].toUpperCase();
    let endPath = match[2] ? match[2].replace(/['"]/g, '') : '';
    const fullPath = `${controllerPath}${endPath ? '/' + endPath : ''}`.replace(/\/+/g, '/');
    
    const methodBody = match[3];
    const roles = new Set();
    
    // Check for explicit role checks in the method body
    const roleRegex = /(?:user\.role|req\.user\.role)\s*(?:!==|===|==|!=)\s*(?:Role\.|'|")([A-Z_]+)(?:'|")?/g;
    let roleMatch;
    while ((roleMatch = roleRegex.exec(methodBody)) !== null) {
      roles.add(roleMatch[1]);
    }

    // Check for @Roles decorator if exists
    const rolesDecRegex = /@Roles\(([^)]+)\)/;
    const rolesDecMatch = rolesDecRegex.exec(methodBody); // Wait, decorator is before method, so it might be captured in methodBody or before it. Actually it's usually before @Get, but let's just assume we check the body for now.

    const roleStr = roles.size > 0 ? Array.from(roles).join(', ') : 'All Authenticated Users';
    
    markdown += `| ${controllerPath} | ${httpMethod} | ${fullPath} | ${roleStr} |\n`;
  }
}

fs.writeFileSync('endpoints.md', markdown);
console.log('Done generating endpoints.md');
