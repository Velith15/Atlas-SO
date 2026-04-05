import React, { useState, useEffect } from "react";
import { ChevronLeft, Save, Share2, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

interface NoteEditorProps {
    note: { id: string; name: string; content: string };
    onBack: () => void;
    onSave: (id: string, content: string) => void;
}

export function NoteEditor({ note, onBack, onSave }: NoteEditorProps) {
    const [content, setContent] = useState(note.content);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSave(note.id, content);
        }, 1000);
        return () => clearTimeout(timer);
    }, [content, note.id, onSave]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full flex flex-col bg-background font-sans"
        >
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="p-2 hover:bg-white/5 rounded-full text-text/40 hover:text-text transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex flex-col">
                        <h2 className="text-[15px] font-medium text-[#ECECEC] line-clamp-1">{note.name}</h2>
                        <span className="text-[11px] text-text/30 font-light italic">Editing now...</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#297A53] text-[12px] font-medium text-white hover:bg-[#2F8B5E] transition-colors">
                        <Save size={14} />
                        Save
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-full text-text/40 hover:text-text transition-colors">
                        <Share2 size={16} />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-full text-text/40 hover:text-text transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 w-full max-w-4xl mx-auto px-12 py-12">
                <textarea
                    autoFocus
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing..."
                    className="w-full h-full bg-transparent border-none outline-none resize-none text-[17px] text-[#E0E0E0] placeholder:text-text/10 leading-relaxed font-light"
                />
            </div>
        </motion.div>
    );
}
