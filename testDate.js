const {
  getTargetMondayISO,
  getTargetWeek
} = require('./src/utils/dateUtils');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📅 SEMANA OBJETIVO');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

console.log(
  `Lunes objetivo: ${getTargetMondayISO()}`
);

const week = getTargetWeek();

console.log(
  `Inicio: ${week.startDisplay}`
);

console.log(
  `Fin: ${week.endDisplay}`
);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');