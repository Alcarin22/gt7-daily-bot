const axios = require('axios');
const cheerio = require('cheerio');

function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim();
}

function directText($, element) {
  return cleanText(
    $(element)
      .contents()
      .filter(function () {
        return this.type === 'text';
      })
      .text()
  );
}

function printElement($, element, depth = 0, maxDepth = 8) {
  if (depth > maxDepth) {
    return;
  }

  const tag =
    element.tagName ||
    element.name ||
    'unknown';

  const className =
    $(element).attr('class') || '';

  const text =
    directText($, element);

  const indentation =
    '  '.repeat(depth);

  let line =
    `${indentation}<${tag}`;

  if (className) {
    line += ` class="${className}"`;
  }

  line += '>';

  if (text) {
    line += `  "${text}"`;
  }

  console.log(line);

  $(element)
    .children()
    .each((index, child) => {
      printElement(
        $,
        child,
        depth + 1,
        maxDepth
      );
    });
}

async function inspectCurrentRace() {
  const url =
    'https://gt-gridstats.com/dailies';

  try {
    console.log(
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    );
    console.log(
      '🔎 INSPECCIÓN DE CARRERAS ACTUALES'
    );
    console.log(
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    );

    const response =
      await axios.get(url, {
        timeout: 15000,

        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
            'AppleWebKit/537.36 Chrome/153.0.0.0 Safari/537.36',

          'Accept-Language':
            'es-ES,es;q=0.9,en;q=0.8'
        }
      });

    const $ =
      cheerio.load(response.data);

    let currentSection = null;

    $('div.mb-16').each(
      (index, section) => {

        const text = cleanText(
          $(section).text()
        );

        if (
          text.startsWith(
            'Current Races'
          )
        ) {
          currentSection = section;
          return false;
        }
      }
    );

    if (!currentSection) {
      console.log(
        '❌ No se ha encontrado la sección Current Races.'
      );
      return;
    }

    const articles =
      $(currentSection)
        .find('article');

    console.log(
      `Carreras actuales encontradas: ${articles.length}`
    );

    console.log('');

    articles.each(
      (index, article) => {

        console.log(
          '===================================='
        );

        console.log(
          `🏁 CARRERA ACTUAL ${index + 1}`
        );

        console.log(
          '===================================='
        );

        printElement(
          $,
          article
        );

        console.log('');
      }
    );

  } catch (error) {

    console.error(
      '❌ Error inspeccionando las carreras actuales.'
    );

    if (error.response) {
      console.error(
        `Código HTTP: ${error.response.status}`
      );
    } else {
      console.error(
        error.message
      );
    }
  }
}

inspectCurrentRace();