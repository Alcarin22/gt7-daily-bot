require('dotenv').config();

const {
  REST,
  Routes
} = require('discord.js');

const rest = new REST({
  version: '10'
}).setToken(process.env.DISCORD_TOKEN);

async function checkCommands() {
  try {
    console.log('🔎 Consultando comandos registrados...');

    const commands = await rest.get(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID
      )
    );

    console.log('');
    console.log(`Comandos encontrados: ${commands.length}`);

    if (commands.length === 0) {
      console.log('❌ No hay ningún comando registrado.');
    }

    for (const command of commands) {
      console.log(
        `✅ /${command.name} → ${command.description}`
      );
    }

  } catch (error) {
    console.error('❌ Error al consultar comandos:', error);
  }
}

checkCommands();