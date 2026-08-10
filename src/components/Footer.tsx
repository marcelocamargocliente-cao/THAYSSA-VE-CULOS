export default function Footer() {
  return (
    <footer className="bg-white py-20 border-t border-[#E5E0D8]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16">
          <div>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-[#1A1A1A] font-bold text-3xl md:text-4xl font-['DM_Sans'] leading-none tracking-tight">THAYSSA</span>
              <span className="text-[#1A1A1A] font-light text-[12px] tracking-[0.4em] font-['DM_Sans'] uppercase pt-1">VEÍCULOS</span>
            </div>
            <p className="text-[#6B6B6B] text-[13px] font-light font-['DM_Sans'] max-w-xs leading-relaxed">
              Seleção especializada em carros e motos seminovos. <br />
              Referência em qualidade e transparência no Rio de Janeiro.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-20">
            <div>
              <h5 className="text-[10px] font-bold tracking-[0.2em] text-[#1A1A1A] mb-6 uppercase font-['DM_Sans']">Navegação</h5>
              <ul className="space-y-4 text-[13px] font-light text-[#6B6B6B] font-['DM_Sans']">
                <li><a href="#estoque" className="hover:text-[#C41E1E] transition-colors">Estoque</a></li>
                <li><a href="#financiamento" className="hover:text-[#C41E1E] transition-colors">Financiamento</a></li>
                <li><a href="#sobre" className="hover:text-[#C41E1E] transition-colors">Sobre</a></li>
                <li><a href="#contato" className="hover:text-[#C41E1E] transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[10px] font-bold tracking-[0.2em] text-[#1A1A1A] mb-6 uppercase font-['DM_Sans']">Social</h5>
              <ul className="space-y-4 text-[13px] font-light text-[#6B6B6B] font-['DM_Sans']">
                <li><a href="https://instagram.com/thayssaveiculosbco" className="hover:text-[#C41E1E] transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-[#E5E0D8] flex flex-col md:flex-row justify-between gap-6 text-[10px] tracking-[0.1em] font-medium text-[#8B7355] font-['DM_Sans'] uppercase">
          <div>© 2025 THAYSSA VEÍCULOS BCO&CIA.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">Privacidade</a>
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
