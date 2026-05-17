const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'FrontEnd/src/app');
const envPath = path.join(__dirname, 'FrontEnd/src/environments/environment.ts');

function getRelativePath(from, to) {
    let rel = path.relative(path.dirname(from), to).replace(/\\/g, '/');
    if (!rel.startsWith('.')) rel = './' + rel;
    // Remove .ts extension
    rel = rel.replace(/\.ts$/, '');
    return rel;
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('http://localhost:8080/api')) {
                // Add import if not present
                if (!content.includes('import { environment }')) {
                    const relEnv = getRelativePath(fullPath, envPath);
                    const importStmt = `import { environment } from '${relEnv}';\n`;
                    content = importStmt + content;
                }
                
                // Replace string literals depending on context
                // Usually it's: 'http://localhost:8080/api/users' -> environment.apiUrl + '/users'
                content = content.replace(/'http:\/\/localhost:8080\/api([^']*)'/g, "environment.apiUrl + '$1'");
                // Or maybe in backticks: `http://localhost:8080/api/...` -> `${environment.apiUrl}/...`
                content = content.replace(/`http:\/\/localhost:8080\/api([^`]*)`/g, "`${environment.apiUrl}$1`");
                // What if it's just 'http://localhost:8080/api'? -> environment.apiUrl
                content = content.replace(/environment\.apiUrl \+ ''/g, "environment.apiUrl");
                
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDirectory(srcDir);
