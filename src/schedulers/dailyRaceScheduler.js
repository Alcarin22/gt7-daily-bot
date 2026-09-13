const cron = require('node-cron');
const { DateTime } = require('luxon');

const {
  publishDailyRaces
} = require('../services/publishDailyRaces');

const {
  getTargetWeek,
  TIMEZONE
} = require('../utils/dateUtils');

const {
  getWeekState,
  saveWeekState
} = require('../storage/publicationState');


function isInsidePublicationWindow() {
  const now =
    DateTime.now().setZone(
      TIMEZONE
    );

  // Domingo
  if (now.weekday === 7) {
    const start =
      now.set({
        hour: 19,
        minute: 30,
        second: 0,
        millisecond: 0
      });

    return now >= start;
  }


  // Lunes
  if (now.weekday === 1) {
    const end =
      now.set({
        hour: 9,
        minute: 30,
        second: 59,
        millisecond: 999
      });

    return now <= end;
  }


  return false;
}


function isFinalAttempt() {
  const now =
    DateTime.now().setZone(
      TIMEZONE
    );

  return (
    now.weekday === 1 &&
    now.hour === 9 &&
    now.minute === 30
  );
}


async function checkAndPublish(client) {
  if (!isInsidePublicationWindow()) {
    return;
  }


  const week =
    getTargetWeek();


  console.log('');
  console.log(
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  );

  console.log(
    '⏰ COMPROBACIÓN AUTOMÁTICA'
  );

  console.log(
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  );

  console.log(
    `📅 Semana objetivo: ${week.startDisplay} → ${week.endDisplay}`
  );


  // ========================================
  // LEER ESTADO DE ESA SEMANA
  // ========================================

  const currentState =
    getWeekState(
      week.startISO
    );


  // ========================================
  // SI YA ESTÁ CONFIRMADO, TERMINAMOS
  // ========================================

  if (
    currentState?.status ===
    'confirmed'
  ) {
    console.log(
      '✅ La publicación de esta semana ya está confirmada.'
    );

    console.log(
      '⏭️ No es necesario seguir comprobando.'
    );

    return;
  }


  if (currentState) {
    console.log(
      `📌 Estado actual: ${currentState.status}`
    );

    console.log(
      `💬 Mensaje existente: ${currentState.messageId}`
    );
  } else {
    console.log(
      '📌 Todavía no existe publicación para esta semana.'
    );
  }


  // ========================================
  // PUBLICAR O ACTUALIZAR
  // ========================================

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
    console.log(
      `❌ No se ha podido actualizar la publicación. Motivo: ${result.reason}`
    );

    if (isFinalAttempt()) {
      console.log(
        '⚠️ Se ha alcanzado el límite de las 09:30.'
      );
    } else {
      console.log(
        '🔁 Se volverá a intentar en 15 minutos.'
      );
    }

    return;
  }


  // ========================================
  // GUARDAR EL ESTADO
  // ========================================

  const newStatus =
    result.complete
      ? 'confirmed'
      : 'provisional';


  saveWeekState(
    week.startISO,
    {
      status:
        newStatus,

      messageId:
        result.messageId,

      complete:
        result.complete
    }
  );


  // ========================================
  // RESULTADO
  // ========================================

  if (result.complete) {
    console.log(
      '✅ La información ya está completa.'
    );

    console.log(
      '✅ El mensaje ha quedado confirmado.'
    );

    console.log(
      '🏁 Finalizan las comprobaciones para esta semana.'
    );

    return;
  }


  console.log(
    '⚠️ El mensaje continúa siendo provisional.'
  );


  if (isFinalAttempt()) {
    console.log(
      '⚠️ Son las 09:30.'
    );

    console.log(
      '⛔ Finaliza la ventana automática.'
    );

    console.log(
      '📌 El mensaje permanecerá publicado con los datos pendientes por confirmar.'
    );

    return;
  }


  console.log(
    '🔁 Se comprobará de nuevo en 15 minutos.'
  );
}


function startDailyRaceScheduler(
  client
) {
  console.log(
    '⏰ Scheduler de carreras iniciado.'
  );

  console.log(
    '📅 Ventana: domingo 19:30 → lunes 09:30.'
  );

  console.log(
    '🔁 Frecuencia: cada 15 minutos.'
  );


  cron.schedule(
    '0,15,30,45 * * * 0,1',

    async () => {
      try {
        await checkAndPublish(
          client
        );
      } catch (error) {
        console.error(
          '❌ Error en el scheduler:'
        );

        console.error(error);
      }
    },

    {
      timezone:
        TIMEZONE
    }
  );
}


module.exports = {
  startDailyRaceScheduler,
  checkAndPublish
};