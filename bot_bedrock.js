const bedrock = require('bedrock-protocol');

const CONFIG = {
  host: 'Server_Partner.aternos.me',
  port: 60725,
  username: 'y.m.b_assiten',
  version: '1.21.11',
  offline: true 
};

function createBot() {
  console.log(`[${new Date().toLocaleTimeString()}] Menghubungkan ke Bedrock Aternos...`);

  const client = bedrock.createClient({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    offline: CONFIG.offline,
    version: CONFIG.version
  });

  // Saat bot berhasil masuk ke dunia
  client.on('spawn', () => {
    console.log(`[${new Date().toLocaleTimeString()}] ✅ y.m.b_assiten BERHASIL MASUK!`);
    
    // Kirim login setelah 10 detik agar server stabil dulu
    setTimeout(() => {
      console.log('🔐 Menjalankan perintah login/register...');
      const sendChat = (msg) => {
        client.queue('text', {
          type: 'chat', needs_translation: false, source_name: CONFIG.username,
          xuid: '', platform_chat_id: '', message: msg
        });
      };

      sendChat('/register 123456 123456');
      setTimeout(() => sendChat('/login 123456'), 2000);
    }, 10000);
  });

  // ANTI-AFK: Gerak dikit tiap 30 detik biar gak dianggap bot diam
  const antiAfk = setInterval(() => {
    if (client.status === 2) { // Status 2 = di dalam game
      client.queue('player_auth_input', {
        pitch: 0, yaw: 0, position: { x: 0, y: 0, z: 0 },
        move_vector: { x: 0, z: 0.1 }, head_yaw: 0,
        input_data: { jump_down: false }, input_mode: 'touch',
        play_mode: 'normal', tick: 0n
      });
    }
  }, 30000);

  // Jika diskonek, tunggu 20 detik lalu masuk lagi
  client.on('disconnect', (packet) => {
    console.log(`[${new Date().toLocaleTimeString()}] ❌ Terputus: ${packet.message}`);
    clearInterval(antiAfk);
    console.log('🔄 Reconnecting dalam 20 detik...');
    setTimeout(createBot, 20000);
  });

  client.on('error', (err) => {
    console.log(`[${new Date().toLocaleTimeString()}] ⚠️ Error: ${err.message}`);
  });
}

// Mulai bot
createBot();
    
