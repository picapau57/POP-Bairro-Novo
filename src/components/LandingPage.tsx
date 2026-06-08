import React from 'react';
import { Wifi, Phone, MapPin, Mail, ArrowRight, User, ShieldCheck, Zap, Activity, MessageSquare } from 'lucide-react';
import { ISPConfig, Announcement, ClientProfile } from '../types';
import { motion } from 'motion/react';

interface LandingPageProps {
  config: ISPConfig;
  announcements: Announcement[];
  onNavigateToClient: () => void;
  onNavigateToAdmin: () => void;
  clients: ClientProfile[];
}

export default function LandingPage({
  config,
  announcements,
  onNavigateToClient,
  onNavigateToAdmin,
  clients
}: LandingPageProps) {
  const activeAnnouncements = announcements.filter(a => a.active);

  return (
    <div id="landing-container" className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Warning Ribbon with customized announcementText */}
      {config.announcementText && (
        <div id="announcement-ribbon" className="bg-blue-600 text-white text-xs md:text-sm py-2 px-4 font-medium text-center relative overflow-hidden flex items-center justify-center gap-2 shadow-inner">
          <span className="inline-block animate-pulse w-2 h-2 rounded-full bg-cyan-300"></span>
          <span className="font-display tracking-wide">{config.announcementText}</span>
        </div>
      )}

      {/* Header */}
      <header id="landing-header" className="bg-white/95 backdrop-blur shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-100 flex items-center justify-center">
              <Wifi className="w-5.5 h-5.5 animate-pulse" />
            </span>
            <div>
              <h1 className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-slate-800 leading-none">
                {config.providerName}
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-mono font-semibold">Client Central Portal</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#plans" className="hover:text-blue-600 transition-colors relative after:absolute after:bottom-[-19px] after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-blue-600 after:transition-all">Planos</a>
            <a href="#about" className="hover:text-blue-600 transition-colors relative after:absolute after:bottom-[-19px] after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-blue-600 after:transition-all">Vantagens</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors relative after:absolute after:bottom-[-19px] after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-blue-600 after:transition-all">Contatos</a>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-portal-cliente"
              onClick={onNavigateToClient}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-md shadow-blue-500/10 active:scale-95"
            >
              <User className="w-4 h-4" />
              <span>Portal do Cliente</span>
            </button>
            <button
              id="btn-admin-config"
              onClick={onNavigateToAdmin}
              className="p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
              title="Painel Administrador"
            >
              <ShieldCheck className="w-5.5 h-5.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 py-16 sm:py-24 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-mono font-semibold">
              <Zap className="w-3.5 h-3.5" /> 
              <span>Ultravelocidade Fibra Sem Limites</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white font-display">
              A internet que voa com a força do <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">{config.providerName}</span>!
            </h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Navegue, jogue online, assista em 4K e faça chamadas de vídeo sem lag. Conexão estável via fibra óptica direto na sua casa ou empresa com suporte de verdade.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#plans" 
                className="inline-flex items-center gap-2.5 px-6 py-3.5 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Ver Planos Disponíveis</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button 
                onClick={onNavigateToClient}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-all"
              >
                <span>Acessar 2ª Via de Fatura</span>
              </button>
            </div>
          </div>

          {/* Announcements & Dynamic Banners from Admin */}
          <div className="lg:col-span-5 w-full flex flex-col gap-4">
            <h3 className="text-xs uppercase tracking-widest font-mono text-blue-400 font-bold mb-1 flex items-center gap-2">
              <Activity className="w-4 h-4 animate-pulse text-blue-400" />
              Destaques e Novidades do Provedor
            </h3>
            {activeAnnouncements.length === 0 ? (
              <div className="bg-slate-800/80 border border-slate-700/50 p-6 rounded-2xl text-center">
                <p className="text-slate-400 text-sm">Fique atento! Novas promoções de internet serão publicadas aqui em breve.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {activeAnnouncements.map((ann, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={ann.id} 
                    className="p-5 rounded-2xl relative overflow-hidden shadow-lg border border-white/5 transition-all hover:scale-[1.02]"
                    style={{
                      background: `linear-gradient(135deg, ${ann.gradientFrom || '#334155'} 0%, ${ann.gradientTo || '#1e293b'} 100%)`
                    }}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8"></div>
                    <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                      Destaque {idx + 1}
                    </span>
                    <h4 className="text-lg font-bold text-white mb-1.5">{ann.title}</h4>
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed mb-4">{ann.content}</p>
                    <button 
                      onClick={onNavigateToClient}
                      className="text-white hover:text-slate-900 bg-white/10 hover:bg-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm flex items-center gap-1"
                    >
                      <span>{ann.buttonText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <h3 className="text-xs uppercase tracking-widest font-mono text-blue-600 font-bold mb-2">Seus planos de internet</h3>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
              Assine fibra óptica de verdade com valores incríveis
            </h2>
            <p className="text-slate-600 mt-3 text-sm leading-relaxed">
              Não cobramos taxa de instalação nos planos de fidelidade. Wi-Fi moderno incluso grátis para sua comodidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between text-left shadow-sm hover:shadow-xl transition-all relative group hover:-translate-y-1">
              <div>
                <span className="text-[10px] font-bold font-mono tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase">BÁSICO</span>
                <h4 className="text-2xl font-black text-slate-900 mt-4 font-display">150 Mega</h4>
                <p className="text-slate-500 text-xs mt-1">Perfeito para estudos, redes sociais e navegação diária.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-slate-400 text-sm font-semibold">R$</span>
                  <span className="text-5xl font-black tracking-tight text-slate-900">59</span>
                  <span className="text-slate-900 font-black text-2xl">,90</span>
                  <span className="text-slate-400 text-sm ml-2">/mês</span>
                </div>
                <ul className="mt-8 space-y-3.5 text-sm font-medium text-slate-600 border-t border-slate-100 pt-6">
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Download: Up to 150 Mbps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Upload: Up to 75 Mbps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Roteador Wi-Fi 5 Gigabit Incluso</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Fibra Óptica Direto na Casa</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onNavigateToClient}
                className="mt-8 w-full py-3 px-4 font-bold rounded-2xl bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 shadow-sm border border-slate-200/60"
              >
                <span>Fazer Login para Contratar</span>
              </button>
            </div>

            {/* Plan 2 - RECOMENDADO Woodpecker */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-8 flex flex-col justify-between text-left shadow-lg scale-105 border-2 border-blue-600 relative group hover:-translate-y-1 transition-all">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-extrabold uppercase tracking-widest text-yellow-300 bg-blue-600 border border-blue-500 px-4 py-1.5 rounded-full shadow-md z-10 flex items-center gap-1 animate-bounce">
                🚀 O campeão de vendas
              </span>
              <div>
                <span className="text-[10px] font-bold font-mono tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full uppercase border border-blue-500/10">INTERMEDIÁRIO</span>
                <h4 className="text-2xl font-black text-white mt-4 font-display">300 Mega</h4>
                <p className="text-slate-300 text-xs mt-1">Excelente para assistir séries em ultra HD, streamer e home office.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-blue-400 text-sm font-semibold">R$</span>
                  <span className="text-5xl font-black tracking-tight text-white">89</span>
                  <span className="text-white font-black text-2xl">,90</span>
                  <span className="text-slate-400 text-sm ml-2">/mês</span>
                </div>
                <ul className="mt-8 space-y-3.5 text-sm text-slate-200 border-t border-slate-800 pt-6">
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Download: Up to 300 Mbps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Upload: Up to 150 Mbps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Roteador Wi-Fi 5 Gigabit Dual Band</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-white font-bold">Dobro de Upload Grátis</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onNavigateToClient}
                className="mt-8 w-full py-3 px-4 font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
              >
                <span>Fazer Login para Contratar</span>
              </button>
            </div>

            {/* Plan 3 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between text-left shadow-sm hover:shadow-xl transition-all relative group hover:-translate-y-1">
              <div>
                <span className="text-[10px] font-bold font-mono tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase">GAMER ULTRA</span>
                <h4 className="text-2xl font-black text-slate-900 mt-4 font-display">600 Mega</h4>
                <p className="text-slate-500 text-xs mt-1">Navegação sem barreiras para download pesado de arquivos e multi-telas de streaming.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-slate-400 text-sm font-semibold">R$</span>
                  <span className="text-5xl font-black tracking-tight text-slate-900">129</span>
                  <span className="text-slate-900 font-black text-2xl">,90</span>
                  <span className="text-slate-400 text-sm ml-2">/mês</span>
                </div>
                <ul className="mt-8 space-y-3.5 text-sm font-medium text-slate-600 border-t border-slate-100 pt-6">
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Download: Up to 600 Mbps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Upload: Up to 300 Mbps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Roteador Premium Wi-Fi 6 Mesh Incluso</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>IP Dinâmico Real Gamer IP</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onNavigateToClient}
                className="mt-8 w-full py-3 px-4 font-bold rounded-2xl bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 shadow-sm border border-slate-200/60"
              >
                <span>Fazer Login para Contratar</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Advantages Vantagens */}
      <section id="about" className="py-20 bg-white border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-[10px] font-bold font-mono tracking-widest text-blue-600 uppercase bg-blue-50 px-3 py-1.5 rounded-full block w-fit border border-blue-100">Nossos Diferenciais</span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">Por que escolher as soluções da {config.providerName}?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Temos cobertura completa de Fibra Óptica própria. Isso nos permite fornecer internet com latência reduzida para jogos, estabilidade para videoconferências e conexões sem oscilação.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex gap-3">
                  <span className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl text-blue-600 h-10 w-10 flex items-center justify-center font-bold shrink-0 shadow-sm border border-blue-100">⚡</span>
                  <div>
                    <h5 className="font-bold text-slate-850 text-sm font-display">Fibra Pura FTTH</h5>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">Fibra vai da central até dentro da sua residência, com perda zero.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl text-blue-600 h-10 w-10 flex items-center justify-center font-bold shrink-0 shadow-sm border border-blue-100">🎧</span>
                  <div>
                    <h5 className="font-bold text-slate-850 text-sm font-display">Suporte Humanizado</h5>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">Converse com técnicos especialistas, sem robôs chatos no WhatsApp.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl text-blue-600 h-10 w-10 flex items-center justify-center font-bold shrink-0 shadow-sm border border-blue-100">💰</span>
                  <div>
                    <h5 className="font-bold text-slate-850 text-sm font-display">Preço Fixo Sem Pegadinhas</h5>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">O valor contratado é exatamente o valor que você irá pagar todo mês.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl text-blue-600 h-10 w-10 flex items-center justify-center font-bold shrink-0 shadow-sm border border-blue-100">🎮</span>
                  <div>
                    <h5 className="font-bold text-slate-850 text-sm font-display">Ping Baixo Gamer</h5>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed font-sans">Rotas de tráfego otimizadas para São Paulo e servidores de games.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Demo Selector for Clients testing */}
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative border border-slate-900">
              <span className="absolute -top-3.5 right-6 text-[10px] font-bold uppercase font-mono bg-indigo-600 text-white px-3 py-1 rounded-full shadow border border-indigo-505">Painel de Demonstração</span>
              <div>
                <h4 className="text-xl font-bold flex items-center gap-2 font-display">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Teste o Portal Prontinho!
                </h4>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  Selecione um cliente simulado abaixo para entrar instantaneamente na Área do Cliente e simular faturas e internet:
                </p>
              </div>

              <div id="demo-quick-users" className="space-y-2.5">
                {clients.map(cli => (
                  <button
                    key={cli.id}
                    onClick={() => {
                      // Save temporarily and simulate login
                      localStorage.setItem('__temp_login_cpf', cli.cpf);
                      onNavigateToClient();
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between transition-colors text-left font-sans text-xs group"
                  >
                    <div>
                      <p className="font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5 font-display text-sm">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        {cli.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">CPF para login: <span className="font-mono font-medium text-slate-200">{cli.cpf}</span></p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-slate-950 text-slate-300 font-semibold px-2 py-0.5 rounded border border-slate-850 block">{cli.planSpeed} Mega</span>
                      <span className={`text-[9px] font-bold mt-1 block ${cli.status === 'Ativo' ? 'text-emerald-400' : 'text-amber-400'}`}>Status: {cli.status}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-center pt-2">
                <span className="text-[10px] text-slate-400 inline-block bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-900/80">
                  💡 <strong>Nota do Sistema:</strong> Você pode mudar este portal livremente no painel do administrador (clique no escudo de engrenagem no topo direito!)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support & Contact Contatos */}
      <section id="contact" className="py-20 bg-slate-900 text-white relative border-t border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
        <div id="contacts-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-mono text-blue-400 font-bold">FALE COM O SUPORTE</h3>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">Precisa de assistência técnica ou novos planos?</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Caso você já seja cliente da {config.providerName}, acesse e faça login na Área do Cliente para abrir chamados oficiais. Se preferir, conte com nossos canais de atendimento telefônico e eletrônico abaixo:
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex gap-3">
                <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/10">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-slate-400 text-[10px] uppercase font-mono font-bold">Telefone Principal</h5>
                  <p className="text-lg font-bold text-white font-display">{config.providerPhone}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-500/10 animate-pulse">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-slate-400 text-[10px] uppercase font-mono font-bold">Atendimento WhatsApp</h5>
                  <a 
                    href={`https://wa.me/${config.whatsappNumber}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-lg font-bold text-emerald-400 hover:underline inline-flex items-center gap-1 font-display"
                  >
                    <span>Iniciar Conversa WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-3 bg-slate-800 text-white rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-slate-400 text-[10px] uppercase font-mono font-bold">E-mail Comercial</h5>
                  <p className="text-lg font-bold text-white font-display">{config.supportEmail}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-705/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <h4 className="text-xl font-bold flex items-center gap-2 font-display">
              <MapPin className="w-5 h-5 text-blue-500" />
              Nossa Sede do Provedor
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              Venha tomar um café conosco ou resolver assuntos contratuais diretamente com um gerente de atendimento no endereço de nossa matriz:
            </p>
            <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl flex gap-3 text-sm">
              <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <span className="text-slate-300 font-medium leading-relaxed">{config.address}</span>
            </div>
            <div className="pt-2">
              <div className="rounded-2xl overflow-hidden bg-slate-950 h-40 border border-slate-800 relative flex items-center justify-center p-4">
                <div className="text-center">
                  <h5 className="font-bold text-white text-xs mb-1 font-display">Mapa de Cobertura Ativa</h5>
                  <p className="text-slate-400 text-[10px]">100% fibra habilitada para mais de 15 bairros próximos!</p>
                  <span className="mt-2.5 inline-block text-[9px] bg-blue-500/10 border border-blue-500/30 text-blue-400 px-2 py-1 rounded font-mono font-bold">Sinal Óptico Excelente 🟢</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 text-slate-500 py-8 text-xs border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="font-bold text-slate-300 font-display">© 2026 {config.providerName}. Todos os direitos reservados.</p>
            <p className="mt-1 font-mono text-slate-600">Serviços de telecomunicação autorizados pela ANATEL.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={onNavigateToClient} className="hover:text-slate-300 transition-colors">Acesso Central</button>
            <span>•</span>
            <button onClick={onNavigateToAdmin} className="hover:text-slate-300 transition-colors">Suporte Técnico</button>
            <span>•</span>
            <a href="https://pica-pau-netweaver.lovable.app/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">Sistema Netweaver Oficial</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
