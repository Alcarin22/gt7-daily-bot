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

client.once(Events.ClientReady, async (readyClient) => {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔎 COMPROBACIÓN DE DISCORD');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log(`Bot conectado: ${readyClient.user.tag}`);
  console.log(`ID real del bot: ${readyClient.user.id}`);
  console.log(`DISCORD_CLIENT_ID: ${process.env.DISCORD_CLIENT_ID}`);
  console.log(`DISCORD_GUILD_ID: ${process.env.DISCORD_GUILD_ID}`);

  console.log('');
  console.log('Servidores a los que tiene acceso el bot:');

  if (readyClient.guilds.cache.size === 0) {
    console.log('❌ El bot no tiene acceso a ningún servidor.');
  } else {
    readyClient.guilds.cache.forEach((guild) => {
      console.log(`✅ ${guild.name} -> ${guild.id}`);
    });
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  client.destroy();
});

client.login(process.env.DISCORD_TOKEN);