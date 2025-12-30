import { copyFileSync, existsSync } from 'fs';
import { join } from 'path';

const sourceFile = join(process.cwd(), 'public', 'chatbot-widget.js');
const destFile = join(process.cwd(), 'dist', 'chatbot-widget.js');

if (existsSync(sourceFile)) {
  try {
    copyFileSync(sourceFile, destFile);
    console.log('✓ chatbot-widget.js copied to dist');
  } catch (error) {
    console.error('✗ Error copying chatbot-widget.js:', error.message);
    process.exit(1);
  }
} else {
  console.log('⚠ chatbot-widget.js not found in public');
}

