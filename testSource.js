const axios = require('axios');
const cheerio = require('cheerio');

async function testSource() {
  const url = 'https://gtsh-rank.com/daily/';

  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 PRUEBA DE CONEXIÓN CON GTSH-RANK');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔄 Consultando ${url}`);
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

    console.log(`✅ Respuesta HTTP: ${response.status}`);
    console.log(`✅ HTML recibido: ${response.data.length} caracteres`);

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

    const hasNextWeek = bodyText.includes('Next Week');
    const hasRaceA = bodyText.includes('Daily Race A');
    const hasRaceB = bodyText.includes('Daily Race B');
    const hasRaceC = bodyText.includes('Daily Race C');

    console.log('Comprobaciones:');
    console.log(
      `Carreras de la próxima semana: ${hasNextWeek ? '✅ SÍ' : '❌ NO'}`
    );
    console.log(
      `Daily Race A encontrada: ${hasRaceA ? '✅ SÍ' : '❌ NO'}`
    );
    console.log(
      `Daily Race B encontrada: ${hasRaceB ? '✅ SÍ' : '❌ NO'}`
    );
    console.log(
      `Daily Race C encontrada: ${hasRaceC ? '✅ SÍ' : '❌ NO'}`
    );

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ No se ha podido consultar GTSH-Rank.');

    if (error.response) {
      console.error(`Código HTTP: ${error.response.status}`);
    } else {
      console.error(error.message);
    }
  }
}

testSource();