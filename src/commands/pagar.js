const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
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
    const nomeProduto = produtoId.split('-')[0].toUpperCase();

    try {
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
            name: '📦 Produto',
            value: `**${nomeProduto}**`,
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
            value: '1. Abra seu app de banco\n2. Clique em PIX → Copiar e colar\n3. Cole a chave acima\n4. Coloque o valor\n5. Clique em enviar\n6. Volte aqui e clique em **Enviei o PIX**',
            inline: false
          }
        )
        .setImage(Config.PIX.qrCodeUrl)
        .setFooter({
          text: `Solicitado por ${interaction.user.username}`,
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

      console.log(`✅ Instrução de pagamento enviada para ${interaction.user.username} - R$ ${valor.toFixed(2)} (${produtoId})`);

    } catch (error) {
      console.error('❌ Erro ao processar pagamento:', error);
      await interaction.reply({
        content: '❌ Erro ao processar pagamento. Tente novamente mais tarde.',
        ephemeral: true
      });
    }
  }
};
