import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

const sourceFile = join(process.cwd(), 'public', 'chatbot-widget.js');
const destFile = join(process.cwd(), 'dist', 'chatbot-widget.js');

console.log('Checking for chatbot-widget.js...');
console.log('Source:', sourceFile);
console.log('Destination:', destFile);

if (existsSync(sourceFile)) {
  try {
    // Ensure dist directory exists
    const destDir = dirname(destFile);
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
      console.log('Created dist directory');
    }
    
    copyFileSync(sourceFile, destFile);
    console.log('✓ chatbot-widget.js successfully copied to dist');
    
    // Verify copy
    if (existsSync(destFile)) {
      console.log('✓ Verified: chatbot-widget.js exists in dist');
    } else {
      console.error('✗ Error: File was not copied successfully');
      process.exit(1);
    }
  } catch (error) {
    console.error('✗ Error copying chatbot-widget.js:', error.message);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
} else {
  console.error('✗ chatbot-widget.js not found in public directory');
  console.error('Expected location:', sourceFile);
  process.exit(1);
}

