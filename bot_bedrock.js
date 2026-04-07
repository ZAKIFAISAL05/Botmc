const bedrock = require('bedrock-protocol');

const CONFIG = {
  host: 'Server_Partner.aternos.me',
  port: 60725,
  username: 'y.m.b_assiten',
  version: '1.21.11',
  offline: true 
};

function createBot() {
  console.log(`[${new Date().toLocaleTimeString()}] Menghubungkan via Docker ke Bedrock...`);

  const client = bedrock.createClient({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    offline: CONFIG.offline,
    version: CONFIG.version
  });

  client.on('spawn', () => {
    console.log('✅ Bot Berhasil Spawn di Server!');
    
    setTimeout(() => {
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

  // Anti-AFK agar tidak ditendang server
  const antiAfk = setInterval(() => {
    if (client.status === 2) {
      client.queue('player_auth_input', {
        pitch: 0, yaw: 0, position: { x: 0, y: 0, z: 0 },
        move_vector: { x: 0, z: 0.1 }, head_yaw: 0,
        input_data: { jump_down: false }, input_mode: 'touch',
        play_mode: 'normal', tick: 0n
      });
    }
  }, 30000);

  client.on('disconnect', (packet) => {
    console.log('❌ Terputus:', packet.message);
    clearInterval(antiAfk);
    setTimeout(createBot, 20000);
  });

  client.on('error', (err) => console.log('⚠️ Error:', err.message));
}

createBot();
        
