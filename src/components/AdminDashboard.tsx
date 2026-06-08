import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Users, 
  Megaphone, 
  CreditCard, 
  MessageSquare, 
  Plus, 
  Check, 
  Trash, 
  X, 
  ArrowLeft, 
  Unlock, 
  Save, 
  CheckCircle, 
  Zap, 
  AlertTriangle 
} from 'lucide-react';
import { 
  ISPConfig, 
  Announcement, 
  ClientProfile, 
  Invoice, 
  SupportTicket 
} from '../types';

interface AdminDashboardProps {
  config: ISPConfig;
  announcements: Announcement[];
  clients: ClientProfile[];
  invoices: Invoice[];
  tickets: SupportTicket[];
  onUpdateConfig: (config: ISPConfig) => void;
  onUpdateAnnouncements: (announcements: Announcement[]) => void;
  onAddClient: (newClient: ClientProfile) => void;
  onUpdateClientStatus: (clientId: string, status: ClientProfile['status']) => void;
  onAddInvoice: (newInvoice: Invoice) => void;
  onToggleInvoiceStatus: (invoiceId: string) => void;
  onResponseTicket: (ticketId: string, response: string, newStatus: SupportTicket['status']) => void;
  onBackToLanding: () => void;
}

export default function AdminDashboard({
  config,
  announcements,
  clients,
  invoices,
  tickets,
  onUpdateConfig,
  onUpdateAnnouncements,
  onAddClient,
  onUpdateClientStatus,
  onAddInvoice,
  onToggleInvoiceStatus,
  onResponseTicket,
  onBackToLanding
}: AdminDashboardProps) {

  // Authentication State
  const [passwordInput, setPasswordInput] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Admin Sub-tab: 'geral' | 'propagandas' | 'clientes' | 'faturas' | 'chamados'
  const [activeSubTab, setActiveSubTab] = useState<'geral' | 'propagandas' | 'clientes' | 'faturas' | 'chamados'>('geral');

  // Provider Settings Local Form
  const [provName, setProvName] = useState(config.providerName);
  const [provPhone, setProvPhone] = useState(config.providerPhone);
  const [provWhatsapp, setProvWhatsapp] = useState(config.whatsappNumber);
  const [provAddress, setProvAddress] = useState(config.address);
  const [provEmail, setProvEmail] = useState(config.supportEmail);
  const [provRibbonText, setProvRibbonText] = useState(config.announcementText);
  const [saveSuccess, setSaveSuccess] = useState('');

  // New Announcement Banner state
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnButton, setNewAnnButton] = useState('Saber mais');
  const [newAnnGradFrom, setNewAnnGradFrom] = useState('#3b82f6');
  const [newAnnGradTo, setNewAnnGradTo] = useState('#1e3a8a');
  const [showAnnForm, setShowAnnForm] = useState(false);

  // New Client state
  const [newCliName, setNewCliName] = useState('');
  const [newCliCpf, setNewCliCpf] = useState('');
  const [newCliPhone, setNewCliPhone] = useState('');
  const [newCliPlanName, setNewCliPlanName] = useState('Plano Fibra Pica-Pau Rápido');
  const [newCliPlanSpeed, setNewCliPlanSpeed] = useState(300);
  const [newCliValue, setNewCliValue] = useState(89.90);
  const [showClientForm, setShowClientForm] = useState(false);

  // New Invoice state
  const [selectedCliForInv, setSelectedCliForInv] = useState(clients[0]?.id || '');
  const [newInvMonth, setNewInvMonth] = useState('Julho/2026');
  const [newInvValue, setNewInvValue] = useState(89.90);
  const [newInvDueDate, setNewInvDueDate] = useState('2026-07-10');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  // Ticket Response state
  const [respondingTicketId, setRespondingTicketId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [ticketStatusTarget, setTicketStatusTarget] = useState<'Em Atendimento' | 'Resolvido'>('Resolvido');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (passwordInput === 'admin' || passwordInput.toLowerCase() === 'picapau') {
      setIsAdminAuthenticated(true);
    } else {
      setAuthError('Senha incorreta! Digite a senha padrão exposta no formulário.');
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      providerName: provName,
      providerPhone: provPhone,
      whatsappNumber: provWhatsapp,
      address: provAddress,
      supportEmail: provEmail,
      announcementText: provRibbonText,
      logoColor: "red"
    });
    setSaveSuccess('Configurações gerais atualizadas com sucesso! Clientes verão em tempo real.');
    setTimeout(() => setSaveSuccess(''), 4000);
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: newAnnTitle,
      content: newAnnContent,
      gradientFrom: newAnnGradFrom,
      gradientTo: newAnnGradTo,
      buttonText: newAnnButton,
      active: true
    };

    onUpdateAnnouncements([...announcements, newAnn]);
    setNewAnnTitle('');
    setNewAnnContent('');
    setShowAnnForm(false);
  };

  const handleToggleAnnActive = (id: string) => {
    const updated = announcements.map(ann => {
      if (ann.id === id) {
        return { ...ann, active: !ann.active };
      }
      return ann;
    });
    onUpdateAnnouncements(updated);
  };

  const handleDeleteAnn = (id: string) => {
    const updated = announcements.filter(ann => ann.id !== id);
    onUpdateAnnouncements(updated);
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCliName.trim() || !newCliCpf.trim()) return;

    const client: ClientProfile = {
      id: `cli-${Date.now()}`,
      name: newCliName,
      cpf: newCliCpf,
      phone: newCliPhone || '(11) 99999-9999',
      planName: newCliPlanName,
      planSpeed: Number(newCliPlanSpeed),
      monthlyValue: Number(newCliValue),
      status: 'Ativo',
      consumptionHistory: [
        { day: "Seg", gb: parseFloat((Math.random() * 20).toFixed(1)) },
        { day: "Ter", gb: parseFloat((Math.random() * 20).toFixed(1)) },
        { day: "Qua", gb: parseFloat((Math.random() * 20).toFixed(1)) },
        { day: "Qui", gb: parseFloat((Math.random() * 20).toFixed(1)) },
        { day: "Sex", gb: parseFloat((Math.random() * 30).toFixed(1)) },
        { day: "Sáb", gb: parseFloat((Math.random() * 45).toFixed(1)) },
        { day: "Dom", gb: parseFloat((Math.random() * 40).toFixed(1)) }
      ]
    };

    onAddClient(client);
    setNewCliName('');
    setNewCliCpf('');
    setNewCliPhone('');
    setShowClientForm(false);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const invoice: Invoice = {
      id: `inv-${Date.now()}`,
      clientId: selectedCliForInv,
      monthRef: newInvMonth,
      value: Number(newInvValue),
      dueDate: newInvDueDate,
      status: 'Pendente',
      pixKey: `00020101021226830014br.gov.bcb.pix2561api.picapaunetweaver.com.br/qr/v2/inv-${Date.now()}5204000053039865406${Number(newInvValue).toFixed(2)}5802BR5919PicaPauNetweaver6009Sao Paulo62070503***6304ED2F`
    };

    onAddInvoice(invoice);
    setShowInvoiceForm(false);
  };

  const submitTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondingTicketId || !ticketReplyText.trim()) return;

    onResponseTicket(respondingTicketId, ticketReplyText, ticketStatusTarget);
    setRespondingTicketId(null);
    setTicketReplyText('');
  };

  return (
    <div id="admin-view-root" className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Admin Specific Header */}
      <header className="bg-slate-950 text-white py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={onBackToLanding}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors border border-slate-850"
              title="Voltar para o site"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <span className="p-1 px-3 bg-indigo-600 text-[9px] font-bold rounded uppercase text-white tracking-widest animate-pulse border border-indigo-500">ADMIN</span>
              <div>
                <h2 className="text-base font-extrabold tracking-tight leading-none font-display">Central Back-office</h2>
                <p className="text-[9px] text-indigo-400 font-mono mt-1 uppercase tracking-wider">Painel Administrativo do Provedor</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onBackToLanding}
              className="text-xs bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white px-3.5 py-2 rounded-lg border border-slate-800 font-semibold transition-all shadow"
            >
              Visualizar Site Geral
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">

        {!isAdminAuthenticated ? (
          /* ADMIN PASSWORD CHECK SCREEN */
          <div className="max-w-md w-full mx-auto my-12">
            <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-900 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -mr-12 -mt-12 blur-xl"></div>
              
              <div className="text-center space-y-2 mb-8">
                <div className="inline-flex p-3 px-4 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-900/10 mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white font-display">Acesso Administrativo</h3>
                <p className="text-slate-400 text-xs sm:text-sm">Área exclusiva para proprietários de provedor e TI configurarem nome, telefone, planos, propagandas e responder chamados de suporte dos clientes.</p>
              </div>

              {authError && (
                <div className="mb-4 p-3 bg-amber-950/20 border border-amber-500/30 text-amber-400 rounded-xl text-xs flex gap-2">
                  <span className="font-bold">Erro:</span>
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] tracking-widest font-mono text-slate-500 uppercase font-bold mb-1.5">Insira a Senha Mestra do Provedor</label>
                  <input
                    type="password"
                    required
                    placeholder="Senha de Acesso Comercial"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-1.5 font-mono">Senha padrão sugerida: <strong className="text-slate-400 font-bold">admin</strong></p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl text-xs font-display uppercase tracking-wider shadow"
                  >
                    Confirmar Senha
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordInput('admin');
                      setIsAdminAuthenticated(true);
                    }}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white font-bold rounded-xl text-[10px] uppercase font-mono tracking-wider transition-colors border border-slate-850"
                  >
                    ⚡ Atalho Rápido Demo: Entrar como Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN CONSOLE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 bg-slate-950 border border-slate-900 rounded-3xl p-4 shadow-xl space-y-2">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 mb-2 font-mono">Painéis Comerciais</p>
              
              <button
                onClick={() => setActiveSubTab('geral')}
                className={`w-full p-2.5 px-4 rounded-xl flex items-center gap-2.5 text-xs font-bold transition-all font-display ${activeSubTab === 'geral' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
              >
                <Settings className="w-4 h-4 text-indigo-400" />
                <span>Dados do Provedor</span>
              </button>

              <button
                onClick={() => setActiveSubTab('propagandas')}
                className={`w-full p-2.5 px-4 rounded-xl flex items-center gap-2.5 text-xs font-bold transition-all font-display ${activeSubTab === 'propagandas' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
              >
                <Megaphone className="w-4 h-4 text-indigo-400" />
                <span>Banners & Propaganda</span>
              </button>

              <button
                onClick={() => setActiveSubTab('clientes')}
                className={`w-full p-2.5 px-4 rounded-xl flex items-center gap-2.5 text-xs font-bold transition-all font-display ${activeSubTab === 'clientes' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
              >
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Gerenciar Clientes</span>
              </button>

              <button
                onClick={() => setActiveSubTab('faturas')}
                className={`w-full p-2.5 px-4 rounded-xl flex items-center gap-2.5 text-xs font-bold transition-all font-display ${activeSubTab === 'faturas' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
              >
                <CreditCard className="w-4 h-4 text-indigo-400" />
                <span>Controle de Cobranças</span>
              </button>

              <button
                onClick={() => setActiveSubTab('chamados')}
                className={`w-full p-2.5 px-4 rounded-xl flex items-center justify-between text-xs font-bold transition-all font-display ${activeSubTab === 'chamados' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Suporte & Chamados</span>
                </div>
                {tickets.filter(t => t.status === 'Aberto').length > 0 && (
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${activeSubTab === 'chamados' ? 'bg-white text-indigo-700' : 'bg-indigo-500 text-white'}`}>
                    {tickets.filter(t => t.status === 'Aberto').length}
                  </span>
                )}
              </button>

              <div className="pt-6 border-t border-slate-900 mt-6 text-center">
                <button
                  onClick={() => setIsAdminAuthenticated(false)}
                  className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-wider font-mono"
                >
                  Bloquear Painel Mestre
                </button>
              </div>
            </div>

            {/* Sub-tab Content Area */}
            <div className="lg:col-span-9 bg-slate-950 border border-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl">
              
              {/* 1. PROVIDER GENERAL SETTINGS */}
              {activeSubTab === 'geral' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white border-b border-slate-900 pb-2 font-display">Configurar Informações do Provedor de Internet</h3>
                    <p className="text-xs text-slate-450 mt-1">Mude o nome do provedor, contatos telefônicos de WhatsApp, endereço da sede e a fita de propagandas no topo.</p>
                  </div>

                  {saveSuccess && (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                      <span>{saveSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Nome Fantasia do Provedor</label>
                      <input
                        type="text"
                        required
                        value={provName}
                        onChange={(e) => setProvName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Telefone Principal de Suporte</label>
                      <input
                        type="text"
                        required
                        value={provPhone}
                        onChange={(e) => setProvPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Número de Redirecionamento WhatsApp</label>
                      <input
                        type="text"
                        required
                        value={provWhatsapp}
                        onChange={(e) => setProvWhatsapp(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">E-mail Comercial de Contato</label>
                      <input
                        type="email"
                        required
                        value={provEmail}
                        onChange={(e) => setProvEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
                       <label className="block text-xs font-semibold text-slate-400 mb-1">Endereço de Postagem / Matriz Provedor</label>
                       <input
                         type="text"
                         required
                         value={provAddress}
                         onChange={(e) => setProvAddress(e.target.value)}
                         className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Fita do Alerta Superior de Promoção (Ribbon)</label>
                      <textarea
                        rows={2}
                        value={provRibbonText}
                        onChange={(e) => setProvRibbonText(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-500 resize-none"
                      />
                    </div>

                    <div className="md:col-span-2 pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Salvar Todas Alterações Ativas</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 2. PROMO ANNOUNCEMENTS WRITER */}
              {activeSubTab === 'propagandas' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Banners de Propaganda e Cadastro</h3>
                      <p className="text-xs text-slate-500 mt-1">Crie propagandas rápidas de upgrade ou descontos que deslizam no site do cliente.</p>
                    </div>
                    <button
                      onClick={() => setShowAnnForm(!showAnnForm)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg flex items-center gap-1"
                    >
                      {showAnnForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{showAnnForm ? 'Cancelar' : 'Nova Propaganda'}</span>
                    </button>
                  </div>

                  {showAnnForm && (
                    <form onSubmit={handleAddAnnouncement} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Título do Banner</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Super Desconto no Pix!"
                          value={newAnnTitle}
                          onChange={(e) => setNewAnnTitle(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Ação do Botão</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Quero Desconto / Cadastrar"
                          value={newAnnButton}
                          onChange={(e) => setNewAnnButton(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mensagem Comercial / Conteúdo</label>
                        <textarea
                          required
                          rows={2}
                          placeholder="Descrição rápida da promoção..."
                          value={newAnnContent}
                          onChange={(e) => setNewAnnContent(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-red-500 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Cor Inicial do Degradê</label>
                        <select
                          value={newAnnGradFrom}
                          onChange={(e) => setNewAnnGradFrom(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none"
                        >
                          <option value="#ef4444">Vermelho Pica-Pau</option>
                          <option value="#3b82f6">Azul Fibra</option>
                          <option value="#10b981">Esmeralda Limpo</option>
                          <option value="#8b5cf6">Roxo Gamer</option>
                          <option value="#334155">Carbono Escuro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Cor Final do Degradê</label>
                        <select
                          value={newAnnGradTo}
                          onChange={(e) => setNewAnnGradTo(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none"
                        >
                          <option value="#f97316">Laranja Quente</option>
                          <option value="#06b6d4">Ciano Claro</option>
                          <option value="#84cc16">Lima Brilhante</option>
                          <option value="#ec4899">Pink Moderno</option>
                          <option value="#1e293b">Slate Escuro</option>
                        </select>
                      </div>

                      <div className="md:col-span-2 pt-1">
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm"
                        >
                          <span>Inserir Banner na Home</span>
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-3 pt-2">
                    {announcements.map(ann => (
                      <div 
                        key={ann.id}
                        className="border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{ann.title}</h4>
                            <span 
                              className="w-3.5 h-3.5 rounded-full inline-block"
                              style={{ background: `linear-gradient(to right, ${ann.gradientFrom}, ${ann.gradientTo})` }}
                              title="Cor de Fundo"
                            ></span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{ann.content}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Texto Botão: "{ann.buttonText}"</p>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => handleToggleAnnActive(ann.id)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg border ${ann.active ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-200 border-slate-300 text-slate-600'}`}
                          >
                            {ann.active ? 'Ativo na Web' : 'Pausado'}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteAnn(ann.id)}
                            className="p-1 px-2 border border-red-200 text-red-650 rounded-lg hover:bg-red-50 transition-colors"
                            title="Deletar Propaganda"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* 3. CLIENT MANAGEMENT */}
              {activeSubTab === 'clientes' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Assinantes do Sistema</h3>
                      <p className="text-xs text-slate-500 mt-1">Cadastro mestre de clientes, alteração de status operacional de banda larga ou de dados.</p>
                    </div>
                    <button
                      onClick={() => setShowClientForm(!showClientForm)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg flex items-center gap-1"
                    >
                      {showClientForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{showClientForm ? 'Cancelar' : 'Novo Assinante'}</span>
                    </button>
                  </div>

                  {showClientForm && (
                    <form onSubmit={handleCreateClient} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo do Cliente</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: João da Silva"
                          value={newCliName}
                          onChange={(e) => setNewCliName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">CPF (Necessário para Login do Cliente)</label>
                        <input
                          type="text"
                          required
                          placeholder="123.456.789-00 ou só dígitos"
                          value={newCliCpf}
                          onChange={(e) => setNewCliCpf(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-red-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone Celular</label>
                        <input
                          type="text"
                          placeholder="(11) 99999-9999"
                          value={newCliPhone}
                          onChange={(e) => setNewCliPhone(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Plano Contratado</label>
                        <input
                          type="text"
                          required
                          value={newCliPlanName}
                          onChange={(e) => setNewCliPlanName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Velocidade Contratada (Mega)</label>
                        <input
                          type="number"
                          required
                          value={newCliPlanSpeed}
                          onChange={(e) => setNewCliPlanSpeed(Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-red-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Valor Mensal (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={newCliValue}
                          onChange={(e) => setNewCliValue(Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-red-500 font-mono"
                        />
                      </div>

                      <div className="md:col-span-2 pt-1 border-t border-slate-200/60 mt-2">
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm"
                        >
                          <span>Salvar & Cadastrar Assinante</span>
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-3 pt-2">
                    {clients.map(cli => (
                      <div 
                        key={cli.id}
                        className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:border-slate-300"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">{cli.name}</h4>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${cli.status === 'Ativo' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                              {cli.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">Plano: {cli.planName} ({cli.planSpeed} Mbps) - R$ {cli.monthlyValue.toFixed(2)}/mês</p>
                          <p className="text-[10px] text-slate-400 font-mono">CPF para Login: {cli.cpf} • Celular: {cli.phone}</p>
                        </div>

                        {/* Client Status actions */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <label className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Operação:</label>
                          <select
                            value={cli.status}
                            onChange={(e) => onUpdateClientStatus(cli.id, e.target.value as ClientProfile['status'])}
                            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700"
                          >
                            <option value="Ativo">Ativar Sinal 🟢</option>
                            <option value="Suspenso">Suspender Operação 🟡</option>
                            <option value="Bloqueado">Bloqueio Financeiro 🔴</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* 4. BILLS CONTROLLER */}
              {activeSubTab === 'faturas' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Central de Faturamento e Lançamentos</h3>
                      <p className="text-xs text-slate-500 mt-1">Lance mensalidades ou faturas extraordinárias de Pix para qualquer cliente e acompanhe o recebimento.</p>
                    </div>
                    <button
                      onClick={() => setShowInvoiceForm(!showInvoiceForm)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg flex items-center gap-1"
                    >
                      {showInvoiceForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{showInvoiceForm ? 'Cancelar' : 'Lançar Nova Fatura'}</span>
                    </button>
                  </div>

                  {showInvoiceForm && (
                    <form onSubmit={handleCreateInvoice} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Selecione o Cliente Payer</label>
                        <select
                          value={selectedCliForInv}
                          onChange={(e) => {
                            setSelectedCliForInv(e.target.value);
                            // Auto fill plan cost
                            const found = clients.find(c => c.id === e.target.value);
                            if (found) {
                              setNewInvValue(found.monthlyValue);
                            }
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                        >
                          {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.name} (Plan Cost: R$ {c.monthlyValue.toFixed(2)})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mês de Referência</label>
                        <input
                          type="text"
                          required
                          value={newInvMonth}
                          onChange={(e) => setNewInvMonth(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Valor do Lançamento (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={newInvValue}
                          onChange={(e) => setNewInvValue(Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Data Limite de Vencimento</label>
                        <input
                          type="date"
                          required
                          value={newInvDueDate}
                          onChange={(e) => setNewInvDueDate(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none font-mono"
                        />
                      </div>

                      <div className="md:col-span-2 pt-1">
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm"
                        >
                          <span>Lançar Fatura Pix Pendente</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of general invoices */}
                  <div className="space-y-2.5">
                    {invoices.map(invoice => {
                      const clientOwner = clients.find(c => c.id === invoice.clientId);
                      return (
                        <div 
                          key={invoice.id}
                          className="border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-900">{clientOwner ? clientOwner.name : 'Unknown Client'}</p>
                            <p className="text-[11px] text-slate-500">Mês: {invoice.monthRef} • Vencimento: <span className="font-mono">{invoice.dueDate.split('-').reverse().join('/')}</span></p>
                            <p className="text-[10px] text-slate-400 font-mono">Fat ID: {invoice.id} • Valor: R$ {invoice.value.toFixed(2)}</p>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${invoice.status === 'Pago' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-yellow-50 text-yellow-850 border border-yellow-100'}`}>
                              {invoice.status}
                            </span>
                            
                            <button
                              onClick={() => {
                                onToggleInvoiceStatus(invoice.id);
                              }}
                              className={`px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-[10px] font-bold rounded-lg transition-colors`}
                            >
                              {invoice.status === 'Pago' ? 'Marcar Pendente' : 'Confirmar Pix ✓'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* 5. USER SUPPORT CHATS MANAGER tickets */}
              {activeSubTab === 'chamados' && (
                <div className="space-y-6 border-slate-200">
                  <div>
                    <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">Central Atendimento ao Assinante ({tickets.length} chamados)</h3>
                    <p className="text-xs text-slate-500 mt-1">Analise reclamações abertas de lentidão de sinal, mude status e escreva respostas de suporte técnico aos usuários.</p>
                  </div>

                  <div className="space-y-4">
                    {tickets.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl text-xs font-semibold">
                        Sem chamados ou reclamações registradas no momento. Excelente!
                      </div>
                    ) : (
                      tickets.map(tkt => (
                        <div 
                          key={tkt.id}
                          className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3 relative transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-slate-900 text-xs sm:text-sm">{tkt.clientName}</span>
                              <p className="text-[10px] text-slate-400 mt-0.5">Chamado registrado: <span className="font-mono">{new Date(tkt.createdAt).toLocaleString('pt-BR')}</span></p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase ${tkt.status === 'Resolvido' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800 animate-pulse'}`}>
                              {tkt.status}
                            </span>
                          </div>

                          <div className="p-3 bg-white border border-slate-200/60 rounded-xl">
                            <span className="text-[9px] font-black uppercase text-red-500 font-mono bg-red-50 px-1.5 py-0.5 rounded inline-block mb-1">{tkt.category}</span>
                            <p className="text-slate-850 text-[11px] sm:text-xs leading-relaxed">{tkt.description}</p>
                          </div>

                          {tkt.response && (
                            <div className="p-3 bg-slate-150 border border-slate-200 rounded-xl space-y-0.5">
                              <p className="font-bold text-slate-700 text-[11px]">Sua resposta técnica:</p>
                              <p className="text-slate-600 text-[11px] leading-relaxed italic">{tkt.response}</p>
                            </div>
                          )}

                          {/* Write prompt reply */}
                          {respondingTicketId === tkt.id ? (
                            <form onSubmit={submitTicketReply} className="pt-3 border-t border-slate-200/50 space-y-3 animate-in slide-in-from-top-2 duration-200">
                              <div>
                                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Escreva a resposta para o cliente:</label>
                                <textarea
                                  required
                                  rows={3}
                                  placeholder="Digite orientações técnicas de canal, sinal ou liberação de fatura..."
                                  value={ticketReplyText}
                                  onChange={(e) => setTicketReplyText(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none"
                                />
                              </div>

                              <div className="flex gap-2">
                                <span className="text-[10px] font-bold text-slate-500 inline-flex items-center shrink-0">Novo Status:</span>
                                <select
                                  value={ticketStatusTarget}
                                  onChange={(e) => setTicketStatusTarget(e.target.value as any)}
                                  className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[11px]"
                                >
                                  <option value="Em Atendimento">Em Atendimento 🔵</option>
                                  <option value="Resolvido">Resolvido e Fechar Chamado 🟢</option>
                                </select>
                              </div>

                              <div className="flex gap-2 justify-end">
                                <button
                                  type="button"
                                  onClick={() => setRespondingTicketId(null)}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs"
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="submit"
                                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
                                >
                                  Enviar Resposta
                                </button>
                              </div>
                            </form>
                          ) : (
                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() => {
                                  setRespondingTicketId(tkt.id);
                                  setTicketReplyText(tkt.response || '');
                                }}
                                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[11px] flex items-center gap-1"
                              >
                                {tkt.response ? 'Mudar Resposta' : 'Responder e Atender'}
                              </button>
                            </div>
                          )}

                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}
      </main>

    </div>
  );
}
