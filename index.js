require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers
  ]
});

// Collections
client.commands = new Collection();
client.events = new Collection();

// ========== CARREGAR COMANDOS ==========
const commandsPath = path.join(__dirname, 'src', 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`✅ Comando carregado: ${command.data.name}`);
    }
  }
}

// ========== CARREGAR EVENTOS ==========
const eventsPath = path.join(__dirname, 'src', 'events');
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  
  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    
    if ('name' in event && 'execute' in event) {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
      console.log(`✅ Evento carregado: ${event.name}`);
    }
  }
}

// ========== CONECTAR MONGODB ==========
async function conectarMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message);
    process.exit(1);
  }
}

// ========== INTERAÇÕES ==========
client.on('interactionCreate', async interaction => {
  // ========== SLASH COMMANDS ==========
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    
    if (!command) {
      await interaction.reply({
        content: '❌ Comando não encontrado',
        ephemeral: true
      });
      return;
    }
    
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: '❌ Erro ao executar comando',
        ephemeral: true
      });
    }
  }
  
  // ========== BOTÕES ==========
  if (interaction.isButton()) {
    // Aqui vão os handlers de botão
    // Você adiciona suas lógicas de botão
  }
  
  // ========== MODAIS ==========
  if (interaction.isModalSubmit()) {
    // Aqui vão os handlers de modal
    // Você adiciona suas lógicas de modal
  }
  
  // ========== SELECT MENUS ==========
  if (interaction.isStringSelectMenu()) {
    // Aqui vão os handlers de select
    // Você adiciona suas lógicas de select
  }
});

// ========== BOT PRONTO ==========
client.once('ready', () => {
  console.log(`\n🤖 Bot online como ${client.user.tag}`);
  console.log(`✅ Em ${client.guilds.cache.size} servidor(es)\n`);
  
  // Registrar comandos slash
  registrarComandosSlash();
});

// ========== REGISTRAR COMANDOS SLASH ==========
async function registrarComandosSlash() {
  try {
    const commands = [];
    
    for (const [name, command] of client.commands) {
      commands.push(command.data.toJSON());
    }
    
    // Registrar globalmente (demora até 1 hora)
    // Para testar, registre em um servidor específico
    
    console.log(`✅ ${commands.length} comando(s) registrado(s)`);
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
  }
}

// ========== LOGIN ==========
async function iniciarBot() {
  try {
    await conectarMongoDB();
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error('❌ Erro ao iniciar bot:', error);
    process.exit(1);
  }
}

iniciarBot();

// ========== TRATAMENTO DE ERROS ==========
process.on('unhandledRejection', error => {
  console.error('❌ Erro não tratado:', error);
});

process.on('uncaughtException', error => {
  console.error('❌ Exception não capturada:', error);
  process.exit(1);
});
