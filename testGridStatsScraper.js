const {
  getCurrentDailyRaces
} = require('./src/services/gtGridStatsScraper');

async function testGridStatsScraper() {
  try {
    console.log(
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    );

    console.log(
      '🏁 PRUEBA GT GRIDSTATS SCRAPER'
    );

    console.log(
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    );

    const races =
      await getCurrentDailyRaces();

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
        `Vueltas: ${race.laps}`
      );

      console.log(
        `Categoría: ${race.category}`
      );

      console.log(
        `Combustible: x${race.fuelMultiplier}`
      );

      console.log(
        `Desgaste: x${race.tyreMultiplier}`
      );

      console.log(
        `Coche META: ${race.metaVehicle}`
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

testGridStatsScraper();