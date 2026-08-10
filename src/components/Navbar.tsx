import { motion } from "motion/react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[999] bg-white border-b border-[#E5E0D8] px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <img
            src="https://kvywklyujlnkotnckivd.supabase.co/storage/v1/object/public/fotos-galeria/logo_thayssa.jpg"
            alt="Logo Thayssa Veículos BCO&CIA"
            className="h-7 w-7 rounded-full object-cover border border-[#E5E0D8]"
          />
          <div className="flex items-baseline gap-1">
            <span className="text-[#1A1A1A] font-bold text-[14px] font-['DM_Sans'] leading-none tracking-tight">THAYSSA</span>
            <span className="text-[#1A1A1A] font-light text-[9px] tracking-[0.15em] font-['DM_Sans'] uppercase pt-0.5">VEÍCULOS</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[#8B7355] text-[10px] font-medium tracking-[0.2em] font-['DM_Sans'] uppercase">
          <a href="#estoque" className="hover:text-[#C41E1E] transition-colors">Estoque</a>
          <a href="#galeria" className="hover:text-[#C41E1E] transition-colors">Galeria</a>
          <a href="#financiamento" className="hover:text-[#C41E1E] transition-colors">Financiamento</a>
          <a href="#sobre" className="hover:text-[#C41E1E] transition-colors">Sobre</a>
          <a href="#contato" className="hover:text-[#C41E1E] transition-colors">Contato</a>
        </div>

        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href="https://wa.me/5521969320071"
          className="border border-[#C41E1E] text-[#C41E1E] px-4 py-1.5 rounded-none text-[10px] font-medium tracking-[0.2em] font-['DM_Sans'] uppercase transition-all hover:bg-[#C41E1E] hover:text-white"
        >
          Falar no WhatsApp
        </motion.a>
      </div>
    </nav>
  );
}
