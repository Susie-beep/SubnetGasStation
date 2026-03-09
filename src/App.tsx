/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { Wallet, ArrowRight, CheckCircle2, Loader2, ExternalLink, AlertCircle, Fuel, Grid, Gamepad2, Coins, Image as ImageIcon, ArrowLeft, LayoutGrid } from 'lucide-react';

// Types
declare global {
  interface Window {
    ethereum: any;
  }
}

type StepStatus = 'idle' | 'loading' | 'success';
type View = 'landing' | 'portal' | 'swap';
type Category = 'All' | 'Dex' | 'GameFi' | 'NFT';

interface TimelineStep {
  id: number;
  label: string;
  status: StepStatus;
}

interface RpcLog {
  timestamp: string;
  method: string;
  params: any;
  type: 'req' | 'res';
}

interface Balances {
  USDC: number;
  AVAX: number;
  ALOT: number;
}

interface AppCardProps {
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  onClick: () => void;
}

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [account, setAccount] = useState<string | null>(null);
  const [isDemoWallet, setIsDemoWallet] = useState(false);
  const [balances, setBalances] = useState<Balances>({ USDC: 100, AVAX: 0, ALOT: 0 });

  // Connect Wallet Logic
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        setIsDemoWallet(false);
      } catch (err: any) {
        console.error(err);
      }
    } else {
      connectDemoWallet();
    }
  };

  const connectDemoWallet = () => {
    setAccount("0x71C...9A23");
    setIsDemoWallet(true);
  };

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 font-sans selection:bg-red-500/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0F172A]/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setView('portal')}
          >
            <div className="w-8 h-8 bg-[#E84142] rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-red-900/20">
              <LayoutGrid size={20} />
            </div>
            <h1 className="font-bold text-lg tracking-tight text-white">
              Subnet<span className="text-[#E84142]">Gas</span>Station
            </h1>
          </div>
          
          <button
            onClick={account ? () => {} : connectWallet}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              account 
                ? 'bg-slate-800 text-slate-300 border border-white/5 cursor-default' 
                : 'bg-[#E84142] hover:bg-[#D13031] text-white shadow-lg shadow-red-900/20'
            }`}
          >
            <Wallet size={18} />
            {account ? formatAddress(account) : 'Connect Wallet'}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {view === 'landing' ? (
          <LandingView onLaunch={() => setView('portal')} />
        ) : view === 'portal' ? (
          <PortalView onAppClick={(appName) => {
            if (appName === 'Dexalot') setView('swap');
          }} />
        ) : (
          <SwapView 
            account={account}
            balances={balances}
            setBalances={setBalances}
            connectWallet={connectWallet}
            onBack={() => setView('portal')}
            isDemoWallet={isDemoWallet}
          />
        )}
      </main>
    </div>
  );
}

function LandingView({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="space-y-24 py-12 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
          Gas Abstraction Infrastructure <br className="hidden md:block" />
          <span className="text-[#E84142]">for Avalanche Subnets</span>
        </h1>
        <p className="text-xl text-slate-300 font-medium">
          Interact with subnet applications using a single asset — no native gas tokens required.
        </p>
        <div className="text-slate-400 max-w-2xl mx-auto space-y-2 text-lg">
          <p>Subnet Gas Station provides a <strong className="text-white">gas abstraction layer for Avalanche Subnets</strong> using an intent-based execution model.</p>
          <p>The system allows users to interact with subnet applications without acquiring the subnet’s native gas token.</p>
          <div className="pt-4 flex flex-col items-center text-sm">
            <p className="text-slate-500 mb-2 uppercase tracking-widest font-semibold">The project includes:</p>
            <ul className="flex flex-wrap justify-center gap-4 text-slate-300">
              <li className="bg-white/5 px-3 py-1 rounded-full border border-white/10">• Gas abstraction protocol</li>
              <li className="bg-white/5 px-3 py-1 rounded-full border border-white/10">• Relayer execution network</li>
              <li className="bg-white/5 px-3 py-1 rounded-full border border-white/10">• Developer integration SDK</li>
              <li className="bg-white/5 px-3 py-1 rounded-full border border-white/10">• A unified application portal demo</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-center gap-4 pt-8">
          <button onClick={onLaunch} className="bg-[#E84142] hover:bg-[#D13031] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20">
            Launch Demo
          </button>
          <a href="#architecture" className="bg-[#1E293B] hover:bg-[#2D3B55] text-white px-8 py-3 rounded-xl font-bold transition-all border border-white/10">
            View Architecture
          </a>
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-4xl mx-auto bg-[#1E293B]/30 border border-white/5 rounded-3xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-white mb-6">The Gas Fragmentation Problem</h2>
        <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
          <p>Within the Avalanche ecosystem, each subnet can define its own gas token.</p>
          <p>While this design enables flexibility and customization, it introduces significant onboarding friction.</p>
          <p>Users who want to interact with a subnet application must first:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-400">
            <li>bridge assets to the subnet</li>
            <li>acquire the subnet’s gas token</li>
            <li>execute their first transaction</li>
          </ul>
          <p className="pt-2 text-amber-400/90 font-medium">For new users exploring the ecosystem, this process creates unnecessary complexity.</p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="max-w-4xl mx-auto bg-gradient-to-br from-[#E84142]/10 to-[#1E293B]/50 border border-[#E84142]/20 rounded-3xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-white mb-6">Subnet Gas Station</h2>
        <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
          <p>Subnet Gas Station introduces a <strong className="text-white">gas abstraction infrastructure layer</strong> that removes the need for users to manage multiple subnet gas tokens.</p>
          <p>Users sign a transaction intent using a common asset such as USDC.</p>
          <p>A relayer network then executes the transaction on the target subnet and pays the required gas on behalf of the user.</p>
          <p className="pt-2 text-emerald-400/90 font-medium">This allows applications to onboard users without requiring them to manage subnet-specific tokens.</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">How It Works</h2>
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { step: 1, title: "User Signs Intent", desc: "Users interact with an application through the portal and sign an intent describing the action they want to perform. Example: Swap 10 USDC for ALOT on Dexalot." },
            { step: 2, title: "Intent Sent to Gas Station Contract", desc: "The signed intent is submitted to the Gas Station smart contract deployed on Avalanche C-Chain. The contract locks the required user assets and prepares a cross-subnet execution request." },
            { step: 3, title: "Cross-Subnet Message", desc: "A message is sent to the destination subnet through Avalanche Teleporter." },
            { step: 4, title: "Relayer Executes Transaction", desc: "A relayer listens for intents and performs the transaction on the target subnet. The relayer pays the required gas and executes the application call." },
            { step: 5, title: "Result Returned", desc: "The transaction result is finalized and the user receives the output tokens. Users successfully interacted with the subnet without holding its native gas token." }
          ].map((s) => (
            <div key={s.step} className="bg-[#0F172A] border border-white/5 rounded-2xl p-6 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#E84142] rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-[#0F172A]">
                {s.step}
              </div>
              <h3 className="text-lg font-bold text-white mb-3 mt-2">{s.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Infrastructure Stack */}
      <section id="architecture" className="max-w-5xl mx-auto scroll-mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Infrastructure Architecture</h2>
          <p className="text-slate-400 text-lg">Subnet Gas Station is designed as a modular infrastructure stack composed of three core components.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#1E293B]/50 border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-4 text-[#E84142]">Gas Abstraction Protocol</h3>
            <p className="text-slate-300 mb-4">Smart contracts responsible for handling transaction intents and managing gas abstraction.</p>
            <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-2">Functions include:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400 text-sm">
              <li>receiving user intents</li>
              <li>locking user assets</li>
              <li>initiating cross-subnet execution</li>
            </ul>
          </div>
          <div className="bg-[#1E293B]/50 border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-4 text-amber-400">Relayer Execution Network</h3>
            <p className="text-slate-300 mb-4">Relayers monitor new intents and execute transactions on the destination subnet.</p>
            <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-2">Responsibilities include:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400 text-sm">
              <li>monitoring intents</li>
              <li>paying subnet gas fees</li>
              <li>executing transactions</li>
              <li>returning results</li>
            </ul>
          </div>
          <div className="bg-[#1E293B]/50 border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-4 text-blue-400">Cross-Subnet Messaging</h3>
            <p className="text-slate-300 mb-4">Cross-subnet communication is powered by Avalanche Teleporter.</p>
            <p className="text-slate-400 text-sm">Teleporter enables secure and efficient message passing between Avalanche subnets.</p>
          </div>
        </div>
      </section>

      {/* Developer Integration */}
      <section className="max-w-4xl mx-auto bg-[#0F172A] border border-white/10 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">Build with Subnet Gas Station</h2>
          <p className="text-slate-300 text-lg">Subnet Gas Station is designed as both an infrastructure protocol and a developer platform. Developers can integrate gas abstraction directly into their applications.</p>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">Integration Options</h3>
        
        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Smart Contract Integration</h4>
            <p className="text-slate-400">Applications can call the Gas Station smart contract to execute transactions on other subnets.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Frontend SDK</h4>
            <p className="text-slate-400 mb-4">Frontend applications can submit intents directly through a lightweight SDK.</p>
            <div className="bg-[#1E293B] rounded-xl p-4 font-mono text-sm text-emerald-400 border border-white/5 overflow-x-auto">
<pre>{`gasStation.submitIntent({
  targetApp: "dexalot",
  action: "swap",
  tokenIn: "USDC",
  amount: 10
})`}</pre>
            </div>
            <p className="text-slate-400 mt-4">This allows developers to integrate gas abstraction with minimal changes to their application.</p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-bold text-white">Toward a Gasless Subnet Ecosystem</h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          Subnet Gas Station aims to transform Avalanche subnets into a gas-abstracted application ecosystem.
        </p>
        <p className="text-slate-400 leading-relaxed">
          Users should be able to explore and interact with applications without managing multiple gas tokens across networks. By removing gas friction, we make the Avalanche ecosystem more accessible to both users and developers.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 pt-8 pb-4 text-center space-y-2">
        <p className="text-slate-500 font-medium">Built on Avalanche</p>
        <p className="text-slate-600 text-sm">Powered by Teleporter cross-subnet messaging</p>
        <p className="text-slate-600 text-sm">Demo integration with Dexalot</p>
      </footer>
    </div>
  );
}

function PortalView({ onAppClick }: { onAppClick: (name: string) => void }) {
  const [category, setCategory] = useState<Category>('All');
  const [toast, setToast] = useState<string | null>(null);

  const apps = [
    { name: 'Dexalot', category: 'Dex', icon: <Coins className="text-amber-400" />, description: 'Central Limit Order Book DEX on Avalanche Subnet.' },
    { name: 'Crabada', category: 'GameFi', icon: <Gamepad2 className="text-purple-400" />, description: 'Play-and-earn idle game on Swimmer Network.' },
    { name: 'JoePegs', category: 'NFT', icon: <ImageIcon className="text-pink-400" />, description: 'The leading NFT Marketplace on Avalanche.' },
    { name: 'Shrapnel', category: 'GameFi', icon: <Gamepad2 className="text-emerald-400" />, description: 'AAA FPS game built on Avalanche.' },
    { name: 'GMX', category: 'Dex', icon: <Coins className="text-blue-400" />, description: 'Decentralized perpetual exchange.' },
    { name: 'Dokyo', category: 'NFT', icon: <ImageIcon className="text-orange-400" />, description: 'Premium NFT collection and community.' },
  ];

  const filteredApps = category === 'All' ? apps : apps.filter(app => app.category === category);

  const handleAppClick = (appName: string) => {
    if (appName === 'Dexalot') {
      onAppClick(appName);
    } else {
      setToast(`${appName} integration is coming soon!`);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#1E293B] border border-white/10 text-white px-6 py-3 rounded-full shadow-xl shadow-black/50 z-50 animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <AlertCircle size={18} className="text-amber-400" />
          {toast}
        </div>
      )}
      <div className="text-center space-y-4 py-8">
        <h2 className="text-4xl font-bold text-white">Unified Gas Payment for Avalanche Subnets</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Interact with any subnet application using a single token. Gas is automatically converted and paid by the relayer.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center gap-2">
        {['All', 'Dex', 'GameFi', 'NFT'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat as Category)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              category === cat 
                ? 'bg-[#E84142] text-white shadow-lg shadow-red-900/20' 
                : 'bg-[#1E293B] text-slate-400 hover:bg-[#2D3B55] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* App Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <div 
            key={app.name}
            onClick={() => handleAppClick(app.name)}
            className="bg-[#1E293B]/50 border border-white/5 rounded-2xl p-6 hover:border-[#E84142]/50 hover:bg-[#1E293B] transition-all cursor-pointer group backdrop-blur-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#0F172A] rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform border border-white/5">
                {app.icon}
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-md bg-white/5 text-slate-400 border border-white/5">
                {app.category}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#E84142] transition-colors">{app.name}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{app.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SwapView({ account, balances, setBalances, connectWallet, onBack, isDemoWallet }: any) {
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const txResultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (txHash && txResultRef.current) {
      txResultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [txHash]);
  
  const [steps, setSteps] = useState<TimelineStep[]>([
    { id: 1, label: 'Signing Intent', status: 'idle' },
    { id: 2, label: 'Submitting to Gas Station', status: 'idle' },
    { id: 3, label: 'Relayer converting USDC → AVAX', status: 'idle' },
    { id: 4, label: 'Relayer paying subnet gas', status: 'idle' },
    { id: 5, label: 'Submitting tx to Dexalot Subnet', status: 'idle' },
    { id: 6, label: 'Swap executed', status: 'idle' },
  ]);

  const [logs, setLogs] = useState<RpcLog[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (method: string, params: any, type: 'req' | 'res' = 'req') => {
    setLogs(prev => [...prev, {
      timestamp: new Date().toISOString().split('T')[1].slice(0, -1),
      method,
      params,
      type
    }]);
  };

  const handleSwap = async () => {
    if (!account) return;
    const swapAmount = parseFloat(amount);
    
    if (isNaN(swapAmount) || swapAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (swapAmount > balances.USDC) {
      setError("Insufficient USDC balance.");
      return;
    }

    setError(null);
    setIsProcessing(true);
    setTxHash(null);
    setLogs([]);
    setSteps(prev => prev.map(s => ({ ...s, status: 'idle' })));

    try {
      const updateStep = (id: number, status: StepStatus) => {
        setSteps(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      };
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      // Step 1: Sign Intent
      updateStep(1, 'loading');
      addLog('eth_signTypedData_v4', { message: { from: "USDC", to: "AVAX", amount: swapAmount } }, 'req');
      if (!isDemoWallet && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const message = JSON.stringify({
            from: "USDC",
            to: "AVAX",
            amount: swapAmount,
            timestamp: Date.now()
          });
          await signer.signMessage(message);
        } catch (err) {
          throw new Error("User rejected signature");
        }
      } else {
        await delay(1000);
      }
      addLog('eth_signTypedData_v4', { result: "0x" + Array.from({length: 130}, () => Math.floor(Math.random() * 16).toString(16)).join('') }, 'res');
      updateStep(1, 'success');

      // Step 2: Submit to Gas Station
      updateStep(2, 'loading');
      addLog('gasStation_submitIntent', { intent: "0x..." }, 'req');
      await delay(1000);
      addLog('gasStation_submitIntent', { status: "accepted", taskId: "0x999" }, 'res');
      updateStep(2, 'success');

      // Step 3: Relayer converting
      updateStep(3, 'loading');
      addLog('relayer_convertFee', { token: "USDC", amount: 0.1 }, 'req');
      await delay(1000);
      addLog('relayer_convertFee', { status: "converted", received: "0.02 ALOT" }, 'res');
      updateStep(3, 'success');

      // Step 4: Relayer paying gas
      updateStep(4, 'loading');
      addLog('eth_sendTransaction', { to: "0xGasContract", value: "0.02 ALOT" }, 'req');
      await delay(1000);
      addLog('eth_sendTransaction', { txHash: "0xdef456..." }, 'res');
      updateStep(4, 'success');

      // Step 5: Submitting tx
      updateStep(5, 'loading');
      addLog('eth_sendRawTransaction', { data: "0xSwapData..." }, 'req');
      await delay(1000);
      addLog('eth_sendRawTransaction', { txHash: "0x789..." }, 'res');
      updateStep(5, 'success');

      // Step 6: Executed
      updateStep(6, 'loading');
      addLog('eth_getTransactionReceipt', { hash: "0x789..." }, 'req');
      await delay(1000);
      addLog('eth_getTransactionReceipt', { status: "0x1" }, 'res');
      updateStep(6, 'success');

      const newTxHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxHash(newTxHash);
      
      // Update Balances (USDC -> AVAX)
      // Assuming 1 AVAX = 8.863 USDC
      const avaxAmount = swapAmount / 8.863; 
      
      setBalances((prev: Balances) => ({
        USDC: prev.USDC - swapAmount - 0.1, // 0.1 gas fee
        AVAX: prev.AVAX + avaxAmount,
        ALOT: prev.ALOT
      }));

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Portal
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Interaction */}
        <div className="space-y-6">
          
          {/* Assets Card */}
          <div className="bg-[#1E293B]/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Wallet Assets</h2>
            <div className="space-y-3">
              <AssetRow symbol="USDC" name="USD Coin" balance={balances.USDC} icon="💲" isConnected={!!account} />
              <AssetRow symbol="AVAX" name="Avalanche" balance={balances.AVAX} icon="🔺" isConnected={!!account} />
              <AssetRow symbol="ALOT" name="Dexalot" balance={balances.ALOT} icon="💠" isConnected={!!account} />
            </div>
          </div>

          {/* Swap Interface */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E84142] to-orange-500 opacity-80"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#E84142]/20 rounded-lg flex items-center justify-center text-[#E84142]">
                <Coins size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Dexalot Swap</h2>
                <p className="text-xs text-slate-400">Gasless trading via Subnet</p>
              </div>
            </div>
            
            {/* From Input */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">From</span>
                <span className="text-slate-400">Balance: {balances.USDC.toFixed(2)}</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  disabled={isProcessing || !account}
                  className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-2xl font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#E84142] focus:ring-1 focus:ring-[#E84142] transition-all disabled:opacity-50"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-[#1E293B] px-2 py-1 rounded-lg border border-white/5">
                  <span className="text-xl">💲</span>
                  <span className="font-bold text-white">USDC</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center -my-2 relative z-10">
              <div className="bg-[#0F172A] border border-white/10 p-2 rounded-full text-slate-400">
                <ArrowRight size={20} />
              </div>
            </div>

            {/* To Input (Read Only) */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">To (Estimate)</span>
                <span className="text-slate-400">Rate: 1 AVAX ≈ 8.863 USDC</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={amount ? (parseFloat(amount) / 8.863).toFixed(4) : '0.0000'}
                  readOnly
                  className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-2xl font-mono text-slate-300 focus:outline-none cursor-default"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-[#1E293B] px-2 py-1 rounded-lg border border-white/5">
                  <span className="text-xl">🔺</span>
                  <span className="font-bold text-white">AVAX</span>
                </div>
              </div>
            </div>

            {/* Gas Info */}
            <div className="bg-[#0F172A]/50 rounded-xl p-4 mb-6 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">Estimated Gas</span>
                <span className="text-sm font-mono text-slate-200">0.02 ALOT</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Gas paid via</span>
                <span className="text-sm font-bold text-[#E84142] flex items-center gap-1">
                  <Fuel size={14} /> USDC
                </span>
              </div>
            </div>

            {/* Action Button */}
            {!account ? (
              <button
                onClick={connectWallet}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl transition-all"
              >
                Connect Wallet to Swap
              </button>
            ) : (
              <button
                onClick={handleSwap}
                disabled={isProcessing || !amount}
                className="w-full bg-[#E84142] hover:bg-[#D13031] disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" /> Processing...
                  </>
                ) : (
                  'Execute Trade'
                )}
              </button>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Execution & Status */}
        <div className="space-y-6">
          
          {/* Execution Timeline */}
          <div className="bg-[#1E293B]/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm h-full flex flex-col">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Execution Timeline</h2>
            
            <div className="space-y-6 relative flex-1">
              {/* Vertical Line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-700/50 -z-10"></div>

              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-4 group">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                    ${step.status === 'success' ? 'bg-emerald-500 border-emerald-500 text-white' : 
                      step.status === 'loading' ? 'bg-[#E84142] border-[#E84142] text-white' : 
                      'bg-[#0F172A] border-slate-600 text-slate-600'}
                  `}>
                    {step.status === 'success' ? <CheckCircle2 size={16} /> : 
                     step.status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : 
                     <span className="text-xs font-mono">{step.id}</span>}
                  </div>
                  <span className={`
                    text-sm font-medium transition-colors duration-300
                    ${step.status === 'success' ? 'text-emerald-400' : 
                      step.status === 'loading' ? 'text-white' : 
                      'text-slate-500'}
                  `}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Result */}
          {txHash && (
            <div 
              ref={txResultRef}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Transaction Success</h3>
                  <p className="text-xs text-emerald-400/80">Swap executed successfully</p>
                </div>
              </div>
              
              <div className="bg-[#0F172A] rounded-lg p-3 mb-4 border border-white/5">
                <p className="text-xs text-slate-500 mb-1">Transaction Hash</p>
                <p className="font-mono text-xs text-slate-300 break-all">{txHash}</p>
              </div>

              <a 
                href={`https://subnets.avax.network/dexalot/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                View on Explorer <ExternalLink size={14} />
              </a>
            </div>
          )}

        </div>
      </div>

      {/* RPC Logs - Fixed Bottom Right */}
      <div className="fixed bottom-6 right-6 w-96 bg-[#0F172A]/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 font-mono text-xs h-72 flex flex-col shadow-2xl shadow-black/50 z-50 animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
          <span className="text-slate-400 font-sans font-semibold">JSON-RPC Terminal</span>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {logs.length === 0 ? (
            <div className="text-slate-600 italic">Waiting for transaction...</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="break-all animate-in fade-in duration-300">
                <span className="text-slate-500">[{log.timestamp}] </span>
                <span className={log.type === 'req' ? 'text-blue-400' : 'text-emerald-400'}>
                  {log.type === 'req' ? '→' : '←'} {log.method}
                </span>
                <div className="pl-4 text-slate-400 mt-0.5">
                  {JSON.stringify(log.params)}
                </div>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}

function AssetRow({ symbol, name, balance, icon, isConnected }: { symbol: string, name: string, balance: number, icon: string, isConnected: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#1E293B] rounded-full flex items-center justify-center text-xl">
          {icon}
        </div>
        <div>
          <div className="font-bold text-white">{symbol}</div>
          <div className="text-xs text-slate-500">{name}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono font-medium text-slate-200">{isConnected ? balance.toFixed(4) : '-'}</div>
      </div>
    </div>
  );
}

