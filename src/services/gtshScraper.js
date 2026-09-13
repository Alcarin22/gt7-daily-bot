const axios = require('axios');
const cheerio = require('cheerio');

const {
  getTargetMondayISO
} = require('../utils/dateUtils');

const BASE_URL = 'https://gtsh-rank.com';

function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim();
}

function getSpecs($, card) {
  const specs = {};

  $(card)
    .find('.daily-specs > div')
    .each((index, element) => {
      const label = cleanText(
        $(element)
          .find('span')
          .first()
          .text()
      );

      const value = cleanText(
        $(element)
          .find('strong')
          .first()
          .text()
      );

      if (label) {
        specs[label] = value;
      }
    });

  return specs;
}

function parseMultiplier(value) {
  if (!value) {
    return null;
  }

  const number = Number(
    value.replace(/^x/i, '')
  );

  return Number.isNaN(number)
    ? null
    : number;
}

function parsePitStops(value) {
  if (!value || value === '-') {
    return 0;
  }

  const number = Number(value);

  return Number.isNaN(number)
    ? 0
    : number;
}

function absoluteUrl(url) {
  if (!url) {
    return null;
  }

  try {
    return new URL(
      url,
      BASE_URL
    ).href;
  } catch {
    return null;
  }
}

async function getTargetWeekDailyRaces() {
  const monday =
    getTargetMondayISO();

  const url =
    `${BASE_URL}/daily/week/${monday}/`;

  console.log(
    `🌐 Consultando GTSH-Rank para la semana ${monday}...`
  );

  const response = await axios.get(
    url,
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

  const cards =
    $('article.daily-race-card');

  if (cards.length === 0) {
    console.log(
      '⚠️ No se han encontrado carreras para esa semana.'
    );

    return [];
  }

  const races = [];

  cards.each((index, card) => {
    const specs =
      getSpecs($, card);

    const name = cleanText(
      $(card)
        .find('.daily-letter')
        .first()
        .text()
    );

    const date = cleanText(
      $(card)
        .find('.daily-start-date')
        .first()
        .text()
    );

    const track = cleanText(
      $(card)
        .find('.daily-title h2')
        .first()
        .text()
    );

    const tyreCode = cleanText(
      $(card)
        .find('.daily-tires .tire-ring')
        .first()
        .text()
    );

    const detailLink =
      absoluteUrl(
        $(card)
          .find('.daily-card-link')
          .attr('href')
      );

    const courseImage =
      absoluteUrl(
        $(card)
          .find('img.daily-course')
          .attr('src')
      );

    races.push({
      name,
      date,
      track,
      tyreCode,

      bop:
        specs.BoP || null,

      setup:
        specs.Setup || null,

      damage:
        specs.Damage || null,

      startType:
        specs.Start || null,

      fuelMultiplier:
        parseMultiplier(
          specs.Fuel
        ),

      tyreMultiplier:
        parseMultiplier(
          specs.Tyres
        ),

      mandatoryStops:
        parsePitStops(
          specs.Pit
        ),

      slipstream:
        specs.Slipstream || null,

      detailLink,
      courseImage
    });
  });

  races.sort(
    (a, b) =>
      a.name.localeCompare(b.name)
  );

  return races;
}

module.exports = {
  getTargetWeekDailyRaces
};