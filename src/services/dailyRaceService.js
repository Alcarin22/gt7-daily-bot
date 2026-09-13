const {
  getTargetWeekDailyRaces
} = require('./gtshScraper');

const {
  getFutureDailyRaces,
  getCurrentDailyRaces
} = require('./gtGridStatsScraper');

const {
  getTargetWeek
} = require('../utils/dateUtils');


function normalizeText(text) {
  if (!text) {
    return '';
  }

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}


function racesMatch(referenceRaces, candidateRaces) {
  if (
    referenceRaces.length !== 3 ||
    candidateRaces.length !== 3
  ) {
    return false;
  }

  return referenceRaces.every((referenceRace) => {
    const candidate = candidateRaces.find(
      (race) => race.name === referenceRace.name
    );

    if (!candidate) {
      return false;
    }

    return (
      normalizeText(referenceRace.track) ===
      normalizeText(candidate.track)
    );
  });
}


function mergeRace(gtshRace, gridRace) {
  return {
    name: gtshRace.name,

    date: gtshRace.date,

    track: gtshRace.track,

    tyreCode: gtshRace.tyreCode,

    bop: gtshRace.bop,

    setup: gtshRace.setup,

    damage: gtshRace.damage,

    startType: gtshRace.startType,

    fuelMultiplier:
      gtshRace.fuelMultiplier,

    tyreMultiplier:
      gtshRace.tyreMultiplier,

    mandatoryStops:
      gtshRace.mandatoryStops,

    slipstream:
      gtshRace.slipstream,

    detailLink:
      gtshRace.detailLink,

    courseImage:
      gtshRace.courseImage,

    laps:
      gridRace?.laps ?? null,

    category:
      gridRace?.category ?? null
  };
}


async function getDailyRaceData() {
  console.log(
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  );

  console.log(
    '🔄 RECOPILANDO DATOS DE LAS CARRERAS'
  );

  console.log(
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  );

  const gtshRaces =
    await getTargetWeekDailyRaces();

  if (gtshRaces.length !== 3) {
    return {
      complete: false,
      status: 'gtsh-incomplete',
      week: getTargetWeek(),
      races: []
    };
  }

  const [
    futureGridRaces,
    currentGridRaces
  ] = await Promise.all([
    getFutureDailyRaces(),
    getCurrentDailyRaces()
  ]);

  let gridRaces = [];
  let status = 'unknown';

  /*
   * Primero comprobamos CURRENT.
   *
   * El lunes, las carreras objetivo habrán pasado
   * de Future a Current.
   */
  if (
    racesMatch(
      gtshRaces,
      currentGridRaces
    )
  ) {
    gridRaces =
      currentGridRaces;

    status =
      'current';
  }

  /*
   * Si no coinciden con Current,
   * comprobamos Future.
   *
   * Esto será lo habitual el domingo.
   */
  else if (
    racesMatch(
      gtshRaces,
      futureGridRaces
    )
  ) {
    gridRaces =
      futureGridRaces;

    status =
      'future';
  }

  const races =
    gtshRaces.map((gtshRace) => {

      const gridRace =
        gridRaces.find(
          (race) =>
            race.name === gtshRace.name
        );

      return mergeRace(
        gtshRace,
        gridRace
      );
    });

  /*
   * Consideramos los datos completos únicamente
   * cuando tenemos vueltas y categoría.
   *
   * Es decir, normalmente cuando la rotación
   * ya ha pasado a Current Races.
   */
  const complete =
    races.length === 3 &&
    races.every(
      (race) =>
        race.laps !== null &&
        race.category !== null
    );

  return {
    complete,
    status,
    week: getTargetWeek(),
    races
  };
}


module.exports = {
  getDailyRaceData
};