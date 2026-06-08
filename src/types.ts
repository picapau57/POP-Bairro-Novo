export interface Announcement {
  id: string;
  title: string;
  content: string;
  gradientFrom: string;
  gradientTo: string;
  buttonText: string;
  active: boolean;
  link?: string;
}

export interface ISPConfig {
  providerName: string;
  providerPhone: string;
  whatsappNumber: string;
  address: string;
  supportEmail: string;
  announcementText: string;
  logoColor: string; // Tailwind color class
}

export interface ClientProfile {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  planName: string;
  planSpeed: number; // in Megabytes (e.g., 400)
  monthlyValue: number;
  status: 'Ativo' | 'Suspenso' | 'Bloqueado';
  consumptionHistory: { day: string; gb: number }[];
}

export interface Invoice {
  id: string;
  clientId: string;
  monthRef: string;
  value: number;
  dueDate: string;
  status: 'Pendente' | 'Pago' | 'Atrasado';
  pixKey: string;
  paidAt?: string;
}

export interface SupportTicket {
  id: string;
  clientId: string;
  clientName: string;
  category: string;
  description: string;
  createdAt: string;
  status: 'Aberto' | 'Em Atendimento' | 'Resolvido';
  response?: string;
  responseAt?: string;
}

export const INITIAL_ISP_CONFIG: ISPConfig = {
  providerName: "Pica-Pau Netweaver",
  providerPhone: "(11) 98765-4321",
  whatsappNumber: "5511987654321",
  address: "Av. das Nações, 1500 - Centro, São Paulo - SP",
  supportEmail: "contato@picapaunetweaver.com.br",
  announcementText: "Super Promoção: Indique um amigo e ganhe 50% de desconto na próxima fatura! 🚀",
  logoColor: "red"
};

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Indicação Premiada 🎁",
    content: "Traga seus amigos e parentes para a Fibra Óptica mais rápida do Brasil! A cada indicação contratada, você e seu amigo ganham R$ 50,00 de desconto.",
    gradientFrom: "#ef4444", // red-500
    gradientTo: "#f97316", // orange-500
    buttonText: "Indicar via WhatsApp",
    active: true
  },
  {
    id: "ann-2",
    title: "Upgrade Grátis de Velocidade ⚡",
    content: "Assinantes do plano de 200 Mega receberão upgrade automático para 400 Mega durante os próximos 3 meses de navegação, sem custo adicional!",
    gradientFrom: "#3b82f6", // blue-500
    gradientTo: "#06b6d4", // cyan-500
    buttonText: "Garantir Upgrade",
    active: true
  },
  {
    id: "ann-3",
    title: "Sua Fatura Digital no E-mail 📧",
    content: "Cadastre seu e-mail em nosso sistema para receber as faturas automáticas todo mês e ajude no meio ambiente. Evite papelada e pague rápido com Pix!",
    gradientFrom: "#10b981", // emerald-500
    gradientTo: "#84cc16", // lime-500
    buttonText: "Cadastrar E-mail",
    active: true
  }
];

export const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: "cli-1",
    name: "Woody Pica-Pau",
    cpf: "123.456.789-00",
    phone: "(11) 99999-8888",
    planName: "Fibra Ultra Gamer Pica-Pau",
    planSpeed: 600,
    monthlyValue: 129.90,
    status: 'Ativo',
    consumptionHistory: [
      { day: "Seg 01", gb: 45.2 },
      { day: "Ter 02", gb: 52.8 },
      { day: "Qua 03", gb: 61.1 },
      { day: "Qui 04", gb: 38.6 },
      { day: "Sex 05", gb: 72.4 },
      { day: "Sáb 06", gb: 95.0 },
      { day: "Dom 07", gb: 88.3 }
    ]
  },
  {
    id: "cli-2",
    name: "José da Silva Santos",
    cpf: "321.654.987-11",
    phone: "(11) 98888-7777",
    planName: "Fibra Residencial Home Office",
    planSpeed: 300,
    monthlyValue: 89.90,
    status: 'Ativo',
    consumptionHistory: [
      { day: "Seg 01", gb: 12.4 },
      { day: "Ter 02", gb: 15.3 },
      { day: "Qua 03", gb: 11.8 },
      { day: "Qui 04", gb: 24.1 },
      { day: "Sex 05", gb: 18.5 },
      { day: "Sáb 06", gb: 32.0 },
      { day: "Dom 07", gb: 29.4 }
    ]
  },
  {
    id: "cli-3",
    name: "Ana Julia Ferreira",
    cpf: "456.789.123-22",
    phone: "(11) 97777-6666",
    planName: "Fibra Standard Econômica",
    planSpeed: 150,
    monthlyValue: 59.90,
    status: 'Ativo',
    consumptionHistory: [
      { day: "Seg 01", gb: 4.5 },
      { day: "Ter 02", gb: 6.2 },
      { day: "Qua 03", gb: 5.1 },
      { day: "Qui 04", gb: 9.8 },
      { day: "Sex 05", gb: 11.2 },
      { day: "Sáb 06", gb: 15.4 },
      { day: "Dom 07", gb: 8.7 }
    ]
  },
  {
    id: "cli-4",
    name: "Carlos Eduardo Costa (Financeiro Atrasado)",
    cpf: "111.222.333-44",
    phone: "(11) 96666-5555",
    planName: "Fibra Corporativa Full Line",
    planSpeed: 400,
    monthlyValue: 119.90,
    status: 'Bloqueado',
    consumptionHistory: [
      { day: "Seg 01", gb: 1.2 },
      { day: "Ter 02", gb: 0.8 },
      { day: "Qua 03", gb: 0.0 },
      { day: "Qui 04", gb: 0.0 },
      { day: "Sex 05", gb: 0.0 },
      { day: "Sáb 06", gb: 0.0 },
      { day: "Dom 07", gb: 0.0 }
    ]
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  // Client 1 Woody - Paid, Paid, Pending
  {
    id: "inv-101",
    clientId: "cli-1",
    monthRef: "Março/2026",
    value: 129.90,
    dueDate: "2026-03-10",
    status: "Pago",
    pixKey: "00020101021226830014br.gov.bcb.pix2561api.picapaunetweaver.com.br/qr/v2/inv-1015204000053039865406129.905802BR5919PicaPauNetweaver6009Sao Paulo62070503***6304ED2F",
    paidAt: "2026-03-08"
  },
  {
    id: "inv-102",
    clientId: "cli-1",
    monthRef: "Abril/2026",
    value: 129.90,
    dueDate: "2026-04-10",
    status: "Pago",
    pixKey: "00020101021226830014br.gov.bcb.pix2561api.picapaunetweaver.com.br/qr/v2/inv-1025204000053039865406129.905802BR5919PicaPauNetweaver6009Sao Paulo62070503***6304ED2F",
    paidAt: "2026-04-09"
  },
  {
    id: "inv-103",
    clientId: "cli-1",
    monthRef: "Maio/2026",
    value: 129.90,
    dueDate: "2026-05-10",
    status: "Pago",
    pixKey: "00020101021226830014br.gov.bcb.pix2561api.picapaunetweaver.com.br/qr/v2/inv-1035204000053039865406129.905802BR5919PicaPauNetweaver6009Sao Paulo62070503***6304ED2F",
    paidAt: "2026-05-10"
  },
  {
    id: "inv-104",
    clientId: "cli-1",
    monthRef: "Junho/2026",
    value: 129.90,
    dueDate: "2026-06-15",
    status: "Pendente",
    pixKey: "00020101021226830014br.gov.bcb.pix2561api.picapaunetweaver.com.br/qr/v2/inv-1045204000053039865406129.905802BR5919PicaPauNetweaver6009Sao Paulo62070503***6304ED2F"
  },

  // Client 2 José - Paid, Pending
  {
    id: "inv-201",
    clientId: "cli-2",
    monthRef: "Maio/2026",
    value: 89.90,
    dueDate: "2026-05-10",
    status: "Pago",
    pixKey: "00020101021226830014br.gov.bcb.pix2561api.picapaunetweaver.com.br/qr/v2/inv-2015204000053039865405089.905802BR5919PicaPauNetweaver6009Sao Paulo62070503***6304ED2F",
    paidAt: "2026-05-10"
  },
  {
    id: "inv-202",
    clientId: "cli-2",
    monthRef: "Junho/2026",
    value: 89.90,
    dueDate: "2026-06-12",
    status: "Pendente",
    pixKey: "00020101021226830014br.gov.bcb.pix2561api.picapaunetweaver.com.br/qr/v2/inv-2025204000053039865405089.905802BR5919PicaPauNetweaver6009Sao Paulo62070503***6304ED2F"
  },

  // Client 3 Ana
  {
    id: "inv-301",
    clientId: "cli-3",
    monthRef: "Maio/2026",
    value: 59.90,
    dueDate: "2026-05-10",
    status: "Pago",
    pixKey: "00020101021226830014br.gov.bcb.pix2561api.picapaunetweaver.com.br/qr/v2/inv-3015204000053039865405059.905802BR5919PicaPauNetweaver6009Sao Paulo62070503***6304ED2F",
    paidAt: "2026-05-09"
  },
  {
    id: "inv-302",
    clientId: "cli-3",
    monthRef: "Junho/2026",
    value: 59.90,
    dueDate: "2026-06-10",
    status: "Pendente",
    pixKey: "00020101021226830014br.gov.bcb.pix2561api.picapaunetweaver.com.br/qr/v2/inv-3025204000053039865405059.905802BR5919PicaPauNetweaver6009Sao Paulo62070503***6304ED2F"
  },

  // Client 4 Carlos - Blocked / Atrasado
  {
    id: "inv-401",
    clientId: "cli-4",
    monthRef: "Abril/2026",
    value: 119.90,
    dueDate: "2026-04-10",
    status: "Atrasado",
    pixKey: "00020101021226830014br.gov.bcb.pix2561api.picapaunetweaver.com.br/qr/v2/inv-4015204000053039865405119.905802BR5919PicaPauNetweaver6009Sao Paulo62070503***6304ED2F"
  },
  {
    id: "inv-402",
    clientId: "cli-4",
    monthRef: "Maio/2026",
    value: 119.90,
    dueDate: "2026-05-10",
    status: "Atrasado",
    pixKey: "00020101021226830014br.gov.bcb.pix2561api.picapaunetweaver.com.br/qr/v2/inv-4025204000053039865405119.905802BR5919PicaPauNetweaver6009Sao Paulo62070503***6304ED2F"
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "tkt-1",
    clientId: "cli-1",
    clientName: "Woody Pica-Pau",
    category: "Lentidão na Conexão",
    description: "Minha internet está batendo apenas 150 Mega por wifi, mas no cabo bate os 600 Mega contratados. Gostaria de uma verificação do sinal ou troca de canal do Roteador de 5GHz.",
    createdAt: "2026-06-05T14:32:00Z",
    status: "Em Atendimento",
    response: "Olá Woody, nosso sistema detectou saturação no canal 36 da sua rede de 5GHz. Agendamos uma alteração remota de canal. Favor verificar se a velocidade reestabeleceu."
  },
  {
    id: "tkt-2",
    clientId: "cli-2",
    clientName: "José da Silva Santos",
    category: "Dúvida no Financeiro",
    description: "Gostaria de saber se posso mudar o dia de vencimento da minha fatura do dia 12 para todo dia 20 de cada mês, pois recebo meu pagamento no dia 15.",
    createdAt: "2026-06-01T09:15:00Z",
    status: "Resolvido",
    response: "Prezado José, efetuamos a alteração de vencimento em nosso cadastro. A partir do próximo vencimento de Julho/2026, seu boleto vencerá no dia 20. A fatura de Junho ainda segue com vencimento para dia 12.",
    responseAt: "2026-06-02T16:00:00Z"
  }
];
