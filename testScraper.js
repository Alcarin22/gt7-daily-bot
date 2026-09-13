const {
  getTargetWeekDailyRaces
} = require('./src/services/gtshScraper');

async function testScraper() {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🏁 PRUEBA DEL SCRAPER');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const races = await getTargetWeekDailyRaces();

    console.log('');
    console.log(`Carreras encontradas: ${races.length}`);
    console.log('');

    for (const race of races) {
      console.log('====================================');
      console.log(`Carrera ${race.name}`);
      console.log('====================================');

      console.log(`Fecha: ${race.date}`);
      console.log(`Circuito: ${race.track}`);
      console.log(`Neumático: ${race.tyreCode}`);

      console.log(`BoP: ${race.bop}`);
      console.log(`Setup: ${race.setup}`);
      console.log(`Daños: ${race.damage}`);
      console.log(`Salida: ${race.startType}`);

      console.log(
        `Combustible: x${race.fuelMultiplier}`
      );

      console.log(
        `Desgaste: x${race.tyreMultiplier}`
      );

      console.log(
        `Paradas: ${race.mandatoryStops}`
      );

      console.log(
        `Rebufo: ${race.slipstream}`
      );

      console.log(
        `Detalle: ${race.detailLink}`
      );

      console.log(
        `Imagen: ${race.courseImage}`
      );

      console.log('');
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:');
    console.error(error);
  }
}

testScraper();