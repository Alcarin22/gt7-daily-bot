const {
  getDailyRaceData
} = require('./src/services/dailyRaceService');

async function test() {
  try {
    const data =
      await getDailyRaceData();

    console.log('');
    console.log(
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    );

    console.log(
      '📊 RESULTADO FINAL'
    );

    console.log(
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    );

    console.log(
      `Semana: ${data.week.startDisplay} → ${data.week.endDisplay}`
    );

    console.log(
      `Estado GT GridStats: ${data.status}`
    );

    console.log(
      `Datos completos: ${
        data.complete
          ? '✅ SÍ'
          : '❌ NO'
      }`
    );

    console.log('');

    for (const race of data.races) {

      console.log(
        '===================================='
      );

      console.log(
        `🏁 Carrera ${race.name}`
      );

      console.log(
        '===================================='
      );

      console.log(
        `Circuito: ${race.track}`
      );

      console.log(
        `Categoría: ${race.category ?? 'PENDIENTE'}`
      );

      console.log(
        `Vueltas: ${race.laps ?? 'PENDIENTE'}`
      );

      console.log(
        `Neumático: ${race.tyreCode}`
      );

      console.log(
        `BoP: ${race.bop}`
      );

      console.log(
        `Salida: ${race.startType}`
      );

      console.log(
        `Combustible: x${race.fuelMultiplier}`
      );

      console.log(
        `Desgaste: x${race.tyreMultiplier}`
      );

      console.log(
        `Paradas: ${race.mandatoryStops}`
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