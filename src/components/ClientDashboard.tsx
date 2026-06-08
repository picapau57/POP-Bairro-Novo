import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  CreditCard, 
  MessageSquare, 
  User, 
  Signpost, 
  LogOut, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  Download, 
  ChevronRight, 
  Clock, 
  ArrowLeft, 
  ExternalLink,
  Lock,
  Play,
  RotateCw,
  Send,
  Zap,
  Activity
} from 'lucide-react';
import { 
  ClientProfile, 
  Invoice, 
  SupportTicket, 
  ISPConfig, 
  Announcement 
} from '../types';

interface ClientDashboardProps {
  config: ISPConfig;
  clients: ClientProfile[];
  invoices: Invoice[];
  tickets: SupportTicket[];
  onAddTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => void;
  onPayInvoice: (invoiceId: string) => void;
  onLogout: () => void;
  onBackToLanding: () => void;
}

export default function ClientDashboard({
  config,
  clients,
  invoices,
  tickets,
  onAddTicket,
  onPayInvoice,
  onLogout,
  onBackToLanding
}: ClientDashboardProps) {
  
  // Login State
  const [cpfInput, setCpfInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggedInClient, setLoggedInClient] = useState<ClientProfile | null>(null);

  // Tabs for client panel: 'dashboard' | 'faturas' | 'suporte'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'faturas' | 'suporte'>('dashboard');

  // Support Form
  const [tktCategory, setTktCategory] = useState('Lentidão de Sinal');
  const [tktDescription, setTktDescription] = useState('');
  const [tktSuccess, setTktSuccess] = useState('');

  // Invoice Payment Modal state
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Speed Test Simulation state
  const [isTestingSpeed, setIsTestingSpeed] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [speedResultDb, setSpeedResultDb] = useState<{ download: number; upload: number; ping: number } | null>(null);

  // Print Invoice state (for mock PDF)
  const [printInvoiceData, setPrintInvoiceData] = useState<Invoice | null>(null);

  // Check temporary quick login from landing page config
  useEffect(() => {
    const tempCpf = localStorage.getItem('__temp_login_cpf');
    if (tempCpf) {
      const match = clients.find(c => c.cpf === tempCpf);
      if (match) {
        setLoggedInClient(match);
        setCpfInput(tempCpf);
      }
      localStorage.removeItem('__temp_login_cpf');
    }
  }, [clients]);

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    // Simple verification
    const cleanedInput = cpfInput.trim();
    if (!cleanedInput) {
      setLoginError('Por favor, informe seu CPF cadastrado.');
      return;
    }

    const found = clients.find(c => c.cpf.replace(/\D/g, '') === cleanedInput.replace(/\D/g, ''));
    if (found) {
      setLoggedInClient(found);
    } else {
      setLoginError('CPF não encontrado. Tente os CPFs de exemplo listados na base!');
    }
  };

  // Safe client state fetch (since client may be updated by provider in parent state)
  const currentClient = loggedInClient 
    ? (clients.find(c => c.id === loggedInClient.id) || loggedInClient) 
    : null;

  // Filter lists for current client
  const clientInvoices = currentClient 
    ? invoices.filter(i => i.clientId === currentClient.id).sort((a,b) => b.dueDate.localeCompare(a.dueDate))
    : [];

  const clientTickets = currentClient 
    ? tickets.filter(t => t.clientId === currentClient.id).sort((a,b) => b.createdAt.localeCompare(a.createdAt))
    : [];

  const handleCopyPix = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleConfirmPixPayment = (invoiceId: string) => {
    setPaymentSuccess(true);
    setTimeout(() => {
      onPayInvoice(invoiceId);
      setPaymentSuccess(false);
      setSelectedInvoice(null);
    }, 2000);
  };

  const handleOpenTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient || !tktDescription.trim()) return;

    onAddTicket({
      clientId: currentClient.id,
      clientName: currentClient.name,
      category: tktCategory,
      description: tktDescription,
    });

    setTktDescription('');
    setTktSuccess('Reclamação/Suporte registrado com sucesso! Nossa equipe técnica já está analisando.');
    setTimeout(() => setTktSuccess(''), 4000);
  };

  // Speed Test Simulator logic
  const startSpeedTest = () => {
    setIsTestingSpeed(true);
    setTestProgress(0);
    setSpeedResultDb(null);
    
    const interval = setInterval(() => {
      setTestProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTestingSpeed(false);
          // Set mock speeds around plan speed
          const targetSpeed = currentClient?.planSpeed || 300;
          const varianceDownload = parseFloat((targetSpeed * (0.95 + Math.random() * 0.1)).toFixed(1));
          const varianceUpload = parseFloat(((targetSpeed / 2) * (0.9 + Math.random() * 0.15)).toFixed(1));
          const pingResult = Math.floor(2 + Math.random() * 8);

          setSpeedResultDb({
            download: varianceDownload,
            upload: varianceUpload,
            ping: pingResult
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Helper calculation for total data downloaded
  const currentWeekGbTotal = currentClient?.consumptionHistory.reduce((sum, item) => sum + item.gb, 0).toFixed(1) || '0';

  return (
    <div id="client-view-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Client Specific Header */}
      <header className="bg-slate-950 border-b border-slate-900 py-3.5 sm:py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <button 
              onClick={onBackToLanding}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors border border-slate-850"
              title="Voltar para o site"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="p-1 px-3 bg-blue-600 text-[9px] font-bold rounded uppercase tracking-wider text-white animate-pulse">CLIENTE</span>
              <h2 className="text-lg font-extrabold tracking-tight text-white font-display">{config.providerName}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentClient ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-300">Olá, <span className="text-white">{currentClient.name}</span></p>
                  <p className="text-[10px] text-slate-500 font-mono">CPF: {currentClient.cpf}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-blue-400 font-display">
                  {currentClient.name.charAt(0)}
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={onBackToLanding}
                className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                Voltar para Home
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        
        {!currentClient ? (
          /* LOGIN SCREEN */
          <div className="max-w-md w-full mx-auto my-8">
            <div className="bg-slate-950 rounded-3xl border border-slate-900 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-12 -mt-12 blur-xl"></div>
              
              <div className="text-center space-y-2 mb-8">
                <div className="inline-flex p-3.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl shadow-blue-900/10 mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white font-display">Central do Assinante</h3>
                <p className="text-slate-400 text-xs sm:text-sm">Consulte suas faturas, visualize seu consumo de rede e mude suas configurações rapidinho.</p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-red-950/20 border border-red-500/30 text-red-400 rounded-xl text-xs flex gap-2 items-start">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold mb-1.5">Informe seu CPF cadastrado</label>
                  <input
                    type="text"
                    required
                    placeholder="000.000.000-00 ou só números"
                    value={cpfInput}
                    onChange={(e) => setCpfInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 text-xs font-display uppercase tracking-wider"
                >
                  Entrar no Portal
                </button>
              </form>

              <div className="mt-8 border-t border-slate-900 pt-6">
                <p className="text-[10px] text-slate-450 font-bold mb-3 uppercase tracking-wider text-center font-mono">Contas de Teste disponíveis (Clique para logar):</p>
                <div id="demo-quick-login-list" className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {clients.map(cli => (
                    <button
                      key={cli.id}
                      onClick={() => {
                        setCpfInput(cli.cpf);
                        setLoggedInClient(cli);
                      }}
                      className="w-full text-left bg-slate-900 hover:bg-slate-850 p-2.5 rounded-xl border border-slate-850 transition-all flex items-center justify-between text-xs group"
                    >
                      <div>
                        <p className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors flex items-center gap-1.5 font-display text-sm">
                          <User className="w-3.5 h-3.5 text-blue-400" />
                          {cli.name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">CPF: <span className="font-mono font-medium text-slate-300">{cli.cpf}</span></p>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 bg-slate-950 rounded text-slate-400 group-hover:text-white transition-colors">Entrar</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <p className="text-center text-[10px] text-slate-500 mt-4 leading-relaxed">
              Esqueceu as credenciais de acesso ou deseja mudar? Contate o provedor em <span className="text-slate-300 font-semibold">{config.providerPhone}</span> ou peça alteração ao administrador.
            </p>
          </div>
        ) : (
          /* LOGGED IN CLIENT PORTAL */
          <div className="space-y-6">
            
            {/* Network Notification (if client is blocked) */}
            {currentClient.status !== 'Ativo' && (
              <div className="p-4 bg-amber-950/80 border border-amber-600/40 text-amber-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex gap-3 items-start text-center sm:text-left">
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mx-auto sm:mx-0" />
                  <div>
                    <h4 className="font-black text-sm">ALERTA FINANCEIRO: CONEXÃO COM RESTRIÇÃO ({currentClient.status.toUpperCase()})</h4>
                    <p className="text-xs text-amber-300/95 mt-0.5">O sinal do seu cabo óptico está programado para bloqueio por faturas pendentes. Efetue o pagamento via Pix para restabelecer imediatamente.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('faturas');
                    // auto select pending invoices if available
                    const firstUnpaid = clientInvoices.find(i => i.status !== 'Pago');
                    if (firstUnpaid) {
                      setSelectedInvoice(firstUnpaid);
                    }
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow transition-colors"
                >
                  Ver Faturas em Atraso
                </button>
              </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="bg-slate-950 border border-slate-900 p-4 rounded-3xl flex items-center gap-3">
                <span className="p-2 w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-900/10">
                  <Wifi className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-[10px] tracking-widest uppercase font-mono text-slate-500 font-bold">Meu Plano</p>
                  <p className="text-xs font-bold truncate text-white">{currentClient.planSpeed} Mbps</p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-900 p-4 rounded-3xl flex items-center gap-3">
                <span className="p-2 w-10 h-10 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">
                  Kb
                </span>
                <div>
                  <p className="text-[10px] tracking-widest uppercase font-mono text-slate-500 font-bold">Sinal Óptico</p>
                  <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                    Excelente
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-900 p-4 rounded-3xl flex items-center gap-3">
                <span className="p-2 w-10 h-10 rounded-2xl bg-slate-900 text-slate-300 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-[10px] tracking-widest uppercase font-mono text-slate-500 font-bold">Consumo Semanal</p>
                  <p className="text-xs font-bold text-white">{currentWeekGbTotal} GB</p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-900 p-4 rounded-3xl flex items-center gap-3">
                <span className="p-2 w-10 h-10 rounded-2xl bg-slate-900 text-slate-300 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-[10px] tracking-widest uppercase font-mono text-slate-500 font-bold">Faturas Pendentes</p>
                  <p className={`text-xs font-bold ${clientInvoices.filter(i => i.status !== 'Pago').length > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {clientInvoices.filter(i => i.status !== 'Pago').length} Faturas
                  </p>
                </div>
              </div>

            </div>

            {/* Navigation tabs inside the client area */}
            <div className="flex border-b border-slate-900 gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-3 px-5 font-bold text-xs uppercase tracking-wider relative transition-colors font-display ${activeTab === 'dashboard' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-205'}`}
              >
                <span>Painel e Consumo</span>
                {activeTab === 'dashboard' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('faturas')}
                className={`py-3 px-5 font-bold text-xs uppercase tracking-wider relative transition-colors font-display ${activeTab === 'faturas' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-205'}`}
              >
                <span>Faturas & Pix ({clientInvoices.length})</span>
                {activeTab === 'faturas' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('suporte')}
                className={`py-3 px-5 font-bold text-xs uppercase tracking-wider relative transition-colors font-display ${activeTab === 'suporte' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-205'}`}
              >
                <span>Ajuda & Suporte</span>
                {activeTab === 'suporte' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>
                )}
              </button>
            </div>

            {/* TAB CONTENT */}

            {/* 1. DASHBOARD & INTERACTIVE SPEEDTEST */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visualizer Chart */}
                <div className="lg:col-span-8 bg-slate-950 border border-slate-900 rounded-3xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-white font-display">Meu Tráfego na Internet</h3>
                      <p className="text-[11px] text-slate-500">Total medido pelo roteador em Gigabytes (Últimos 7 dias)</p>
                    </div>
                    <span className="text-[10px] font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded font-semibold">Consumo Ativo</span>
                  </div>

                  {/* HTML/SVG custom chart */}
                  <div className="pt-4">
                    <div className="h-44 w-full flex items-end gap-3 px-2 border-b border-slate-900 pb-2 relative">
                      {currentClient.consumptionHistory.map((item, idx) => {
                        // Max GB found in data for percentage height
                        const maxGb = Math.max(...currentClient.consumptionHistory.map(h => h.gb), 1);
                        const pctHeight = (item.gb / maxGb) * 100;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group relative">
                            {/* Value bubble on hover */}
                            <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap border border-slate-800 font-mono">
                              {item.gb} GB
                            </div>
                            
                            {/* Bar */}
                            <div 
                              style={{ height: `${pctHeight}%` }}
                              className="w-full bg-gradient-to-t from-blue-600/40 via-blue-500 to-indigo-500 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                            ></div>
                            
                            {/* Day Text */}
                            <span className="text-[8px] sm:text-[10px] font-semibold text-slate-500 truncate w-full text-center font-mono">{item.day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                    <div className="bg-slate-900 border border-slate-850 p-3 rounded-2xl">
                      <p className="text-slate-400">Franquia de Dados</p>
                      <p className="text-white font-bold text-sm mt-0.5 font-display">Sem Limite / Ilimitada</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Use sem preocupações com bloqueios</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-850 p-3 rounded-2xl">
                      <p className="text-slate-400">Total Consumido (Período)</p>
                      <p className="text-white font-bold text-sm mt-0.5 font-display">{currentWeekGbTotal} GB</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Aproximadamente {((parseFloat(currentWeekGbTotal)*1000)/7).toFixed(0)} MB/dia</p>
                    </div>
                  </div>
                </div>

                {/* Simulated Speed Test Meter Widget */}
                <div className="lg:col-span-4 bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-900 rounded-3xl p-5 sm:p-6 space-y-6 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white flex items-center gap-1.5 font-display">
                      <Activity className="w-4 h-4 text-blue-500" />
                      Medidor {config.providerName}
                    </h4>
                    <p className="text-[11px] text-slate-405">Certifique-se de estar próximo ao roteador ou no cabo.</p>
                  </div>

                  {/* The Interactive Speed Dial */}
                  <div className="flex flex-col items-center justify-center py-4 relative">
                    <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center p-3 relative overflow-hidden">
                      {isTestingSpeed ? (
                        <>
                          <RotateCw className="w-8 h-8 text-yellow-400 animate-spin" />
                          <p className="text-[10px] text-slate-400 mt-2 font-mono font-bold">{testProgress}%</p>
                          <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Medindo...</p>
                        </>
                      ) : speedResultDb ? (
                        <>
                          <Zap className="w-5 h-5 text-emerald-400 animate-bounce" />
                          <p className="text-lg font-black text-white leading-none mt-1">{speedResultDb.download}</p>
                          <p className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">Mbps Down</p>
                          <span className="text-[8px] text-slate-500 font-mono">Ping: {speedResultDb.ping}ms</span>
                        </>
                      ) : (
                        <>
                          <Wifi className="w-8 h-8 text-slate-600" />
                          <p className="text-[10px] text-slate-400 mt-2 text-center leading-tight">Medidor pronto para testar</p>
                        </>
                      )}

                      {/* Moving pulse background when testing */}
                      {isTestingSpeed && (
                        <div className="absolute inset-0 bg-red-600/10 animate-ping rounded-full pointer-events-none"></div>
                      )}
                    </div>

                    {speedResultDb && (
                      <div className="grid grid-cols-2 gap-4 w-full text-center mt-4">
                        <div className="bg-slate-900/80 p-2 rounded-xl">
                          <p className="text-[10px] text-slate-400">Download</p>
                          <p className="text-xs font-bold text-emerald-400">{speedResultDb.download} Mbps</p>
                        </div>
                        <div className="bg-slate-900/80 p-2 rounded-xl">
                          <p className="text-[10px] text-slate-400">Upload</p>
                          <p className="text-xs font-bold text-yellow-400">{speedResultDb.upload} Mbps</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={startSpeedTest}
                    disabled={isTestingSpeed}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 disabled:bg-slate-800 disabled:text-slate-600 text-xs text-white font-bold rounded-xl flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
                  >
                    {isTestingSpeed ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Espere o Teste Terminar...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Iniciar Teste de Velocidade</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

            {/* 2. INVOICES & PIX PAYMENT SIMULATION */}
            {activeTab === 'faturas' && (
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
                <div>
                  <h3 className="text-base font-black text-white">Minhas Faturas</h3>
                  <p className="text-xs text-slate-400">Confira as faturas pagas e pendentes de Pix. Evite bloqueio de sinal efetuando o Pix copia-e-cola.</p>
                </div>

                <div className="space-y-3 pt-2">
                  {clientInvoices.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 bg-slate-900 rounded-2xl font-semibold">
                      Nenhuma fatura localizada para esta conta comercial.
                    </div>
                  ) : (
                    clientInvoices.map(invoice => (
                      <div 
                        key={invoice.id}
                        className="bg-slate-900 border border-slate-850 hover:border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                          <div className={`p-3 rounded-xl shrink-0 ${invoice.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-400' : invoice.status === 'Atrasado' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-500'}`}>
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">Fatura {invoice.monthRef}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Identificador Unico: {invoice.id} • Vencimento: <span className="font-mono">{invoice.dueDate.split('-').reverse().join('/')}</span></p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto text-center sm:text-right">
                          <div>
                            <p className="text-sm font-black text-white">R$ {invoice.value.toFixed(2).replace('.', ',')}</p>
                            <span className={`inline-block text-[9px] font-bold uppercase px-2.5 py-0.5 rounded mt-1.5 ${invoice.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : invoice.status === 'Atrasado' ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                              {invoice.status} {invoice.paidAt && `(Em ${invoice.paidAt.split('-').reverse().join('/')})`}
                            </span>
                          </div>

                          <div className="flex gap-2 w-full sm:w-auto">
                            {invoice.status !== 'Pago' ? (
                              <button
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                }}
                                className="flex-1 sm:flex-initial px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors whitespace-nowrap"
                              >
                                Pagar com Pix
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setPrintInvoiceData(invoice);
                                }}
                                className="flex-1 sm:flex-initial px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Ver Comprovante</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setPrintInvoiceData(invoice);
                              }}
                              className="px-3 py-2 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-colors"
                              title="Visualizar Recibo detalhado"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 3. HELP & SUPPORT TICKET CONSTRUCTOR */}
            {activeTab === 'suporte' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Submit Form */}
                <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-white">Abrir Suporte ou Reclamação</h3>
                    <p className="text-[11px] text-slate-400">Escreva reclamações técnicas ou tire dúvidas contratuais diretamente com nossa equipe de suporte.</p>
                  </div>

                  {tktSuccess && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{tktSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleOpenTicket} className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Qual o motivo principal?</label>
                      <select
                        value={tktCategory}
                        onChange={(e) => setTktCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="Lentidão de Sinal">Lentidão na Conexão</option>
                        <option value="Sem Conexão ou Fora do Ar">Internet Caiu (Sem Conexão)</option>
                        <option value="Problemas Financeiros">Problemas com Boleto / Financeiro</option>
                        <option value="Alterar Endereço / Plano">Trocar de Plano ou Mudança de Endereço</option>
                        <option value="Fazer Reclamação Formal">Efetuar uma Reclamação Formal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Descreva com detalhes o ocorrido</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Ex: Desde ontem à noite, a luz 'LOS' do roteador está piscando em vermelho e o sinal sumiu por completo..."
                        value={tktDescription}
                        onChange={(e) => setTktDescription(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Solicitação Técnico</span>
                    </button>
                  </form>
                </div>

                {/* Ticket List History */}
                <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-black text-white">Histórico de Chamados</h3>
                      <p className="text-[11px] text-slate-400">Linha do tempo de atendimentos gerados por esta conta</p>
                    </div>
                    <span className="text-xs bg-slate-900 text-slate-400 px-2.5 py-1 rounded border border-slate-800">{clientTickets.length} Atendimentos</span>
                  </div>

                  <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                    {clientTickets.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 font-semibold bg-slate-900 rounded-2xl text-xs">
                        Nenhum atendimento gerado ainda. Se precisar de assistência, use o formulário ao lado!
                      </div>
                    ) : (
                      clientTickets.map(tkt => (
                        <div 
                          key={tkt.id}
                          className="bg-slate-900 border border-slate-850 p-4 rounded-2xl space-y-3 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold uppercase bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono text-[9px]">ID: {tkt.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${tkt.status === 'Resolvido' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400 animate-pulse'}`}>
                              {tkt.status}
                            </span>
                          </div>

                          <div>
                            <p className="font-extrabold text-slate-300">{tkt.category}</p>
                            <p className="text-slate-400 mt-1 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-900">{tkt.description}</p>
                          </div>

                          {tkt.response ? (
                            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 space-y-1">
                              <p className="font-extrabold text-red-400 flex items-center gap-1 text-[11px]">
                                <Wifi className="w-3.5 h-3.5" />
                                Resposta técnica ({config.providerName}):
                              </p>
                              <p className="text-slate-200 leading-relaxed text-[11px]">{tkt.response}</p>
                            </div>
                          ) : (
                            <p className="text-[10px] text-slate-500 italic">⏳ Aguardando retorno de nossa central técnica de suporte...</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}
      </main>

      {/* PIX MODAL POPUP */}
      {selectedInvoice && (
        <div id="payment-pix-modal" className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="font-black text-sm text-white">Efetuar Pagamento de Pix</h4>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-500 hover:text-white font-black text-xs px-2.5 py-1 rounded hover:bg-slate-800"
              >
                Fechar
              </button>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="inline-flex p-4 bg-emerald-500/20 text-emerald-400 rounded-full animate-bounce">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h5 className="font-black text-base text-white">Pagamento Confirmado!</h5>
                <p className="text-slate-400 text-xs">Sua fatura foi homologada em nosso sistema. O sinal está restabelecido na rede.</p>
              </div>
            ) : (
              <>
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl text-center space-y-2">
                  <p className="text-slate-400 text-xs">Valor da fatura ({selectedInvoice.monthRef}):</p>
                  <p className="text-2xl font-black text-white">R$ {selectedInvoice.value.toFixed(2).replace('.', ',')}</p>
                  <span className="text-[9px] font-mono bg-red-500/10 text-red-400 px-2.5 py-0.5 rounded inline-block">Chave Pix dinâmica ativa</span>
                </div>

                {/* QR Code Graphic Representation */}
                <div className="flex flex-col items-center justify-center space-y-1.5">
                  <div className="bg-white p-3 rounded-xl shadow-inner relative flex items-center justify-center w-36 h-36 border border-slate-800">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(selectedInvoice.pixKey)}`}
                      alt="Pix QR Code" 
                      className="w-32 h-32"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <p className="text-[9px] text-slate-500 font-medium">Escaneie o código QR acima usando o aplicativo do seu banco</p>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Código Pix Copia e Cola:</label>
                  <div className="flex gap-2 bg-slate-950 border border-slate-850 rounded-xl p-2.5 font-mono text-[9px] text-slate-400 relative overflow-hidden select-all">
                    <span className="truncate flex-1">{selectedInvoice.pixKey}</span>
                    <button
                      onClick={() => handleCopyPix(selectedInvoice.pixKey)}
                      className="p-1 px-2 bg-slate-800 rounded text-white hover:text-yellow-400 transition-colors"
                      title="Copiar Código"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {copiedText && (
                    <p className="text-emerald-400 text-[10px] font-bold text-center">✓ Código copiado para a área de transferência!</p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <button
                    onClick={() => handleConfirmPixPayment(selectedInvoice.id)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Confirmar Pagamento (Simulação Pix)</span>
                  </button>
                  <p className="text-slate-500 text-[9px] text-center italic leading-tight">
                    *Nota: Ao clicar em confirmar, o sistema netweaver simula o recebimento do Pix e atualiza a sua conta no ato!
                  </p>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* DETAILED INVOICE PRINT RECIPIENT WINDOW (MOCK PDF VISUALIZER) */}
      {printInvoiceData && (
        <div id="print-recipient-invoice" className="fixed inset-0 bg-slate-950/90 overflow-y-auto z-50 flex items-start justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 my-8 shadow-2xl border border-slate-200">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
              <span className="text-xs uppercase bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold">Comprovante de Fatura Netweaver</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-slate-900 border border-slate-900 text-white rounded-lg hover:bg-slate-800 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Imprimir PDF</span>
                </button>
                <button
                  onClick={() => setPrintInvoiceData(null)}
                  className="px-3.5 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-bold transition-all"
                >
                  Fechar Janela
                </button>
              </div>
            </div>

            {/* Simulated Bill Body */}
            <div className="space-y-6 text-sm font-sans">
              
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="text-xl font-extrabold tracking-tight text-slate-900">{config.providerName}</h4>
                  <p className="text-xs text-slate-500 font-mono uppercase">Telecomunicações & Fibra Comercial</p>
                  <p className="text-xs text-slate-400">{config.address}</p>
                  <p className="text-xs text-slate-400">Fone: {config.providerPhone} | {config.supportEmail}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase ${printInvoiceData.status === 'Pago' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-850'}`}>
                    {printInvoiceData.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-2 font-mono">Fat. Nº: {printInvoiceData.id}</p>
                </div>
              </div>

              <div className="border-t border-b border-slate-200 py-3 grid grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Cliente / Payer</h5>
                  <p className="font-extrabold text-slate-950 text-sm mt-1">{currentClient?.name}</p>
                  <p className="text-slate-500 mt-0.5">CPF: {currentClient?.cpf}</p>
                  <p className="text-slate-500">Fone: {currentClient?.phone}</p>
                </div>
                <div className="text-right">
                  <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Informações de Cobrança</h5>
                  <p className="font-extrabold text-slate-950 text-sm mt-1">Vencimento: {printInvoiceData.dueDate.split('-').reverse().join('/')}</p>
                  <p className="text-slate-500 mt-0.5">Período de Ref: {printInvoiceData.monthRef}</p>
                  <p className="text-slate-500">Serviço: Banda Larga Transparente de Fibra Óptica</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Descrição dos Serviços</h5>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3.5 text-xs">
                  <div className="flex justify-between font-bold text-slate-900 border-b border-slate-200 pb-2">
                    <span>Serviço Detalhado</span>
                    <span>Subtotal</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Assinatura Mensal de Internet Banda Larga - {currentClient?.planName} ({currentClient?.planSpeed} Mbps de Velocidade)</span>
                    <span>R$ {printInvoiceData.value.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Inclusão de Modulador Roteador Wi-Fi Gigabit em regime comodato comodidade</span>
                    <span>R$ 0,00</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>IP Dinâmico com rota redundante de sinal de fibra de alta estabilidade</span>
                    <span>R$ 0,00</span>
                  </div>
                  <div className="flex justify-between font-black text-slate-950 border-t border-slate-200 pt-3 text-sm">
                    <span>VALOR TOTAL DA COBRANÇA</span>
                    <span>R$ {printInvoiceData.value.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details footer inside pdf */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                <div className="space-y-2 text-xs">
                  <h5 className="font-bold text-slate-850 uppercase text-[10px]">Guia de Recibo Banco</h5>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Este documento é uma representação idônea e demonstrativa de faturamento de telecomunicação da empresa Pica-Pau Netweaver. Pagamentos efetuados via faturamento digital de Pix liberam suas credenciais com homologação em até 10 segundos na rede.
                  </p>
                  {printInvoiceData.status === 'Pago' ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-center font-bold">
                      ✓ Pago por Pix em: {printInvoiceData.paidAt ? printInvoiceData.paidAt.split('-').reverse().join('/') : 'Desta Data'}
                    </div>
                  ) : (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-center font-bold">
                      Aguardando Confirmação Pix
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[10px] text-slate-600 font-bold mb-1.5 uppercase font-mono">Linha Digitável / Barcode</p>
                  <div className="h-8 w-full bg-repeating bg-slate-900 rounded font-mono text-[9px] text-white flex items-center justify-center p-2 text-center overflow-hidden">
                    |||||||| |||| ||||||||||| | ||||| | |||||||| ||| ||||||| | || ||||| | 
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1.5 font-mono text-center select-all">84630000001-{printInvoiceData.id.replace(/\D/g, '') || '91845'}-42324901520-2</p>
                </div>
              </div>

              <p className="text-center text-[10px] text-slate-400 pt-6">Em caso de dúvidas em sua fatura, chame no suporte em nosso painel ou pelo e-mail {config.supportEmail}.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
