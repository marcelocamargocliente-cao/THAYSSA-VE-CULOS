import { motion } from "motion/react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[999] bg-white border-b border-[#E5E0D8] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="https://kvywklyujlnkotnckivd.supabase.co/storage/v1/object/public/fotos-galeria/logo_thayssa.jpg"
            alt="Logo Thayssa Veículos BCO&CIA"
            className="h-9 w-9 rounded-full object-cover border border-[#E5E0D8]"
          />
          <div className="flex items-baseline gap-1.5">
            <span className="text-[#1A1A1A] font-bold text-[18px] font-['DM_Sans'] leading-none tracking-tight">THAYSSA</span>
            <span className="text-[#1A1A1A] font-light text-[11px] tracking-[0.15em] font-['DM_Sans'] uppercase pt-1">VEÍCULOS</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[#8B7355] text-[11px] font-medium tracking-[0.2em] font-['DM_Sans'] uppercase">
          <a href="#estoque" className="hover:text-[#C41E1E] transition-colors">Estoque</a>
          <a href="#financiamento" className="hover:text-[#C41E1E] transition-colors">Financiamento</a>
          <a href="#sobre" className="hover:text-[#C41E1E] transition-colors">Sobre</a>
          <a href="#contato" className="hover:text-[#C41E1E] transition-colors">Contato</a>
        </div>

        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href="https://wa.me/5521969320071"
          className="border border-[#C41E1E] text-[#C41E1E] px-5 py-2 rounded-none text-[11px] font-medium tracking-[0.2em] font-['DM_Sans'] uppercase transition-all hover:bg-[#C41E1E] hover:text-white"
        >
          Falar no WhatsApp
        </motion.a>
      </div>
    </nav>
  );
}
