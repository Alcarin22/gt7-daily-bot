const axios = require('axios');
const cheerio = require('cheerio');

async function testGridStats() {
  const url = 'https://gt-gridstats.com/dailies';

  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 PRUEBA DE CONEXIÓN CON GT GRIDSTATS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔄 Consultando ${url}`);
    console.log('');

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

    console.log(`✅ Respuesta HTTP: ${response.status}`);
    console.log(
      `✅ HTML recibido: ${response.data.length} caracteres`
    );

    const $ = cheerio.load(response.data);

    const title = $('title')
      .text()
      .replace(/\s+/g, ' ')
      .trim();

    console.log(`✅ Título: ${title}`);
    console.log('');

    const bodyText = $('body')
      .text()
      .replace(/\s+/g, ' ')
      .trim();

    console.log('Comprobaciones:');

    console.log(
      `Future Daily Races: ${
        bodyText.includes('Future Daily Races')
          ? '✅ SÍ'
          : '❌ NO'
      }`
    );

    console.log(
      `Current Races: ${
        bodyText.includes('Current Races')
          ? '✅ SÍ'
          : '❌ NO'
      }`
    );

    console.log(
      `Deep Forest Raceway: ${
        bodyText.includes('Deep Forest Raceway')
          ? '✅ SÍ'
          : '❌ NO'
      }`
    );

    console.log(
      `Autodromo Nazionale Monza: ${
        bodyText.includes('Autodromo Nazionale Monza')
          ? '✅ SÍ'
          : '❌ NO'
      }`
    );

    console.log(
      `Brands Hatch Grand Prix Circuit: ${
        bodyText.includes(
          'Brands Hatch Grand Prix Circuit'
        )
          ? '✅ SÍ'
          : '❌ NO'
      }`
    );

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error(
      '❌ No se ha podido consultar GT GridStats.'
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

testGridStats();