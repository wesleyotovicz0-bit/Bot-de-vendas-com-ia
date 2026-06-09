module.exports = {
  // ========== PIX CONFIG ==========
  PIX: {
    chave: process.env.PIX_CHAVE || 'seu-email@gmail.com',
    nomeRecebedor: process.env.PIX_NOME || 'Seu Nome',
    banco: 'Banco do Brasil',
    // QR Code pode ser URL ou local
    qrCodeUrl: process.env.QR_CODE_URL || './assets/qrcode-pix.png',
    // Canal para enviar comprovantes (admin)
    canalComprovanteId: process.env.CANAL_COMPROVANTE_ID,
    // Canal de logs
    canalLogsId: process.env.CANAL_LOGS_ID
  },

  // ========== IA CONFIG ==========
  IA: {
    provedor: 'claude', // claude ou openai
    claudeApiKey: process.env.CLAUDE_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY
  },

  // ========== CORES DOS EMBEDS ==========
  CORES: {
    sucesso: '#00FF00',
    erro: '#FF0000',
    info: '#0099FF',
    aviso: '#FFD700',
    pix: '#1f8f4f'
  },

  // ========== EMOJIS ==========
  EMOJIS: {
    sucesso: '✅',
    erro: '❌',
    aviso: '⚠️',
    info: 'ℹ️',
    carrinho: '🛒',
    produto: '📦',
    ticket: '🎫',
    pix: '💳',
    dinheiro: '💰',
    coroa: '👑'
  },

  // ========== ROLES (IDs) ==========
  ROLES: {
    admin: process.env.ROLE_ADMIN_ID,
    vendedor: process.env.ROLE_VENDEDOR_ID,
    vip: process.env.ROLE_VIP_ID
  },

  // ========== CANAIS (IDs) ==========
  CANAIS: {
    vendas: process.env.CANAL_VENDAS_ID,
    logs: process.env.CANAL_LOGS_ID,
    suporte: process.env.CANAL_SUPORTE_ID
  },

  // ========== TIMEOUT ==========
  TIMEOUTS: {
    pixExpira: 30 * 60 * 1000, // 30 minutos
    carrinhoExpira: 24 * 60 * 60 * 1000 // 24 horas
  }
};
