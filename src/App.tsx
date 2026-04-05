import React, { useState, useMemo } from 'react';
import { Home, Sparkle, Library, Search, Plus } from 'lucide-react';
import { cn } from './lib/utils';
import { AI_Prompt } from './components/ui/animated-ai-input';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [expandedTab, setExpandedTab] = useState<string | null>(null);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'Chat', icon: Sparkle },
    { id: 'library', label: 'Library', icon: Library },
  ];

  // Randomized greetings for the chat area
  const greetings = [
    "Night owl mode, Rishabh?",
    "What's on your mind, Rishabh?",
    "Let's build something, Rishabh.",
    "Ready for a new session, Rishabh?",
    "How can I help you tonight, Rishabh?",
    "Searching for answers, Rishabh?",
    "Awaiting your command, Rishabh."
  ];

  const randomGreeting = useMemo(() => {
    return greetings[Math.floor(Math.random() * greetings.length)];
  }, []);

  return (
    <div className="flex h-screen w-full bg-workspace text-text overflow-hidden font-sans">
      {/* Sidebar - Keeps monospace for tech-minimal branding */}
      <aside 
        className={cn(
          "bg-workspace h-full flex flex-col transition-all duration-300 relative overflow-hidden shrink-0",
          isCollapsed ? "w-0" : "w-[260px]"
        )}
      >
        <div className="flex items-center h-[50px] px-4 pt-1 flex-shrink-0">
          <div className={cn("text-[15px] font-mono font-medium tracking-tight transition-opacity duration-200", isCollapsed ? "opacity-0 invisible" : "opacity-100")}>
            atlas
          </div>
        </div>

        <nav className="flex flex-row gap-1 px-2 py-0.5 items-center">
          {navItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setExpandedTab(item.id === expandedTab ? null : item.id);
              }}
              className={cn(
                "flex items-center h-7 rounded-[14px] cursor-pointer transition-all duration-300 overflow-hidden whitespace-nowrap bg-transparent hover:bg-accent",
                activeTab === item.id ? "w-fit pr-4 bg-accent" : (expandedTab === item.id ? "w-fit pr-4 bg-accent" : "w-7")
              )}
            >
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <item.icon size={13} />
              </div>
              <span className={cn(
                "text-[14px] font-medium transition-all duration-200",
                activeTab === item.id || expandedTab === item.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
              )}>
                {item.label}
              </span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Floating Actions Container */}
      <div 
        className={cn(
          "absolute top-3 z-[100] flex transition-all duration-300",
          isCollapsed 
            ? "left-3 flex-row bg-workspace px-2 py-1 rounded-[12px] border border-accent gap-1 items-center" 
            : "left-[215px] flex-col gap-3 font-mono text-[13px]"
        )}
      >
        {/* New Chat Button */}
        <button 
          className={cn(
            "p-1.5 rounded-lg hover:bg-accent transition-all text-text flex items-center justify-center",
            !isCollapsed && "bg-accent rounded-[10px] hidden"
          )}
          style={{ display: isCollapsed ? 'flex' : 'none' }}
        >
          <Plus size={13} />
        </button>
        
        {/* Sidebar Toggle Button */}
        <button 
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-accent transition-all text-text flex items-center justify-center"
        >
          <div className="w-[15px] h-[15px] border-[1.5px] border-current rounded-[3px] relative">
            <div className="absolute left-[5.5px] top-0 bottom-0 w-[1.5px] bg-current" />
          </div>
        </button>

        {/* Search Button */}
        <button 
          className="p-1.5 rounded-lg hover:bg-accent transition-all text-text flex items-center justify-center"
        >
          <Search size={13} />
        </button>
      </div>

      {/* Core Workspace */}
      <main className="flex-1 h-full bg-background overflow-auto flex flex-col items-center justify-center relative">
        {activeTab === 'chat' ? (
          <div className="w-full h-full flex flex-col items-center justify-center pb-8 max-w-2xl px-4 text-center">
            <div className="flex-1 flex flex-col items-center justify-center mb-8 animate-in fade-in zoom-in duration-500">
               <h1 className="text-[34px] text-[#ECECEC] font-serif tracking-tight">
                 {randomGreeting}
               </h1>
            </div>
            <div className="w-full flex flex-col items-center justify-end">
              <AI_Prompt />
            </div>
          </div>
        ) : (
          <div className="text-text/10 text-sm italic select-none pointer-events-none">
            {/* Pure minimal space as requested */}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
