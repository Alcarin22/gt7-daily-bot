const {
  getFutureDailyRaces
} = require('./src/services/gtGridStatsScraper');

async function test() {
  try {
    console.log(
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    );

    console.log(
      '🏁 FUTURE DAILY RACES'
    );

    console.log(
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    );

    const races =
      await getFutureDailyRaces();

    console.log('');
    console.log(
      `Carreras encontradas: ${races.length}`
    );

    console.log('');

    for (const race of races) {

      console.log(
        '===================================='
      );

      console.log(
        `Carrera ${race.name}`
      );

      console.log(
        '===================================='
      );

      console.log(
        `Circuito: ${race.track}`
      );

      console.log(
        `Combustible: x${race.fuelMultiplier}`
      );

      console.log(
        `Desgaste: x${race.tyreMultiplier}`
      );

      console.log('');
    }

  } catch (error) {

    console.error(
      '❌ Error durante la prueba:'
    );

    console.error(error);
  }
}

test();