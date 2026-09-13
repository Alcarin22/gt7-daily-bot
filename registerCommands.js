require('dotenv').config();

const {
  REST,
  Routes,
  SlashCommandBuilder
} = require('discord.js');

const command = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Publica las carreras diarias de Gran Turismo 7');

const commands = [
  command.toJSON()
];

const rest = new REST({
  version: '10'
}).setToken(process.env.DISCORD_TOKEN);

async function registerCommands() {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔄 REGISTRO DE COMANDOS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log(`Application ID: ${process.env.DISCORD_CLIENT_ID}`);
    console.log(`Servidor ID: ${process.env.DISCORD_GUILD_ID}`);
    console.log('');
    console.log(`Comandos a registrar: ${commands.length}`);
    console.log(`➡️ /${commands[0].name}`);
    console.log('');

    const result = await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID
      ),
      {
        body: commands
      }
    );

    console.log('✅ Discord ha aceptado el registro.');
    console.log(`✅ Comandos registrados: ${result.length}`);

    for (const registeredCommand of result) {
      console.log(
        `✅ /${registeredCommand.name} → ${registeredCommand.description}`
      );
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Error al registrar los comandos:');
    console.error(error);
  }
}

registerCommands();