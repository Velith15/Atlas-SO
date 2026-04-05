import React, { useState } from "react";
import { X, Check, Monitor, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface NewFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, color: string, parentId: string | null) => void;
    currentPath: { id: string; name: string }[];
}

const FOLDER_COLORS = [
    "#46A775", // Green
    "#608CBA", // Blue
    "#9580FF", // Purple
    "#D8829D", // Pink
    "#B08B7A", // Brown
    "#D9806C", // Orange
    "#E2B276", // Yellow
    "#999999", // Grey
];

export function NewFolderModal({ isOpen, onClose, onCreate, currentPath }: NewFolderModalProps) {
    const [name, setName] = useState("");
    const [selectedColor, setSelectedColor] = useState(FOLDER_COLORS[0]);

    if (!isOpen) return null;

    const handleCreate = () => {
        if (name.trim()) {
            onCreate(name.trim(), selectedColor, currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null);
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
                            <h2 className="text-[17px] font-medium text-[#ECECEC] font-serif tracking-tight">New Folder</h2>
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
                                    placeholder="Enter folder name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-[15px] text-[#E0E0E0] placeholder:text-text/20 focus:outline-none focus:border-white/20 transition-all"
                                />
                            </div>

                            {/* Color Picker */}
                            <div className="flex flex-col gap-3">
                                <label className="text-[13px] font-light text-text/40">Color</label>
                                <div className="flex items-center gap-3">
                                    {FOLDER_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={cn(
                                                "w-7 h-7 rounded-full transition-all duration-200 relative flex items-center justify-center",
                                                selectedColor === color ? "ring-2 ring-offset-2 ring-offset-[#111111] ring-opacity-50" : "hover:scale-110"
                                            )}
                                            style={{ 
                                                backgroundColor: color,
                                                "--tw-ring-color": color 
                                            } as React.CSSProperties}
                                        >
                                            {selectedColor === color && (
                                                <Check size={14} className="text-white" strokeWidth={3} />
                                            )}
                                        </button>
                                    ))}
                                </div>
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
