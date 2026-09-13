const { EmbedBuilder } = require('discord.js');


function translateTyre(code) {
  const tyres = {
    SH: 'Deportivos duros',
    SM: 'Deportivos medios',
    SS: 'Deportivos blandos',

    RH: 'Competición duros',
    RM: 'Competición medios',
    RS: 'Competición blandos',

    IM: 'Intermedios',
    W: 'Lluvia'
  };

  return tyres[code] || code || 'Por confirmar';
}


function translateStartType(value) {
  const types = {
    Grid: 'Parrilla',
    Rolling: 'Lanzada'
  };

  return types[value] || value || 'Por confirmar';
}


function translateBop(value) {
  if (value === 'On') {
    return 'Activado';
  }

  if (value === 'Off') {
    return 'Desactivado';
  }

  return value || 'Por confirmar';
}


function translateSetup(value) {
  const values = {
    Fixed: 'Fijo',
    Allowed: 'Permitido'
  };

  return values[value] || value || 'Por confirmar';
}


function translateDamage(value) {
  const values = {
    Light: 'Leve',
    Med: 'Medio',
    Heavy: 'Grave'
  };

  return values[value] || value || 'Por confirmar';
}


function translateSlipstream(value) {
  const values = {
    Simulation: 'Realista',
    Custom: 'Personalizado'
  };

  return values[value] || value || 'Por confirmar';
}


function getRaceStyle(name) {
  if (name === 'A') {
    return {
      color: 0x2ECC71,
      emoji: '🟢'
    };
  }

  if (name === 'B') {
    return {
      color: 0x3498DB,
      emoji: '🔵'
    };
  }

  return {
    color: 0xE74C3C,
    emoji: '🔴'
  };
}


function valueOrPending(value) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '🔸 Por confirmar';
  }

  return String(value);
}


function createDailyRaceEmbeds(data) {
  return data.races.map((race) => {
    const style = getRaceStyle(
      race.name
    );

    const embed = new EmbedBuilder()
      .setColor(style.color)

      .setTitle(
        `${style.emoji} Carrera Diaria ${race.name}`
      )

      .setDescription(
        [
          `📅 **Semana del ${data.week.startDisplay} al ${data.week.endDisplay}**`,

          data.complete
            ? '✅ **Información confirmada**'
            : '⚠️ **Información provisional — algunos datos están por confirmar**'
        ].join('\n')
      )

      .addFields(
        {
          name: '🏎️ Categoría',
          value: valueOrPending(
            race.category
          ),
          inline: true
        },

        {
          name: '📍 Circuito',
          value: valueOrPending(
            race.track
          ),
          inline: true
        },

        {
          name: '🔄 Vueltas',
          value: valueOrPending(
            race.laps
          ),
          inline: true
        },

        {
          name: '🚦 Salida',
          value: translateStartType(
            race.startType
          ),
          inline: true
        },

        {
          name: '⚖️ BoP',
          value: translateBop(
            race.bop
          ),
          inline: true
        },

        {
          name: '🛞 Neumáticos',
          value: translateTyre(
            race.tyreCode
          ),
          inline: true
        },

        {
          name: '⛽ Combustible',
          value:
            race.fuelMultiplier !== null
              ? `×${race.fuelMultiplier}`
              : '🔸 Por confirmar',
          inline: true
        },

        {
          name: '🛞 Desgaste',
          value:
            race.tyreMultiplier !== null
              ? `×${race.tyreMultiplier}`
              : '🔸 Por confirmar',
          inline: true
        },

        {
          name: '🔧 Configuración',
          value: translateSetup(
            race.setup
          ),
          inline: true
        },

        {
          name: '💥 Daños',
          value: translateDamage(
            race.damage
          ),
          inline: true
        },

        {
          name: '💨 Rebufo',
          value: translateSlipstream(
            race.slipstream
          ),
          inline: true
        }
      );


    /*
     * Si sabemos que hay parada obligatoria,
     * la mostramos.
     *
     * Si es 0, no mostramos nada porque
     * significa que no hay parada obligatoria.
     */

    if (race.mandatoryStops > 0) {
      embed.addFields({
        name: '🔧 Paradas obligatorias',
        value: String(
          race.mandatoryStops
        ),
        inline: true
      });
    }


    if (race.courseImage) {
      embed.setThumbnail(
        race.courseImage
      );
    }


    if (race.detailLink) {
      embed.setURL(
        race.detailLink
      );
    }


    return embed;
  });
}


module.exports = {
  createDailyRaceEmbeds
};