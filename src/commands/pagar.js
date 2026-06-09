const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');
const PixPayment = require('../models/PixPayment');
const { validarPixComIA } = require('../utils/validarPixIA');
const { entregarProdutoAutomatico } = require('../utils/entregarProduto');
const Config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pagar')
    .setDescription('Pagar com PIX')
    .addNumberOption(option =>
      option
        .setName('valor')
        .setDescription('Valor a pagar')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('produto')
        .setDescription('Qual produto você quer?')
        .setRequired(true)
        .addChoices(
          { name: 'VIP (R$ 50)', value: 'vip-50' },
          { name: 'Premium (R$ 100)', value: 'premium-100' },
          { name: 'Exclusive (R$ 200)', value: 'exclusive-200' }
        )
    ),
  
  async execute(interaction) {
    const valor = interaction.options.getNumber('valor');
    const produtoId = interaction.options.getString('produto');
    const usuarioId = interaction.user.id;
    
    try {
      // Criar registro de pagamento
      const pagamento = new PixPayment({
        usuarioId,
        username: interaction.user.username,
        valor,
        status: 'aguardando',
        produtoId,
        produtos: [{
          id: produtoId,
          nome: produtoId.split('-')[0].toUpperCase(),
          valor,
          quantidade: 1
        }]
      });
      
      await pagamento.save();
      
      // Criar embed com dados do PIX
      const embed = new EmbedBuilder()
        .setColor(Config.CORES.pix)
        .setTitle('💳 PAGAR COM PIX')
        .setThumbnail(interaction.user.displayAvatarURL())
        .addFields(
          {
            name: `${Config.EMOJIS.pix} QR Code (escanear com seu celular)`,
            value: 'Veja a imagem abaixo',
            inline: false
          },
          {
            name: `${Config.EMOJIS.dinheiro} Valor`,
            value: `**R$ ${valor.toFixed(2)}**`,
            inline: true
          },
          {
            name: '👤 Recebedor',
            value: `**${Config.PIX.nomeRecebedor}**`,
            inline: true
          },
          {
            name: '⏱️ Válido por',
            value: '**30 minutos**',
            inline: true
          },
          {
            name: `${Config.EMOJIS.info} Chave PIX (copiar e colar)`,
            value: `\`${Config.PIX.chave}\``,
            inline: false
          },
          {
            name: '📝 Como pagar:',
            value: '1. Abra seu app de banco\n2. Clique em PIX → Copiar e colar\n3. Cole a chave acima\n4. Coloque o valor\n5. Clique em enviar\n6. Volte aqui e clique em [Enviei PIX]',
            inline: false
          }
        )
        .setImage(Config.PIX.qrCodeUrl)
        .setFooter({ 
          text: `ID: ${pagamento._id}`,
          iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();
      
      // Botões
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('enviar-comprovante-pix')
            .setLabel('Enviei o PIX')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅'),
          
          new ButtonBuilder()
            .setCustomId('cancelar-pix')
            .setLabel('Cancelar')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('❌')
        );
      
      await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: false
      });
      
      console.log(`✅ Pagamento criado: ${pagamento._id} - R$ ${valor}`);
      
    } catch (error) {
      console.error('❌ Erro ao processar pagamento:', error);
      await interaction.reply({
        content: '❌ Erro ao processar pagamento',
        ephemeral: true
      });
    }
  }
};
