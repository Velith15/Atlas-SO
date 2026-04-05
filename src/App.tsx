import React, { useState, useMemo } from 'react';
import { Home, Sparkle, Library, Search, Plus, FileText, Link, FolderPlus, FileUp, FolderUp, Filter, MoreHorizontal, LayoutDashboard, Upload, Command, MessageSquare, LayoutGrid, List, Trash2, Folder, StickyNote } from 'lucide-react';
import { cn } from './lib/utils';
import { AI_Prompt } from './components/ui/animated-ai-input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from './components/ui/dropdown-menu';

const ExactNoteIcon = ({ size = 16, className = "", strokeWidth = 2.4 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Body with ultra-rounded corners and bottom-right fold clip */}
    <path d="M3 6.5A3.5 3.5 0 0 1 6.5 3h11A3.5 3.5 0 0 1 21 6.5v8l-6.5 6.5h-8A3.5 3.5 0 0 1 3 17.5V6.5z" />
    {/* Smoothly curved bottom-right fold flap */}
    <path d="M14.5 21v-3a3.5 3.5 0 0 1 3.5-3.5h3" />
  </svg>
);

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

  const topWorkspaceOptions = [
    { id: 'new-note', label: 'New Note', icon: ExactNoteIcon, colorBg: 'bg-[#2A775C]' },
    { id: 'new-canvas', label: 'New Canvas', icon: Command, colorBg: 'bg-[#6D529E]' },
    { id: 'new-chat', label: 'New Chat', icon: Sparkle, colorBg: 'bg-[#2E8C59]' },
    { id: 'paste-link', label: 'Paste Link', icon: Link, colorBg: 'bg-[#3168A0]' },
  ];

  const bottomWorkspaceOptions = [
    { id: 'new-folder', label: 'New Folder', icon: FolderPlus },
    { id: 'upload-files', label: 'Upload Files', icon: Upload },
    { id: 'upload-folder', label: 'Upload Folder', icon: FolderUp },
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

        {/* Divider */}
        <div className="px-3 py-3">
          <div className="h-[1px] w-full bg-accent" />
        </div>

        {/* Dynamic Sidebar Content */}
        <div className={cn("px-2 flex flex-col transition-opacity duration-200 flex-1 overflow-y-auto", isCollapsed ? "opacity-0 invisible" : "opacity-100")}>
          {activeTab === 'home' && (
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-2 mb-2 group">
                <span className="text-[13px] font-normal font-sans tracking-normal not-italic opacity-70 text-text">Workspace</span>
                <div className="flex items-center gap-0.5 text-text/50 opacity-0 group-hover:opacity-100 has-[[data-state=open]]:opacity-100 transition-opacity duration-200">
                  <button className="p-1 hover:bg-accent hover:text-text rounded-md transition-colors">
                    <Filter size={14} />
                  </button>
                  <button className="p-1 hover:bg-accent hover:text-text rounded-md transition-colors">
                    <MoreHorizontal size={14} />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-accent hover:text-text rounded-md transition-colors outline-none data-[state=open]:bg-accent data-[state=open]:text-text">
                        <Plus size={14} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-52 bg-[#1A1A1A] border-accent/60 text-text p-1.5 rounded-[10px] shadow-2xl flex flex-col gap-0.5 z-[100] font-sans"
                      align="start"
                      side="bottom"
                      sideOffset={6}
                    >
                      {topWorkspaceOptions.map((item) => (
                        <DropdownMenuItem
                          key={item.id}
                          onClick={() => {
                            if (item.id === 'new-chat') {
                              setActiveTab('chat');
                              setExpandedTab('chat');
                            }
                          }}
                          className="flex items-center gap-3 px-2 py-1.5 cursor-pointer focus:bg-accent focus:text-text text-[#E0E0E0] rounded-md outline-none transition-colors"
                        >
                          <div className={cn("w-[18px] h-[18px] rounded-[4px] flex items-center justify-center shrink-0", item.colorBg)}>
                            <item.icon size={10} className="text-white" strokeWidth={1.5} />
                          </div>
                          <span className="text-[13px] font-light tracking-wide">{item.label}</span>
                        </DropdownMenuItem>
                      ))}
                      
                      <DropdownMenuSeparator className="bg-[#333333] my-1 mx-1" />

                      {bottomWorkspaceOptions.map((item) => (
                        <DropdownMenuItem
                          key={item.id}
                          className="flex items-center gap-3 px-2 py-1.5 cursor-pointer focus:bg-accent focus:text-[#E0E0E0] text-[#A0A0A0] rounded-md outline-none transition-colors"
                        >
                          <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0">
                            <item.icon size={13} className="text-[#A0A0A0]" strokeWidth={1.25} />
                          </div>
                          <span className="text-[13px] font-light tracking-wide">{item.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col">
              <div className="px-2 mb-2">
                <span className="text-[13px] font-normal font-sans tracking-normal not-italic opacity-70 text-text">Chat History</span>
              </div>
              <div className="flex flex-col gap-0.5">
                {/* Chat History List will go here */}
              </div>
            </div>
          )}
        </div>
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
        ) : activeTab === 'home' ? (
          <div className="w-full h-full flex flex-col items-center relative">
             {/* Top Nav Block */}
             <div className="w-full max-w-[1024px] pt-8 px-8 flex flex-col gap-6 relative z-10">
                 {/* Search Container */}
                 <div className="w-full bg-[#181818] rounded-[24px] flex items-center p-2 shadow-sm border border-white/5">
                     <div className="flex-1 flex items-center gap-3 px-4">
                         <Search size={17} className="text-text/30" />
                         <input type="text" placeholder="Search anything..." className="bg-transparent border-none outline-none text-[14px] text-[#E0E0E0] placeholder:text-text/30 w-full font-sans tracking-wide" />
                     </div>
                     <div className="flex items-center gap-1 pr-1">
                         <button className="p-2 rounded-full bg-[#2A2A2A] text-[#E0E0E0] transition-colors relative">
                             <LayoutGrid size={15} strokeWidth={2} />
                         </button>
                         <button className="p-2 rounded-full text-text/40 hover:bg-[#2A2A2A] hover:text-[#E0E0E0] transition-colors">
                             <List size={15} strokeWidth={2} />
                         </button>
                     </div>
                 </div>

                 {/* Filters */}
                 <div className="flex items-center gap-2">
                     <button className="px-4 py-[7px] rounded-full border border-white/10 bg-white/5 text-[12px] font-normal text-[#E0E0E0] transition-colors text-center tracking-wide">
                         All results
                     </button>
                     <button className="px-4 py-[7px] rounded-full border border-white/[0.04] bg-transparent hover:bg-white/5 text-[12px] font-normal text-[#A0A0A0] transition-colors flex items-center gap-2 whitespace-nowrap">
                         <ExactNoteIcon size={12} className="text-[#328461]" /> Notes
                     </button>
                     <button className="px-4 py-[7px] rounded-full border border-white/[0.04] bg-transparent hover:bg-white/5 text-[12px] font-normal text-[#A0A0A0] transition-colors flex items-center gap-2 whitespace-nowrap">
                         <Sparkle size={12} className="text-[#328461]" /> Atlas AI
                     </button>
                     <button className="px-4 py-[7px] rounded-full border border-white/[0.04] bg-transparent hover:bg-white/5 text-[12px] font-normal text-[#A0A0A0] transition-colors flex items-center gap-2 whitespace-nowrap">
                         <Trash2 size={12} className="text-[#666666]" /> Trash
                     </button>
                 </div>
             </div>

             {/* Center Empty State */}
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-12">
                 <div className="w-[72px] h-[72px] rounded-full bg-[#1A1A1A] border border-white/[0.03] flex items-center justify-center mb-6 relative pointer-events-auto shadow-sm">
                     <Folder size={34} fill="#297A53" stroke="#297A53" className="text-[#297A53]" />
                     <Plus size={16} className="absolute top-[8px] right-[4px] text-[#46A775]" strokeWidth={3.5} />
                 </div>
                 
                 <h2 className="text-[28px] font-serif tracking-tight text-[#ECECEC] mb-1.5 pointer-events-auto">
                     Drop files here
                 </h2>
                 <p className="text-[13px] text-text/30 mb-7 tracking-wide font-light pointer-events-auto">
                     Or create a new item in this folder
                 </p>
                 
                 <div className="flex items-center gap-3 pointer-events-auto">
                     <button className="px-4 py-2 rounded-full border border-white/[0.08] text-[12px] font-light text-[#A0A0A0] hover:text-[#E0E0E0] hover:bg-white/5 transition-colors flex items-center gap-2 bg-transparent">
                         <ExactNoteIcon size={13} className="opacity-70" /> New Note
                     </button>
                     <button className="px-4 py-2 rounded-full border border-white/[0.08] text-[12px] font-light text-[#A0A0A0] hover:text-[#E0E0E0] hover:bg-white/5 transition-colors flex items-center gap-2 bg-transparent">
                         <Command size={13} className="opacity-70" /> New Canvas
                     </button>
                     <button className="px-4 py-2 rounded-full border border-white/[0.08] text-[12px] font-light text-[#A0A0A0] hover:text-[#E0E0E0] hover:bg-white/5 transition-colors flex items-center gap-2 bg-transparent">
                         <Link size={13} className="opacity-70" /> Paste Link
                     </button>
                 </div>
             </div>
          </div>
        ) : (
          <div className="text-text/10 text-sm italic select-none pointer-events-none">
            {/* Pure minimal space */}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
