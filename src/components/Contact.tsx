export default function Contact() {
  const schedule = [
    { day: "SEGUNDA - SEXTA", hours: "08H – 18H" },
    { day: "SÁBADO", hours: "08H – 16H" },
    { day: "DOMINGO", hours: "FECHADO" }
  ];

  return (
    <section id="contato" className="py-32 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <h2 className="text-4xl md:text-6xl font-light text-[#1A1A1A] font-['Cormorant_Garamond'] mb-12">
              Fale com <br />
              <span className="italic font-bold text-[#8B7355]">nossa equipe.</span>
            </h2>
            
            <div className="space-y-10">
              <div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-[#8B7355] mb-2 uppercase font-['DM_Sans']">ENDEREÇO</div>
                <div className="text-[#1A1A1A] font-light text-lg font-['DM_Sans'] leading-relaxed">
                  Estrada do Campinho, 4066<br />
                  Cosmos, Rio de Janeiro — RJ
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-[#8B7355] mb-2 uppercase font-['DM_Sans']">CONTATOS</div>
                <div className="flex flex-col gap-2">
                  <a href="https://wa.me/5521969320071" className="text-[#1A1A1A] font-light text-lg font-['DM_Sans'] hover:text-[#C41E1E] transition-colors">(21) 96932-0071</a>
                  <a href="mailto:veiculosbcoecia@gmail.com" className="text-[#1A1A1A] font-light text-lg font-['DM_Sans'] hover:text-[#C41E1E] transition-colors">veiculosbcoecia@gmail.com</a>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-[#8B7355] mb-2 uppercase font-['DM_Sans']">REDES SOCIAIS</div>
                <a href="https://instagram.com/thayssaveiculosbco" className="text-[#1A1A1A] font-light text-lg font-['DM_Sans'] hover:text-[#C41E1E] transition-colors">@thayssaveiculosbco</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="bg-[#F5F4F0] p-8 md:p-12 rounded-[8px] border border-[#E5E0D8]">
              <h4 className="text-2xl font-bold text-[#1A1A1A] font-['Cormorant_Garamond'] mb-8 italic">Horários de Atendimento</h4>
              <div className="space-y-6">
                {schedule.map((item, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b border-[#E5E0D8] last:border-0 last:pb-0">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#8B7355] font-['DM_Sans'] uppercase">{item.day}</span>
                    <span className={`text-base font-light font-['DM_Sans'] ${item.hours === 'FECHADO' ? 'text-[#C41E1E]' : 'text-[#1A1A1A]'}`}>
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 
              Substitua o src do iframe pelo link real do Google Maps da loja para posição exata:
              Maps → Compartilhar → Incorporar um mapa 
            */}
            <div className="w-full">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.5!2d-43.6!3d-22.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zEstrada+do+Campinho+4066+Cosmos+Rio+de+Janeiro!5e0!3m2!1spt!2sbr!4v1"
                width="100%" 
                height="300" 
                style={{
                  borderRadius: "8px",
                  border: "1px solid #E5E0D8",
                  filter: "grayscale(20%)"
                }}
                allowFullScreen={true}
                loading="lazy"
                title="Google Maps Location - Thayssa Veículos"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
