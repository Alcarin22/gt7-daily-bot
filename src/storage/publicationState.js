const fs = require('fs');
const path = require('path');

const DATA_DIRECTORY = path.join(
  __dirname,
  '../../data'
);

const STATE_FILE = path.join(
  DATA_DIRECTORY,
  'publication-state.json'
);


function ensureStorageExists() {
  if (!fs.existsSync(DATA_DIRECTORY)) {
    fs.mkdirSync(
      DATA_DIRECTORY,
      {
        recursive: true
      }
    );
  }

  if (!fs.existsSync(STATE_FILE)) {
    fs.writeFileSync(
      STATE_FILE,
      JSON.stringify(
        {
          publications: {}
        },
        null,
        2
      ),
      'utf8'
    );
  }
}


function readState() {
  ensureStorageExists();

  try {
    const content = fs.readFileSync(
      STATE_FILE,
      'utf8'
    );

    return JSON.parse(content);

  } catch (error) {
    console.error(
      '❌ Error leyendo publication-state.json:'
    );

    console.error(error);

    return {
      publications: {}
    };
  }
}


function writeState(state) {
  ensureStorageExists();

  fs.writeFileSync(
    STATE_FILE,
    JSON.stringify(
      state,
      null,
      2
    ),
    'utf8'
  );
}


function getWeekState(weekStartISO) {
  const state = readState();

  return (
    state.publications?.[weekStartISO] ||
    null
  );
}


function saveWeekState(
  weekStartISO,
  values
) {
  const state = readState();

  if (!state.publications) {
    state.publications = {};
  }

  const previous =
    state.publications[weekStartISO] || {};

  const now =
    new Date().toISOString();

  state.publications[weekStartISO] = {
    ...previous,
    ...values,

    createdAt:
      previous.createdAt || now,

    updatedAt:
      now
  };

  writeState(state);

  return state.publications[
    weekStartISO
  ];
}


module.exports = {
  getWeekState,
  saveWeekState
};