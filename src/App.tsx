import React, { useState } from 'react';
import { Home, MessageSquare, Library, Search, Plus } from 'lucide-react';
import { cn } from './lib/utils';
import { AI_Prompt } from './components/ui/animated-ai-input';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [expandedTab, setExpandedTab] = useState<string | null>(null);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'library', label: 'Library', icon: Library },
  ];

  return (
    <div className="flex h-screen w-full bg-[#212121] text-[#D1D5DB] overflow-hidden font-mono">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-[#212121] h-full flex flex-col transition-all duration-300 relative overflow-hidden shrink-0",
          isCollapsed ? "w-0" : "w-[260px]"
        )}
      >
        <div className="flex items-center h-[50px] px-4 pt-1 flex-shrink-0">
          <div className={cn("text-[15px] font-medium tracking-tight transition-opacity duration-200", isCollapsed ? "opacity-0 invisible" : "opacity-100")}>
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
                "flex items-center h-7 rounded-[14px] cursor-pointer transition-all duration-300 overflow-hidden whitespace-nowrap bg-transparent hover:bg-[#2A2A2A]",
                activeTab === item.id ? "w-fit pr-4 bg-[#2A2A2A]" : (expandedTab === item.id ? "w-fit pr-4 bg-[#2A2A2A]" : "w-7")
              )}
            >
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <item.icon size={13} />
              </div>
              <span className={cn(
                "font-serif text-[14px] font-medium transition-all duration-200",
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
            ? "left-3 flex-row bg-[#212121] px-2 py-1 rounded-[12px] border border-[#2A2A2A] gap-1 items-center" 
            : "left-[215px] flex-col gap-3"
        )}
      >
        {/* New Chat Button - Only visible when collapsed or specifically requested */}
        <button 
          className={cn(
            "p-1.5 rounded-lg hover:bg-[#2A2A2A] transition-all text-[#D1D5DB] flex items-center justify-center",
            !isCollapsed && "bg-[#2A2A2A] rounded-[10px] hidden" // Hidden in open state as per last request
          )}
          style={{ display: isCollapsed ? 'flex' : 'none' }}
        >
          <Plus size={13} />
        </button>
        
        {/* Sidebar Toggle Button (Swapped with Search as per request) */}
        <button 
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-[#2A2A2A] transition-all text-[#D1D5DB] flex items-center justify-center"
        >
          <div className="w-[15px] h-[15px] border-[1.5px] border-current rounded-[3px] relative">
            <div className="absolute left-[5.5px] top-0 bottom-0 w-[1.5px] bg-current" />
          </div>
        </button>

        {/* Search Button */}
        <button 
          className="p-1.5 rounded-lg hover:bg-[#2A2A2A] transition-all text-[#D1D5DB] flex items-center justify-center"
        >
          <Search size={13} />
        </button>
      </div>

      {/* Core Workspace */}
      <main className="flex-1 h-full bg-[#171717] overflow-auto flex items-center justify-center relative">
        {activeTab === 'chat' ? (
          <div className="w-full h-full flex flex-col items-center justify-end pb-8">
            <AI_Prompt />
          </div>
        ) : (
          <div className="text-[#D1D5DB] opacity-30 text-sm">
            Select Chat to begin
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
