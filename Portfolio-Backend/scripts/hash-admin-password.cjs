const { randomBytes, scryptSync } = require('node:crypto');
const { StringDecoder } = require('node:string_decoder');

const decoder = new StringDecoder('utf8');
if (process.stdin.isTTY) process.stdin.setRawMode(true);
process.stdin.resume();
process.stdout.write('Password admin: ');
let password = '';
let finished = false;
function finish(exitCode) {
  if (finished) return;
  finished = true;
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
  process.stdin.pause();
  process.exitCode = exitCode;
}

process.stdin.on('data', (buffer) => {
  const key = decoder.write(buffer);
  if (key === '\u0003') { process.stdout.write('\n'); finish(1); return; }
  if (key === '\r' || key === '\n') {
    process.stdout.write('\n');
    if ([...password].length < 14) {
      console.error('Usa una password di almeno 14 caratteri.');
      finish(1);
      return;
    }
    const salt = randomBytes(16).toString('hex');
    const digest = scryptSync(password, salt, 64).toString('hex');
    console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt}:${digest}`);
    finish(0);
    return;
  }
  if (key === '\u007f' || key === '\b') password = [...password].slice(0, -1).join('');
  else password += key;
});
