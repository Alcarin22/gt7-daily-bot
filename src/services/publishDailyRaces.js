const {
  createDailyRaceEmbeds
} = require('../embeds/dailyRaceEmbeds');

const {
  getDailyRaceData
} = require('./dailyRaceService');


async function publishDailyRaces(
  client,
  options = {}
) {
  try {

    console.log(
      '🔎 Buscando información de las carreras...'
    );


    const data =
      await getDailyRaceData();


    // ========================================
    // NECESITAMOS AL MENOS A, B Y C
    // ========================================

    if (
      !data.races ||
      data.races.length !== 3
    ) {

      console.log(
        '⚠️ No se han encontrado las tres carreras.'
      );

      return {
        success: false,
        reason: 'races-not-found',
        data
      };
    }


    // ========================================
    // BUSCAR CANAL
    // ========================================

    const channel =
      await client.channels.fetch(
        process.env.DISCORD_CHANNEL_ID
      );


    if (!channel) {

      console.error(
        '❌ No se ha encontrado el canal.'
      );

      return {
        success: false,
        reason: 'channel-not-found',
        data
      };
    }


    if (!channel.isTextBased()) {

      console.error(
        '❌ El canal no permite mensajes.'
      );

      return {
        success: false,
        reason: 'invalid-channel',
        data
      };
    }


    // ========================================
    // CREAR EMBEDS
    // ========================================

    const embeds =
      createDailyRaceEmbeds(data);


    const content =
      data.complete
        ? '🏁 **Gran Turismo 7 — Carreras Diarias**\n✅ **Información confirmada**'
        : '🏁 **Gran Turismo 7 — Carreras Diarias**\n⚠️ **Información provisional**';


    const messagePayload = {
      content,
      embeds
    };


    let message;


    // ========================================
    // EDITAR MENSAJE EXISTENTE
    // ========================================

    if (options.messageId) {

      try {

        message =
          await channel.messages.edit(
            options.messageId,
            messagePayload
          );


        console.log(
          `🔄 Mensaje actualizado: ${message.id}`
        );

      } catch (error) {

        console.log(
          '⚠️ No se ha podido editar el mensaje anterior.'
        );

        console.log(
          '🆕 Se publicará uno nuevo.'
        );


        message =
          await channel.send(
            messagePayload
          );
      }

    }


    // ========================================
    // PUBLICACIÓN NUEVA
    // ========================================

    else {

      message =
        await channel.send(
          messagePayload
        );


      console.log(
        `🆕 Mensaje publicado: ${message.id}`
      );
    }


    if (data.complete) {

      console.log(
        '✅ Información completa y confirmada.'
      );

    } else {

      console.log(
        '⚠️ Publicación provisional.'
      );

      console.log(
        '🔁 Todavía faltan datos por confirmar.'
      );
    }


    return {
      success: true,

      complete:
        data.complete,

      status:
        data.complete
          ? 'confirmed'
          : 'provisional',

      messageId:
        message.id,

      data
    };


  } catch (error) {

    console.error(
      '❌ Error publicando las carreras:'
    );

    console.error(error);


    return {
      success: false,
      reason: 'error',
      error
    };
  }
}


module.exports = {
  publishDailyRaces
};