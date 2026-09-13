const axios = require('axios');
const cheerio = require('cheerio');

async function inspectWeek() {
  const url =
    'https://gtsh-rank.com/daily/week/2026-09-14/';

  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔎 INSPECCIÓN DE LA SEMANA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🌐 ${url}`);
    console.log('');

    const response = await axios.get(url, {
      timeout: 15000,

      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/153.0.0.0 Safari/537.36',

        'Accept-Language':
          'es-ES,es;q=0.9,en;q=0.8'
      }
    });

    const $ = cheerio.load(response.data);

    $('h2').each((index, element) => {
      const track = $(element)
        .text()
        .replace(/\s+/g, ' ')
        .trim();

      if (!track || track === 'World Leader Lap') {
        return;
      }

      console.log('====================================');
      console.log(`🏁 CIRCUITO: ${track}`);
      console.log('====================================');

      let current = $(element);

      for (let level = 1; level <= 5; level++) {
        current = current.parent();

        if (!current.length) {
          break;
        }

        const tag = current[0]?.tagName || 'desconocido';

        const className =
          current.attr('class') || '(sin clase)';

        const text = current
          .text()
          .replace(/\s+/g, ' ')
          .trim();

        console.log('');
        console.log(`NIVEL ${level}`);
        console.log(`Etiqueta: ${tag}`);
        console.log(`Clase: ${className}`);
        console.log(`Texto: ${text.substring(0, 700)}`);
      }

      console.log('');
    });

  } catch (error) {
    console.error('❌ Error inspeccionando la página.');

    if (error.response) {
      console.error(
        `Código HTTP: ${error.response.status}`
      );
    } else {
      console.error(error.message);
    }
  }
}

inspectWeek();