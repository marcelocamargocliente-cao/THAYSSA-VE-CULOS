import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <>
      {/* Floating Button (Desktop + Mobile) */}
      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href="https://wa.me/5521969320071"
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[998] bg-[#C41E1E] text-white p-5 rounded-none shadow-2xl flex items-center justify-center"
      >
        <MessageCircle size={24} />
      </motion.a>

      {/* Sticky CTA (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-[#E5E0D8] p-4 flex gap-4">
        <a 
          href="#estoque"
          className="flex-1 border border-[#1A1A1A] text-[#1A1A1A] py-4 text-[11px] font-bold tracking-[0.2em] uppercase font-['DM_Sans'] flex items-center justify-center"
        >
          Estoque
        </a>
        <a 
          href="https://wa.me/5521969320071"
          className="flex-1 bg-[#1A1A1A] text-white py-4 text-[11px] font-bold tracking-[0.2em] uppercase font-['DM_Sans'] flex items-center justify-center"
        >
          WhatsApp
        </a>
      </div>
    </>
  );
}
