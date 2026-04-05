import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ModelInfo {
    name: string;
    description: string;
    speed: string;
    intelligence: string;
    creditCost: string;
    context: string;
}

interface ModelInfoCardProps {
    info: ModelInfo;
    className?: string;
    icon?: React.ReactNode;
}

const StatBox = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-accent/40 rounded-lg p-2 flex flex-col gap-0.5 border border-white/5">
        <span className="text-[10px] text-text/40 font-medium uppercase tracking-tight">{label}</span>
        <span className="text-sm text-text font-semibold">{value}</span>
    </div>
);

export const ModelInfoCard: React.FC<ModelInfoCardProps> = ({ info, className, icon }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
                "w-72 bg-[#1C1C1C] border border-white/10 rounded-xl p-4 shadow-2xl z-[100] flex flex-col gap-4 antialiased",
                className
            )}
        >
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/50 flex items-center justify-center shrink-0 border border-white/5">
                    {icon}
                </div>
                <h3 className="text-base font-semibold text-text tracking-tight">{info.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <StatBox label="Speed" value={info.speed} />
                <StatBox label="Intelligence" value={info.intelligence} />
                <StatBox label="Credit Cost" value={info.creditCost} />
                <StatBox label="Context" value={info.context} />
            </div>

            <p className="text-xs text-text/60 leading-relaxed font-medium">
                {info.description}
            </p>
        </motion.div>
    );
};
