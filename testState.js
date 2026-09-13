const {
  getWeekState,
  saveWeekState
} = require('./src/storage/publicationState');


console.log(
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
);

console.log(
  '🧪 PRUEBA DE PUBLICATION STATE'
);

console.log(
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
);


const week = '2026-09-14';


console.log(
  `📅 Semana de prueba: ${week}`
);


console.log(
  '💾 Guardando estado...'
);


const savedState = saveWeekState(
  week,
  {
    status: 'provisional',
    messageId: 'PRUEBA-123456',
    complete: false
  }
);


console.log(
  '✅ Estado guardado:'
);

console.log(
  savedState
);


console.log('');
console.log(
  '🔎 Leyendo estado...'
);


const readState =
  getWeekState(
    week
  );


console.log(
  '✅ Estado leído:'
);

console.log(
  readState
);