const axios = require('axios');
const cheerio = require('cheerio');

const GRIDSTATS_URL = 'https://gt-gridstats.com/dailies';

function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim();
}

function findSection($, sectionTitle) {
  let foundSection = null;

  $('div.mb-16').each((index, section) => {
    const text = cleanText(
      $(section).text()
    );

    if (text.startsWith(sectionTitle)) {
      foundSection = section;
      return false;
    }
  });

  return foundSection;
}

function extractRaceName(text) {
  const match = text.match(
    /\bRace\s+([ABC])\b/i
  );

  return match
    ? match[1].toUpperCase()
    : null;
}

function extractLaps(text) {
  const match = text.match(
    /\b(\d+)\s+Laps?\b/i
  );

  return match
    ? Number(match[1])
    : null;
}

function extractFuelMultiplier(text) {
  const match = text.match(
    /\bFuel\s+x(\d+)\b/i
  );

  return match
    ? Number(match[1])
    : null;
}

function extractTyreMultiplier(text) {
  const match = text.match(
    /\bTires\s+x(\d+)\b/i
  );

  return match
    ? Number(match[1])
    : null;
}

function extractCategory(text, track) {
  if (!text || !track) {
    return null;
  }

  const escapedTrack = track.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );

  const regex = new RegExp(
    `Laps?\\s+(.+?)\\s+${escapedTrack}`,
    'i'
  );

  const match = text.match(regex);

  return match
    ? cleanText(match[1])
    : null;
}


// ========================================
// CARRERAS FUTURAS
// ========================================

async function getFutureDailyRaces() {
  console.log(
    '🌐 Consultando carreras FUTURAS en GT GridStats...'
  );

  const response = await axios.get(
    GRIDSTATS_URL,
    {
      timeout: 15000,

      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
          'AppleWebKit/537.36 Chrome/153.0.0.0 Safari/537.36',

        'Accept-Language':
          'es-ES,es;q=0.9,en;q=0.8'
      }
    }
  );

  const $ = cheerio.load(
    response.data
  );

  const futureSection =
    findSection(
      $,
      'Future Daily Races'
    );

  if (!futureSection) {
    console.log(
      '⚠️ No se ha encontrado Future Daily Races.'
    );

    return [];
  }

  const races = [];

  $(futureSection)
    .find('article')
    .each((index, article) => {

      const text = cleanText(
        $(article).text()
      );

      const name =
        extractRaceName(text);

      const track = cleanText(
        $(article)
          .find('h3')
          .first()
          .text()
      );

      if (!name || !track) {
        return;
      }

      races.push({
        name,
        track,

        fuelMultiplier:
          extractFuelMultiplier(text),

        tyreMultiplier:
          extractTyreMultiplier(text)
      });
    });

  races.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return races;
}


// ========================================
// CARRERAS ACTUALES
// ========================================

async function getCurrentDailyRaces() {
  console.log(
    '🌐 Consultando carreras ACTUALES en GT GridStats...'
  );

  const response = await axios.get(
    GRIDSTATS_URL,
    {
      timeout: 15000,

      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
          'AppleWebKit/537.36 Chrome/153.0.0.0 Safari/537.36',

        'Accept-Language':
          'es-ES,es;q=0.9,en;q=0.8'
      }
    }
  );

  const $ = cheerio.load(
    response.data
  );

  const currentSection =
    findSection(
      $,
      'Current Races'
    );

  if (!currentSection) {
    console.log(
      '⚠️ No se ha encontrado Current Races.'
    );

    return [];
  }

  const races = [];

  $(currentSection)
    .find('article')
    .each((index, article) => {

      const text = cleanText(
        $(article).text()
      );

      const name =
        extractRaceName(text);

      const track = cleanText(
        $(article)
          .find('h3')
          .first()
          .text()
      );

      if (!name || !track) {
        return;
      }

      races.push({
        name,
        track,

        laps:
          extractLaps(text),

        category:
          extractCategory(
            text,
            track
          ),

        fuelMultiplier:
          extractFuelMultiplier(text),

        tyreMultiplier:
          extractTyreMultiplier(text)
      });
    });

  races.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return races;
}


module.exports = {
  getFutureDailyRaces,
  getCurrentDailyRaces
};