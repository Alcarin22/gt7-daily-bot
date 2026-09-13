require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Events
} = require('discord.js');

const {
  checkAndPublish
} = require('./src/schedulers/dailyRaceScheduler');


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});


client.once(
  Events.ClientReady,
  async (readyClient) => {

    console.log(
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    );

    console.log(
      '🧪 PRUEBA MANUAL DEL SCHEDULER'
    );

    console.log(
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    );

    console.log(
      `✅ Conectado como ${readyClient.user.tag}`
    );

    try {

      await checkAndPublish(
        readyClient
      );

    } catch (error) {

      console.error(
        '❌ Error durante la prueba:'
      );

      console.error(error);

    } finally {

      console.log('');
      console.log(
        '🏁 Prueba finalizada.'
      );

      readyClient.destroy();
    }
  }
);


client.login(
  process.env.DISCORD_TOKEN
);