import React, { useState, useMemo } from 'react';
import { 
  Home, Sparkle, Library, Search, Plus, FileText, Link, FolderPlus, FileUp, FolderUp, 
  Filter, MoreHorizontal, LayoutDashboard, Upload, Command, MessageSquare, LayoutGrid, 
  List, Trash2, Folder, StickyNote, ChevronRight, ChevronDown, ArrowLeft, ArrowRight,
  SquareArrowOutUpRight, Columns2, Pin, Pencil, Copy, Share, FolderInput, Download, Info, Circle
} from 'lucide-react';
import { cn } from './lib/utils';
import { AI_Prompt } from './components/ui/animated-ai-input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from './components/ui/dropdown-menu';
import { 
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, 
  ContextMenuSeparator, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent,
  ContextMenuShortcut
} from './components/ui/context-menu';
import { NewFolderModal } from './components/ui/new-folder-modal';
import { NewNoteModal } from './components/ui/new-note-modal';
import { NoteEditor } from './components/ui/note-editor';
import { motion, AnimatePresence } from 'framer-motion';

interface FolderData {
  id: string;
  name: string;
  color: string;
  parentId: string | null;
  createdAt: Date;
  isPinned?: boolean;
}

interface NoteData {
  id: string;
  name: string;
  content: string;
  parentId: string | null;
  createdAt: Date;
  isPinned?: boolean;
}

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
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [currentPath, setCurrentPath] = useState<{ id: string; name: string }[]>([]);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(new Set());

  // History state
  const [history, setHistory] = useState<{ path: { id: string; name: string }[]; activeNoteId: string | null }[]>([{ path: [], activeNoteId: null }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const navigateTo = (path: { id: string; name: string }[], noteId: string | null = null) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ path, activeNoteId: noteId });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
    setActiveNoteId(noteId);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(prev.path);
      setActiveNoteId(prev.activeNoteId);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(next.path);
      setActiveNoteId(next.activeNoteId);
    }
  };

  const toggleFolderExpansion = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpandedFolderIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Automatically expand parents when currentPath changes
  React.useEffect(() => {
    if (currentPath.length > 1) {
      setExpandedFolderIds((prev) => {
        const next = new Set(prev);
        for (let i = 0; i < currentPath.length - 1; i++) {
          next.add(currentPath[i].id);
        }
        return next;
      });
    }
  }, [currentPath]);

  const createFolder = (name: string, color: string, parentId: string | null) => {
    const newFolder: FolderData = {
      id: Math.random().toString(36).substring(7),
      name,
      color,
      parentId,
      createdAt: new Date(),
    };
    setFolders([...folders, newFolder]);
  };

  const createNote = (name: string, parentId: string | null) => {
    const newNote: NoteData = {
      id: Math.random().toString(36).substring(7),
      name,
      content: "",
      parentId,
      createdAt: new Date(),
    };
    setNotes([...notes, newNote]);
    // Optionally open the note immediately
    setActiveNoteId(newNote.id);
  };

  const saveNote = (id: string, content: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, content } : n));
  };

  const deleteFolder = (id: string) => {
    const childrenIds = folders.filter((f: FolderData) => f.parentId === id).map((f: FolderData) => f.id);
    childrenIds.forEach(childId => deleteFolder(childId));
    setFolders((prev: FolderData[]) => prev.filter((f: FolderData) => f.id !== id));
    setNotes((prev: NoteData[]) => prev.filter((n: NoteData) => n.parentId !== id));
    if (currentPath.some(p => p.id === id)) {
        setCurrentPath([]);
    }
  };

  const deleteNote = (id: string) => {
    setNotes((prev: NoteData[]) => prev.filter((n: NoteData) => n.id !== id));
    if (activeNoteId === id) setActiveNoteId(null);
  };

  const duplicateFolder = (folder: FolderData) => {
    const newFolder: FolderData = {
        ...folder,
        id: Math.random().toString(36).substring(7),
        name: `${folder.name} (Copy)`,
        createdAt: new Date(),
    };
    setFolders((prev: FolderData[]) => [...prev, newFolder]);
  };

  const duplicateNote = (note: NoteData) => {
    const newNote: NoteData = {
        ...note,
        id: Math.random().toString(36).substring(7),
        name: `${note.name} (Copy)`,
        createdAt: new Date(),
    };
    setNotes((prev: NoteData[]) => [...prev, newNote]);
  };

  const renameFolder = (id: string) => {
    const newName = prompt("Enter new name:");
    if (newName) {
        setFolders((prev: FolderData[]) => prev.map((f: FolderData) => f.id === id ? { ...f, name: newName } : f));
        setCurrentPath((prev: {id: string, name: string}[]) => prev.map(p => p.id === id ? { ...p, name: newName } : p));
    }
  };

  const renameNote = (id: string) => {
    const newName = prompt("Enter new name:");
    if (newName) {
        setNotes((prev: NoteData[]) => prev.map((n: NoteData) => n.id === id ? { ...n, name: newName } : n));
    }
  };

  const updateFolderColor = (id: string, color: string) => {
    setFolders((prev: FolderData[]) => prev.map((f: FolderData) => f.id === id ? { ...f, color } : f));
  };

  const togglePinFolder = (id: string) => {
    setFolders((prev: FolderData[]) => prev.map((f: FolderData) => f.id === id ? { ...f, isPinned: !f.isPinned } : f));
  };

  const togglePinNote = (id: string) => {
    setNotes((prev: NoteData[]) => prev.map((n: NoteData) => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
  };

  const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null;
  const currentFolders = folders.filter(f => f.parentId === currentFolderId);
  const currentNotes = notes.filter(n => n.parentId === currentFolderId);
  const activeNote = notes.find(n => n.id === activeNoteId);

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

  const FolderContextMenuWrapper = ({ folder, children }: { folder: FolderData, children: React.ReactNode }) => (
    <ContextMenu>
        <ContextMenuTrigger asChild>
            {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56 font-sans">
            <ContextMenuItem onClick={() => navigateTo([...currentPath, { id: folder.id, name: folder.name }], null)} className="gap-3">
                <SquareArrowOutUpRight size={14} className="text-[#A0A0A0]" />
                <span className="flex-1">Open</span>
                <ContextMenuShortcut>↵</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem className="gap-3 opacity-50 cursor-not-allowed">
                <Columns2 size={14} />
                <span className="flex-1">Open in new pane</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setActiveTab('chat')} className="gap-3">
                <Sparkle size={14} className="text-[#2E8C59]" />
                <span className="flex-1">Ask AI</span>
            </ContextMenuItem>
            
            <ContextMenuSeparator />
            
            <ContextMenuItem onClick={() => togglePinFolder(folder.id)} className="gap-3">
                <Pin size={14} className={cn(folder.isPinned && "text-[#328461] fill-[#328461]")} />
                <span className="flex-1">{folder.isPinned ? 'Unpin' : 'Pin'}</span>
            </ContextMenuItem>
            
            <ContextMenuSeparator />

            <ContextMenuItem onClick={() => renameFolder(folder.id)} className="gap-3">
                <Pencil size={14} className="text-[#A0A0A0]" />
                <span className="flex-1">Rename</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => duplicateFolder(folder)} className="gap-3">
                <Copy size={14} className="text-[#A0A0A0]" />
                <span className="flex-1">Duplicate</span>
                <ContextMenuShortcut>⌘D</ContextMenuShortcut>
            </ContextMenuItem>
            
            <ContextMenuSub>
                <ContextMenuSubTrigger className="gap-3">
                    <Circle size={14} style={{ color: folder.color, fill: folder.color }} />
                    <span className="flex-1">Change Color</span>
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-48">
                    {['#46A775', '#3168A0', '#6D529E', '#C24D4D', '#D18D3B', '#A0A0A0'].map(c => (
                        <ContextMenuItem 
                            key={c} 
                            onClick={() => updateFolderColor(folder.id, c)}
                            className="gap-3"
                        >
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                            <span className="text-[12px]">{c === '#46A775' ? 'Emerald' : c === '#3168A0' ? 'Blue' : c === '#6D529E' ? 'Purple' : 'Custom'}</span>
                        </ContextMenuItem>
                    ))}
                </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuItem className="gap-3 opacity-50 cursor-not-allowed">
                <Share size={14} />
                <span className="flex-1">Share</span>
            </ContextMenuItem>
            <ContextMenuItem className="gap-3 opacity-50 cursor-not-allowed">
                <FolderInput size={14} />
                <span className="flex-1">Move to</span>
            </ContextMenuItem>
            <ContextMenuItem className="gap-3 opacity-50 cursor-not-allowed">
                <Download size={14} />
                <span className="flex-1">Download</span>
            </ContextMenuItem>
            
            <ContextMenuSeparator />
            
            <ContextMenuItem className="gap-3 opacity-70">
                <Info size={14} />
                <span className="flex-1">Information</span>
            </ContextMenuItem>
            
            <ContextMenuSeparator />

            <ContextMenuItem onClick={() => deleteFolder(folder.id)} className="gap-3 text-[#FF5F5F] focus:text-[#FF5F5F] focus:bg-[#FF5F5F]/10">
                <Trash2 size={14} />
                <span className="flex-1 font-medium">Delete</span>
                <ContextMenuShortcut className="text-[#FF5F5F]/60">⌘⌫</ContextMenuShortcut>
            </ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
  );

  const NoteContextMenuWrapper = ({ note, children }: { note: NoteData, children: React.ReactNode }) => (
    <ContextMenu>
        <ContextMenuTrigger asChild>
            {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56 font-sans">
            <ContextMenuItem onClick={() => navigateTo(currentPath, note.id)} className="gap-3">
                <SquareArrowOutUpRight size={14} className="text-[#A0A0A0]" />
                <span className="flex-1">Open</span>
                <ContextMenuShortcut>↵</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem className="gap-3 opacity-50 cursor-not-allowed">
                <Columns2 size={14} />
                <span className="flex-1">Open in new pane</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setActiveTab('chat')} className="gap-3">
                <Sparkle size={14} className="text-[#2E8C59]" />
                <span className="flex-1">Ask AI</span>
            </ContextMenuItem>
            
            <ContextMenuSeparator />
            
            <ContextMenuItem onClick={() => togglePinNote(note.id)} className="gap-3">
                <Pin size={14} className={cn(note.isPinned && "text-[#328461] fill-[#328461]")} />
                <span className="flex-1">{note.isPinned ? 'Unpin' : 'Pin'}</span>
            </ContextMenuItem>
            
            <ContextMenuSeparator />

            <ContextMenuItem onClick={() => renameNote(note.id)} className="gap-3">
                <Pencil size={14} className="text-[#A0A0A0]" />
                <span className="flex-1">Rename</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => duplicateNote(note)} className="gap-3">
                <Copy size={14} className="text-[#A0A0A0]" />
                <span className="flex-1">Duplicate</span>
                <ContextMenuShortcut>⌘D</ContextMenuShortcut>
            </ContextMenuItem>
            
            <ContextMenuItem className="gap-3 opacity-50 cursor-not-allowed">
                <Share size={14} />
                <span className="flex-1">Share</span>
            </ContextMenuItem>
            <ContextMenuItem className="gap-3 opacity-50 cursor-not-allowed">
                <FolderInput size={14} />
                <span className="flex-1">Move to</span>
            </ContextMenuItem>
            <ContextMenuItem className="gap-3 opacity-50 cursor-not-allowed">
                <Download size={14} />
                <span className="flex-1">Download</span>
            </ContextMenuItem>
            
            <ContextMenuSeparator />
            
            <ContextMenuItem className="gap-3 opacity-70">
                <Info size={14} />
                <span className="flex-1">Information</span>
            </ContextMenuItem>
            
            <ContextMenuSeparator />

            <ContextMenuItem onClick={() => deleteNote(note.id)} className="gap-3 text-[#FF5F5F] focus:text-[#FF5F5F] focus:bg-[#FF5F5F]/10">
                <Trash2 size={14} />
                <span className="flex-1 font-medium">Delete</span>
                <ContextMenuShortcut className="text-[#FF5F5F]/60">⌘⌫</ContextMenuShortcut>
            </ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
  );

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
                if (item.id === 'home') {
                  navigateTo([], null);
                }
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
                            } else if (item.id === 'new-note') {
                              setIsNewNoteModalOpen(true);
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
                          onClick={() => {
                            if (item.id === 'new-folder') {
                              setIsNewFolderModalOpen(true);
                            }
                          }}
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

              {/* Folder list in Sidebar */}
              <div className="flex flex-col gap-0.5 px-1 pb-4">
                {folders.filter(f => f.parentId === null).map((folder) => (
                  <FolderContextMenuWrapper key={folder.id} folder={folder}>
                  <SidebarFolder 
                    folder={folder}
                    allFolders={folders}
                    allNotes={notes}
                    expandedIds={expandedFolderIds}
                    toggleExpand={toggleFolderExpansion}
                    currentFolderId={currentFolderId}
                    activeNoteId={activeNoteId}
                    topOptions={topWorkspaceOptions}
                    bottomOptions={bottomWorkspaceOptions}
                    FolderContextMenuWrapper={FolderContextMenuWrapper}
                    NoteContextMenuWrapper={NoteContextMenuWrapper}
                    onSelect={(f) => {
                      const pathArr: { id: string; name: string }[] = [];
                      let curr: FolderData | undefined = f;
                      while (curr) {
                        pathArr.unshift({ id: curr.id, name: curr.name });
                        curr = folders.find(p => p.id === curr?.parentId);
                      }
                      navigateTo(pathArr, null);
                      setActiveTab('home');
                    }}
                    onSelectNote={(n) => {
                        const pathArr: { id: string; name: string }[] = [];
                        let curr: FolderData | undefined = folders.find(f => f.id === n.parentId);
                        while (curr) {
                            pathArr.unshift({ id: curr.id, name: curr.name });
                            curr = folders.find(p => p.id === curr?.parentId);
                        }
                        navigateTo(pathArr, n.id);
                        setActiveTab('home');
                    }}
                    onAction={(f, actionId) => {
                        const pathArr: { id: string; name: string }[] = [];
                        let curr: FolderData | undefined = f;
                        while (curr) {
                            pathArr.unshift({ id: curr.id, name: curr.name });
                            curr = folders.find(p => p.id === curr?.parentId);
                        }
                        navigateTo(pathArr, activeNoteId);
                        
                        if (actionId === 'new-folder') {
                            setIsNewFolderModalOpen(true);
                        } else if (actionId === 'new-note') {
                            setIsNewNoteModalOpen(true);
                        } else if (actionId === 'new-chat') {
                            setActiveTab('chat');
                            setExpandedTab('chat');
                        }
                    }}
                    level={0}
                  />
                  </FolderContextMenuWrapper>
                ))}
                
                {/* Root level notes */}
                {notes.filter(n => n.parentId === null).map(note => (
                    <NoteContextMenuWrapper key={note.id} note={note}>
                    <div 
                        onClick={() => {
                            navigateTo([], note.id);
                            setActiveTab('home');
                        }}
                        className={cn(
                            "group flex items-center gap-2.5 px-2 py-1 rounded-md cursor-pointer hover:bg-accent transition-colors mx-1",
                            activeNoteId === note.id && "bg-accent"
                        )}
                    >
                        <ExactNoteIcon size={14} className="text-[#328461] shrink-0" />
                        <span className={cn(
                            "text-[13px] font-light truncate transition-colors",
                            activeNoteId === note.id ? "text-text" : "text-[#A0A0A0] group-hover:text-text"
                        )}>
                            {note.name}
                        </span>
                    </div>
                    </NoteContextMenuWrapper>
                ))}
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
          <div className="w-full h-full flex flex-col items-center relative overflow-y-auto">
              {/* Premium Browser-like Navigation Header */}
              <div className="absolute top-3 left-0 px-4 z-20 flex items-center gap-3 select-none">
                <div className="flex items-center gap-1.5">
                    <button 
                        disabled={historyIndex === 0}
                        onClick={goBack}
                        className={cn(
                            "p-1 rounded-md transition-colors",
                            historyIndex === 0 ? "text-text/10 cursor-not-allowed" : "text-text/40 hover:text-text hover:bg-white/5"
                        )}
                    >
                        <ArrowLeft size={12} strokeWidth={2.5} />
                    </button>
                    <button 
                        disabled={historyIndex >= history.length - 1}
                        onClick={goForward}
                        className={cn(
                            "p-1 rounded-md transition-colors",
                            historyIndex >= history.length - 1 ? "text-text/10 cursor-not-allowed" : "text-text/40 hover:text-text hover:bg-white/5"
                        )}
                    >
                        <ArrowRight size={12} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigateTo([], null)}>
                        <Home size={12} className="text-text/30 group-hover:text-text" />
                        <span className="text-[14px] font-normal text-text/60 group-hover:text-text">Workspace</span>
                    </div>

                    {(currentPath.length > 0 || activeNoteId) && (
                        <>
                            <span className="text-text/10 text-[16px] font-light">/</span>
                            <div className="flex items-center gap-2">
                                {activeNoteId && activeNote ? (
                                    <>
                                        <div className="w-[18px] h-[18px] bg-[#297A53] rounded-[4px] flex items-center justify-center shadow-sm">
                                            <ExactNoteIcon size={11} className="text-white" strokeWidth={3} />
                                        </div>
                                        <span className="text-[14px] font-medium text-[#ECECEC]">{activeNote.name}</span>
                                    </>
                                ) : (
                                    <>
                                        <Folder 
                                            size={16} 
                                            style={{ color: currentPath[currentPath.length - 1].id ? (folders.find(f => f.id === currentPath[currentPath.length - 1].id)?.color || '#46A775') : '#46A775' }} 
                                            fill={(folders.find(f => f.id === currentPath[currentPath.length - 1].id)?.color || '#46A775')} 
                                        />
                                        <span className="text-[14px] font-medium text-[#ECECEC]">{currentPath[currentPath.length - 1].name}</span>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
              </div>

              {/* Top Nav Block (Search & Filters) */}
              <div className="w-full max-w-[1024px] pt-20 px-8 flex flex-col gap-5 relative z-10">

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

              {/* Center Empty State / Folder & Note Grid */}
              <div className="w-full max-w-[1024px] flex-1 flex flex-col pt-8 px-8">
                {activeNoteId && activeNote ? (
                    <NoteEditor 
                        note={activeNote} 
                        onBack={() => setActiveNoteId(null)}
                        onSave={saveNote}
                    />
                ) : (
                    <>

                {currentFolders.length > 0 || currentNotes.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
                        {currentFolders.map((folder) => (
                             <FolderContextMenuWrapper key={folder.id} folder={folder}>
                             <div 
                                className="group flex flex-col items-center gap-3 cursor-pointer"
                                onClick={() => navigateTo([...currentPath, { id: folder.id, name: folder.name }], null)}
                            >
                                <div className="w-full aspect-square rounded-[24px] bg-[#1A1A1A] border border-white/[0.03] flex items-center justify-center relative overflow-hidden group-hover:border-white/10 transition-all duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Folder 
                                        size={64} 
                                        style={{ color: folder.color, fill: folder.color }} 
                                        className="drop-shadow-lg"
                                    />
                                </div>
                                <div className="w-full flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: folder.color }} />
                                        <span className="text-[13px] font-medium text-[#ECECEC] truncate">{folder.name}</span>
                                    </div>
                                    <span className="text-[11px] text-text/30 font-light whitespace-nowrap">Now</span>
                                </div>
                             </div>
                             </FolderContextMenuWrapper>
                        ))}

                        {currentNotes.map((note) => (
                            <NoteContextMenuWrapper key={note.id} note={note}>
                            <div 
                                className="group flex flex-col items-center gap-3 cursor-pointer"
                                onClick={() => navigateTo(currentPath, note.id)}
                            >
                                <div className="w-full aspect-square rounded-[24px] bg-[#1A1A1A] border border-white/[0.03] flex items-center justify-center relative overflow-hidden group-hover:border-white/10 transition-all duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {/* Premium Note Sheet Design matching 2nd pic */}
                                    <div className="w-[70%] h-[80%] bg-[#121212] rounded-[14px] border border-white/[0.03] p-4 flex flex-col gap-2.5 opacity-40 group-hover:opacity-60 transition-all duration-300 transform group-hover:scale-[1.02]">
                                        <div className="h-1 w-full bg-[#ECECEC]/80 rounded-full" />
                                        <div className="h-1 w-[60%] bg-[#ECECEC]/80 rounded-full" />
                                        <div className="h-1 w-full bg-[#ECECEC]/80 rounded-full" />
                                        
                                        <div className="mt-4 flex flex-col gap-2.5">
                                            <div className="h-1 w-[85%] bg-[#ECECEC]/40 rounded-full" />
                                            <div className="h-1 w-full bg-[#ECECEC]/40 rounded-full" />
                                            <div className="h-1 w-[40%] bg-[#ECECEC]/40 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <ExactNoteIcon size={12} className="text-[#328461]" />
                                        <span className="text-[13px] font-medium text-[#ECECEC] truncate">{note.name}</span>
                                    </div>
                                    <span className="text-[11px] text-text/30 font-light whitespace-nowrap">Now</span>
                                </div>
                            </div>
                            </NoteContextMenuWrapper>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center pointer-events-none mt-12">
                        <div className="w-[72px] h-[72px] rounded-full bg-[#1A1A1A] border border-white/[0.03] flex items-center justify-center mb-6 relative pointer-events-auto shadow-sm cursor-pointer" onClick={() => setIsNewNoteModalOpen(true)}>
                            <ExactNoteIcon size={34} className="text-[#328461]" />
                            <Plus size={16} className="absolute top-[8px] right-[4px] text-[#46A775]" strokeWidth={3.5} />
                        </div>
                        
                        <h2 className="text-[28px] font-serif tracking-tight text-[#ECECEC] mb-1.5 pointer-events-auto text-center">
                            {currentPath.length > 0 ? "Empty folder" : "Drop files here"}
                        </h2>
                        <p className="text-[13px] text-text/30 mb-7 tracking-wide font-light pointer-events-auto text-center">
                            {currentPath.length > 0 
                                ? "This folder is currently empty. Start organizing your workspace." 
                                : "Or create a new item in this folder"}
                        </p>
                        
                        <div className="flex items-center gap-3 pointer-events-auto">
                            <button 
                                onClick={() => setIsNewNoteModalOpen(true)}
                                className="px-4 py-2 rounded-full border border-white/[0.08] text-[12px] font-light text-[#A0A0A0] hover:text-[#E0E0E0] hover:bg-white/5 transition-colors flex items-center gap-2 bg-transparent"
                            >
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
                )}
                    </>
                )}
             </div>
          </div>
        ) : (
          <div className="text-text/10 text-sm italic select-none pointer-events-none">
            {/* Pure minimal space */}
          </div>
        )}
      </main>

      <NewNoteModal 
        isOpen={isNewNoteModalOpen}
        onClose={() => setIsNewNoteModalOpen(false)}
        onCreate={createNote}
        currentPath={currentPath}
      />
      <NewFolderModal 
        isOpen={isNewFolderModalOpen}
        onClose={() => setIsNewFolderModalOpen(false)}
        onCreate={createFolder}
        currentPath={currentPath}
      />
    </div>
  );
}

// Recursive Sidebar Folder Component
function SidebarFolder({ 
    folder, 
    allFolders, 
    allNotes,
    expandedIds, 
    toggleExpand, 
    currentFolderId, 
    activeNoteId,
    onSelect, 
    onAction,
    onSelectNote,
    topOptions,
    bottomOptions,
    FolderContextMenuWrapper,
    NoteContextMenuWrapper,
    level 
}: { 
    folder: FolderData; 
    allFolders: FolderData[]; 
    expandedIds: Set<string>; 
    toggleExpand: (id: string, e?: React.MouseEvent) => void;
    currentFolderId: string | null;
    onSelect: (f: FolderData) => void;
    onAction: (f: FolderData, actionId: string) => void;
    onSelectNote: (n: NoteData) => void;
    allNotes: NoteData[];
    activeNoteId: string | null;
    topOptions: any[];
    bottomOptions: any[];
    FolderContextMenuWrapper: React.ComponentType<{ folder: FolderData, children: React.ReactNode }>;
    NoteContextMenuWrapper: React.ComponentType<{ note: NoteData, children: React.ReactNode }>;
    level: number;
}) {
    const children = allFolders.filter(f => f.parentId === folder.id);
    const folderNotes = allNotes.filter(n => n.parentId === folder.id);
    const isExpanded = expandedIds.has(folder.id);
    const isActive = currentFolderId === folder.id;

    return (
        <div className="flex flex-col">
        <FolderContextMenuWrapper folder={folder}>
            <div 
                onClick={() => onSelect(folder)}
                className={cn(
                    "group flex items-center justify-between gap-2 px-2 py-1 rounded-md cursor-pointer hover:bg-accent transition-colors relative",
                    isActive && "bg-accent"
                )}
                style={{ paddingLeft: `${8 + level * 12}px` }}
            >
                <div className="flex items-center gap-1.5 overflow-hidden flex-1">
                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                        {children.length > 0 && (
                            <button 
                                onClick={(e) => toggleExpand(folder.id, e)}
                                className="p-0.5 hover:bg-white/5 rounded transition-transform duration-200"
                                style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                            >
                                <ChevronRight size={12} className="text-text/40" />
                            </button>
                        )}
                    </div>
                    <Folder 
                        size={14} 
                        style={{ color: folder.color, fill: folder.color }} 
                        className="shrink-0"
                    />
                    <span className={cn(
                        "text-[13px] font-light truncate transition-colors",
                        isActive ? "text-text" : "text-[#A0A0A0] group-hover:text-text"
                    )}>
                        {folder.name}
                    </span>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-white/5 rounded-md transition-colors">
                        <LayoutGrid size={11} className="text-text/30 hover:text-text" />
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button 
                                className="p-1 hover:bg-white/5 rounded-md transition-colors outline-none data-[state=open]:bg-white/5"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Plus size={11} className="text-text/30 hover:text-text" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-48 bg-[#1A1A1A] border-accent/60 text-text p-1 rounded-lg shadow-2xl flex flex-col gap-0.5 z-[200] font-sans"
                            align="start"
                            side="right"
                            sideOffset={10}
                        >
                            {topOptions.map((item) => (
                                <DropdownMenuItem
                                    key={item.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAction(folder, item.id);
                                    }}
                                    className="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer focus:bg-accent focus:text-text text-[#E0E0E0] rounded-md outline-none transition-colors"
                                >
                                    <div className={cn("w-4 h-4 rounded-[3px] flex items-center justify-center shrink-0", item.colorBg)}>
                                        <item.icon size={9} className="text-white" strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[12px] font-light tracking-wide">{item.label}</span>
                                </DropdownMenuItem>
                            ))}
                            
                            <DropdownMenuSeparator className="bg-[#333333] my-1" />

                            {bottomOptions.map((item) => (
                                <DropdownMenuItem
                                    key={item.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAction(folder, item.id);
                                    }}
                                    className="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer focus:bg-accent focus:text-[#E0E0E0] text-[#A0A0A0] rounded-md outline-none transition-colors"
                                >
                                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                        <item.icon size={11} className="text-[#A0A0A0]" strokeWidth={1.25} />
                                    </div>
                                    <span className="text-[12px] font-light tracking-wide">{item.label}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </FolderContextMenuWrapper>

            <AnimatePresence>
                {isExpanded && (children.length > 0 || folderNotes.length > 0) && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        {children.map(child => (
                            <SidebarFolder 
                                key={child.id}
                                folder={child}
                                allFolders={allFolders}
                                allNotes={allNotes}
                                expandedIds={expandedIds}
                                toggleExpand={toggleExpand}
                                currentFolderId={currentFolderId}
                                activeNoteId={activeNoteId}
                                onSelect={onSelect}
                                onAction={onAction}
                                onSelectNote={onSelectNote}
                                topOptions={topOptions}
                                bottomOptions={bottomOptions}
                                FolderContextMenuWrapper={FolderContextMenuWrapper}
                                NoteContextMenuWrapper={NoteContextMenuWrapper}
                                level={level + 1}
                            />
                        ))}
                        {folderNotes.map(note => (
                            <NoteContextMenuWrapper key={note.id} note={note}>
                                <div 
                                    onClick={() => onSelectNote(note)}
                                    className={cn(
                                        "group flex items-center gap-2.5 px-2 py-1 rounded-md cursor-pointer hover:bg-accent transition-colors",
                                        activeNoteId === note.id && "bg-accent"
                                    )}
                                    style={{ paddingLeft: `${24 + level * 12}px` }}
                                >
                                    <ExactNoteIcon size={13} className="text-[#328461] shrink-0" />
                                    <span className={cn(
                                        "text-[13px] font-light truncate transition-colors",
                                        activeNoteId === note.id ? "text-text" : "text-[#A0A0A0] group-hover:text-text"
                                    )}>
                                        {note.name}
                                    </span>
                                </div>
                            </NoteContextMenuWrapper>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
