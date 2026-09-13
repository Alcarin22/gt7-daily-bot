require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Events
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.once(Events.ClientReady, (readyClient) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔎 DIAGNÓSTICO GT7 DAILY BOT');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log(`Bot conectado: ${readyClient.user.tag}`);
  console.log(`ID real del bot: ${readyClient.user.id}`);

  console.log('');
  console.log(`DISCORD_CLIENT_ID del .env: ${process.env.DISCORD_CLIENT_ID}`);
  console.log(`DISCORD_GUILD_ID del .env: ${process.env.DISCORD_GUILD_ID}`);

  console.log('');
  console.log('Servidores a los que tiene acceso el bot:');

  if (readyClient.guilds.cache.size === 0) {
    console.log('❌ El bot no está dentro de ningún servidor.');
  } else {
    readyClient.guilds.cache.forEach((guild) => {
      console.log(`✅ ${guild.name} → ${guild.id}`);
    });
  }

  console.log('');
  console.log(
    '¿El bot ve el servidor configurado?:',
    readyClient.guilds.cache.has(process.env.DISCORD_GUILD_ID)
      ? '✅ SÍ'
      : '❌ NO'
  );

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  readyClient.destroy();
});

client.login(process.env.DISCORD_TOKEN);