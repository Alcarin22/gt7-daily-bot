require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Events,
  MessageFlags
} = require('discord.js');

const {
  publishDailyRaces
} = require(
  './src/services/publishDailyRaces'
);

const {
  startDailyRaceScheduler
} = require(
  './src/schedulers/dailyRaceScheduler'
);

const {
  getTargetWeek
} = require(
  './src/utils/dateUtils'
);

const {
  getWeekState,
  saveWeekState
} = require(
  './src/storage/publicationState'
);


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});


client.once(
  Events.ClientReady,
  (readyClient) => {

    console.log(
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    );

    console.log(
      '🏁 GT7 DAILY BOT'
    );

    console.log(
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    );

    console.log(
      `✅ Bot conectado como ${readyClient.user.tag}`
    );

    console.log(
      '🟢 Esperando órdenes...'
    );

    console.log(
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    );


    startDailyRaceScheduler(
      readyClient
    );
  }
);


client.on(
  Events.InteractionCreate,
  async (interaction) => {

    if (
      !interaction.isChatInputCommand()
    ) {
      return;
    }


    if (
      interaction.commandName !==
      'daily'
    ) {
      return;
    }


    console.log(
      '📥 Comando /daily recibido.'
    );


    try {

      await interaction.deferReply({
        flags:
          MessageFlags.Ephemeral
      });


      const week =
        getTargetWeek();


      const currentState =
        getWeekState(
          week.startISO
        );


      /*
       * Si ya existe un mensaje semanal,
       * /daily lo actualizará.
       *
       * Si no existe, creará uno nuevo.
       */

      const result =
        await publishDailyRaces(
          client,
          {
            messageId:
              currentState?.messageId ||
              null
          }
        );


      if (!result.success) {

        await interaction.editReply(
          '❌ No se han podido obtener las carreras diarias.'
        );

        return;
      }


      const status =
        result.complete
          ? 'confirmed'
          : 'provisional';


      saveWeekState(
        week.startISO,
        {
          status,

          messageId:
            result.messageId,

          complete:
            result.complete
        }
      );


      if (result.complete) {

        await interaction.editReply(
          '✅ Las carreras diarias se han actualizado y la información está confirmada.'
        );

        return;
      }


      await interaction.editReply(
        '⚠️ Las carreras diarias se han publicado/actualizado con la información disponible. Los datos pendientes aparecen como **Por confirmar**.'
      );


    } catch (error) {

      console.error(
        '❌ Error procesando /daily:'
      );

      console.error(error);


      if (
        interaction.deferred ||
        interaction.replied
      ) {

        await interaction.editReply(
          '❌ Ha ocurrido un error al procesar /daily.'
        );
      }
    }
  }
);


client.login(
  process.env.DISCORD_TOKEN
);