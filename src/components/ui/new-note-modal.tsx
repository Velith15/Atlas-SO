import React, { useState } from "react";
import { X, Check, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface NewNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, parentId: string | null) => void;
    currentPath: { id: string; name: string }[];
}

export function NewNoteModal({ isOpen, onClose, onCreate, currentPath }: NewNoteModalProps) {
    const [name, setName] = useState("");

    if (!isOpen) return null;

    const handleCreate = () => {
        if (name.trim()) {
            onCreate(name.trim(), currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null);
            setName("");
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                            <h2 className="text-[17px] font-medium text-[#ECECEC] font-serif tracking-tight">New Note</h2>
                            <button 
                                onClick={onClose}
                                className="p-1 hover:bg-white/5 rounded-md text-text/40 hover:text-text transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 flex flex-col gap-6">
                            {/* Input Field */}
                            <div className="relative">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Enter note name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-[15px] text-[#E0E0E0] placeholder:text-text/20 focus:outline-none focus:border-white/20 transition-all"
                                />
                            </div>

                            {/* Save to logic */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-[13px] font-light text-text/40">Save to</span>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-[8px] cursor-default">
                                        <span className="text-[13px] font-medium text-[#E0E0E0]">
                                            {currentPath.length > 0 ? currentPath[currentPath.length - 1].name : "Home"}
                                        </span>
                                        <Monitor size={14} className="text-text/40" />
                                    </div>
                                </div>

                                <button
                                    onClick={handleCreate}
                                    disabled={!name.trim()}
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                                        name.trim() 
                                            ? "bg-[#297A53] text-white shadow-lg shadow-[#297A53]/20" 
                                            : "bg-white/5 text-text/20 cursor-not-allowed"
                                    )}
                                >
                                    <Check size={20} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
