import React, { useState, useEffect } from 'react';
import { 
  ISPConfig, 
  Announcement, 
  ClientProfile, 
  Invoice, 
  SupportTicket,
  INITIAL_ISP_CONFIG,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_CLIENTS,
  INITIAL_INVOICES,
  INITIAL_TICKETS
} from './types';
import LandingPage from './components/LandingPage';
import ClientDashboard from './components/ClientDashboard';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  // Navigation state: 'landing' | 'client' | 'admin'
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'client' | 'admin'>('landing');

  // Core Global States with LocalStorage Persistence
  const [config, setConfig] = useState<ISPConfig>(INITIAL_ISP_CONFIG);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [clients, setClients] = useState<ClientProfile[]>(INITIAL_CLIENTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('__weaver_isp_config_v2');
      if (savedConfig) setConfig(JSON.parse(savedConfig));

      const savedAnnouncements = localStorage.getItem('__weaver_announcements_v2');
      if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));

      const savedClients = localStorage.getItem('__weaver_clients_v2');
      if (savedClients) setClients(JSON.parse(savedClients));

      const savedInvoices = localStorage.getItem('__weaver_invoices_v2');
      if (savedInvoices) setInvoices(JSON.parse(savedInvoices));

      const savedTickets = localStorage.getItem('__weaver_tickets_v2');
      if (savedTickets) setTickets(JSON.parse(savedTickets));
    } catch (e) {
      console.error('Falha ao ler dados do localStorage:', e);
    }
  }, []);

  // Save states to localStorage when updated
  const saveConfig = (newConfig: ISPConfig) => {
    setConfig(newConfig);
    localStorage.setItem('__weaver_isp_config_v2', JSON.stringify(newConfig));
  };

  const saveAnnouncements = (newAnnouncements: Announcement[]) => {
    setAnnouncements(newAnnouncements);
    localStorage.setItem('__weaver_announcements_v2', JSON.stringify(newAnnouncements));
  };

  const saveClients = (newClients: ClientProfile[]) => {
    setClients(newClients);
    localStorage.setItem('__weaver_clients_v2', JSON.stringify(newClients));
  };

  const saveInvoices = (newInvoices: Invoice[]) => {
    setInvoices(newInvoices);
    localStorage.setItem('__weaver_invoices_v2', JSON.stringify(newInvoices));
  };

  const saveTickets = (newTickets: SupportTicket[]) => {
    setTickets(newTickets);
    localStorage.setItem('__weaver_tickets_v2', JSON.stringify(newTickets));
  };

  // State Change Orchestration Handlers
  const handleUpdateConfig = (newConfig: ISPConfig) => {
    saveConfig(newConfig);
  };

  const handleUpdateAnnouncements = (newAnnouncements: Announcement[]) => {
    saveAnnouncements(newAnnouncements);
  };

  const handleAddClient = (newClient: ClientProfile) => {
    const updated = [...clients, newClient];
    saveClients(updated);
  };

  const handleUpdateClientStatus = (clientId: string, status: ClientProfile['status']) => {
    const updated = clients.map(c => {
      if (c.id === clientId) {
        return { ...c, status };
      }
      return c;
    });
    saveClients(updated);
  };

  const handleAddInvoice = (newInvoice: Invoice) => {
    const updated = [...invoices, newInvoice];
    saveInvoices(updated);
  };

  const handleToggleInvoiceStatus = (invoiceId: string) => {
    const invoiceToToggle = invoices.find(i => i.id === invoiceId);
    if (!invoiceToToggle) return;

    const newStatus = invoiceToToggle.status === 'Pago' ? 'Pendente' : 'Pago';
    const updatedInvoices = invoices.map(i => {
      if (i.id === invoiceId) {
        return { 
          ...i, 
          status: newStatus,
          paidAt: newStatus === 'Pago' ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return i;
    });
    saveInvoices(updatedInvoices);

    // Auto update client connection status (If they pay their bills, unblock them)
    if (newStatus === 'Pago') {
      autoCheckClientFinancialRelease(invoiceToToggle.clientId, updatedInvoices);
    }
  };

  const handlePayInvoiceViaPix = (invoiceId: string) => {
    const updatedInvoices = invoices.map(i => {
      if (i.id === invoiceId) {
        return { 
          ...i, 
          status: 'Pago' as const,
          paidAt: new Date().toISOString().split('T')[0]
        };
      }
      return i;
    });
    saveInvoices(updatedInvoices);

    // Find the invoice to activate the client
    const targetInv = invoices.find(i => i.id === invoiceId);
    if (targetInv) {
      autoCheckClientFinancialRelease(targetInv.clientId, updatedInvoices);
    }
  };

  // Helper flow to automatically unblock clients if all invoices are paid
  const autoCheckClientFinancialRelease = (clientId: string, currentInvoicesList: Invoice[]) => {
    const clientUnpaidCount = currentInvoicesList.filter(i => i.clientId === clientId && i.status !== 'Pago').length;
    if (clientUnpaidCount === 0) {
      const updatedClients = clients.map(c => {
        if (c.id === clientId && (c.status === 'Bloqueado' || c.status === 'Suspenso')) {
          return { ...c, status: 'Ativo' as const };
        }
        return c;
      });
      saveClients(updatedClients);
    }
  };

  const handleAddSupportTicket = (ticketFields: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => {
    const newTkt: SupportTicket = {
      ...ticketFields,
      id: `tkt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Aberto'
    };
    const updated = [...tickets, newTkt];
    saveTickets(updated);
  };

  const handleResponseTicket = (ticketId: string, response: string, newStatus: SupportTicket['status']) => {
    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        return { 
          ...t, 
          response, 
          status: newStatus,
          responseAt: new Date().toISOString()
        };
      }
      return t;
    });
    saveTickets(updated);
  };

  const handleClientLogout = () => {
    // Standard logout redirect
    setCurrentScreen('landing');
  };

  const handleBackToLanding = () => {
    setCurrentScreen('landing');
  };

  // Render Screens based on active routing
  return (
    <div id="portal-app-root" className="bg-slate-50 min-h-screen">
      {currentScreen === 'landing' && (
        <LandingPage
          config={config}
          announcements={announcements}
          clients={clients}
          onNavigateToClient={() => setCurrentScreen('client')}
          onNavigateToAdmin={() => setCurrentScreen('admin')}
        />
      )}

      {currentScreen === 'client' && (
        <ClientDashboard
          config={config}
          clients={clients}
          invoices={invoices}
          tickets={tickets}
          onAddTicket={handleAddSupportTicket}
          onPayInvoice={handlePayInvoiceViaPix}
          onLogout={handleClientLogout}
          onBackToLanding={handleBackToLanding}
        />
      )}

      {currentScreen === 'admin' && (
        <AdminDashboard
          config={config}
          announcements={announcements}
          clients={clients}
          invoices={invoices}
          tickets={tickets}
          onUpdateConfig={handleUpdateConfig}
          onUpdateAnnouncements={handleUpdateAnnouncements}
          onAddClient={handleAddClient}
          onUpdateClientStatus={handleUpdateClientStatus}
          onAddInvoice={handleAddInvoice}
          onToggleInvoiceStatus={handleToggleInvoiceStatus}
          onResponseTicket={handleResponseTicket}
          onBackToLanding={handleBackToLanding}
        />
      )}
    </div>
  );
}
