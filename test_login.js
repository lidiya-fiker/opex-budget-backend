const http = require('http');

function testLogin(email, password) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ email, password });
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/auth/login/local',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const ok = res.statusCode === 201 ? '✅' : '❌';
        let role = '';
        try {
          const parsed = JSON.parse(body);
          if (parsed.access_token) {
            const payload = JSON.parse(Buffer.from(parsed.access_token.split('.')[1], 'base64').toString());
            role = ` [${payload.role}]`;
          }
        } catch(e) {}
        console.log(`${ok} [${res.statusCode}] ${email}${role}`);
        if (res.statusCode !== 201) console.log('   ', body.substring(0, 100));
        resolve(res.statusCode);
      });
    });
    req.on('error', e => { console.log(`❌ CONN ERR ${email}: ${e.message}`); resolve(null); });
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('=== Testing credentials ===\n');
  // HO users
  await testLogin('admin@dashen.com', 'Password@123');
  await testLogin('bcc.team@dashen.com', 'Password@123');
  await testLogin('adama.district@dashen.com', 'Password@123');
  // Branch users from ADAMA import
  await testLogin('assela.manager@dashen.com', 'Password@123');
  await testLogin('assela.finance@dashen.com', 'Password@123');
  await testLogin('bishoftu.manager@dashen.com', 'Password@123');
  await testLogin('meki.finance@dashen.com', 'Password@123');
  await testLogin('adama.manager@dashen.com', 'Password@123');
  console.log('\n=== Done ===');
}
main();
