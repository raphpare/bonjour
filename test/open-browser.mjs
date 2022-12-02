import open from 'open';
import { APP_PORT } from './app-port.mjs';

open(`http://localhost:${APP_PORT}`);

console.log(`\n\u001b[1;32mBonjour.js listening on port ${APP_PORT}\n`);
console.log(`\u001b[1;42m http://localhost:${APP_PORT}/ \u001b[0m\n`);
