const { DateTime } = require('luxon');

const TIMEZONE = 'Europe/Madrid';

function getTargetMonday() {
  const now = DateTime.now().setZone(TIMEZONE);

  // Luxon:
  // lunes = 1
  // ...
  // domingo = 7

  if (now.weekday === 7) {
    return now
      .plus({ days: 1 })
      .startOf('day');
  }

  return now
    .minus({ days: now.weekday - 1 })
    .startOf('day');
}

function getTargetMondayISO() {
  return getTargetMonday().toFormat('yyyy-MM-dd');
}

function getTargetWeek() {
  const monday = getTargetMonday();

  const sunday = monday.plus({
    days: 6
  });

  return {
    startISO: monday.toFormat('yyyy-MM-dd'),
    endISO: sunday.toFormat('yyyy-MM-dd'),

    startDisplay: monday.toFormat('dd/MM/yyyy'),
    endDisplay: sunday.toFormat('dd/MM/yyyy')
  };
}

module.exports = {
  TIMEZONE,
  getTargetMonday,
  getTargetMondayISO,
  getTargetWeek
};