const axios = require('axios');
const cheerio = require('cheerio');

function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim();
}

async function inspectGridStats() {
  const url = 'https://gt-gridstats.com/dailies';

  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔎 INSPECCIÓN DE GT GRIDSTATS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const response = await axios.get(url, {
      timeout: 15000,

      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
          'AppleWebKit/537.36 Chrome/153.0.0.0 Safari/537.36',

        'Accept-Language':
          'es-ES,es;q=0.9,en;q=0.8'
      }
    });

    const $ = cheerio.load(response.data);

    const headings = $('h3');

    console.log('');
    console.log(`Circuitos encontrados: ${headings.length}`);
    console.log('');

    headings.each((index, heading) => {
      const track = cleanText(
        $(heading).text()
      );

      if (!track) {
        return;
      }

      console.log('====================================');
      console.log(`🏁 ${track}`);
      console.log('====================================');

      let current = $(heading);

      for (let level = 1; level <= 6; level++) {
        current = current.parent();

        if (!current.length) {
          break;
        }

        const tag =
          current[0]?.tagName || 'desconocido';

        const className =
          current.attr('class') || '(sin clase)';

        const id =
          current.attr('id') || '(sin id)';

        const text = cleanText(
          current.text()
        );

        console.log('');
        console.log(`NIVEL ${level}`);
        console.log(`Etiqueta: ${tag}`);
        console.log(`Clase: ${className}`);
        console.log(`ID: ${id}`);

        console.log(
          `Texto: ${text.substring(0, 700)}`
        );
      }

      console.log('');
    });

  } catch (error) {
    console.error(
      '❌ Error inspeccionando GT GridStats.'
    );

    if (error.response) {
      console.error(
        `Código HTTP: ${error.response.status}`
      );
    } else {
      console.error(error.message);
    }
  }
}

inspectGridStats();