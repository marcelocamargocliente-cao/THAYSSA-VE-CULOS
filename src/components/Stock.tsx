import { useState, useEffect, useRef, TouchEvent } from "react";
import { supabase, VehicleDB } from "../lib/supabase";

const FALLBACK_VEHICLES: VehicleDB[] = [
  { id:"1", nome:"Chevrolet Onix", tipo:"carro", marca:"Chevrolet", modelo:"Onix", ano:2021, km:45000, preco:68900, preco_exibicao:"R$ 68.900", destaque:true, ativo:true, ordem:1, foto_url:null, whatsapp_msg:"Olá! Tenho interesse no Chevrolet Onix 2021." },
  { id:"2", nome:"Honda CB 300R", tipo:"moto", marca:"Honda", modelo:"CB 300R", ano:2022, km:12000, preco:24900, preco_exibicao:"R$ 24.900", destaque:true, ativo:true, ordem:2, foto_url:null, whatsapp_msg:"Olá! Tenho interesse na Honda CB 300R 2022." },
  { id:"3", nome:"VW Polo", tipo:"carro", marca:"Volkswagen", modelo:"Polo", ano:2020, km:38000, preco:72500, preco_exibicao:"R$ 72.500", destaque:false, ativo:true, ordem:3, foto_url:null, whatsapp_msg:"Olá! Tenho interesse no VW Polo 2020." },
  { id:"4", nome:"Yamaha Factor 150", tipo:"moto", marca:"Yamaha", modelo:"Factor 150", ano:2023, km:8000, preco:14900, preco_exibicao:"R$ 14.900", destaque:false, ativo:true, ordem:4, foto_url:null, whatsapp_msg:"Olá! Tenho interesse na Yamaha Factor 150." },
  { id:"5", nome:"Jeep Renegade", tipo:"suv", marca:"Jeep", modelo:"Renegade", ano:2019, km:62000, preco:89900, preco_exibicao:"R$ 89.900", destaque:true, ativo:true, ordem:5, foto_url:null, whatsapp_msg:"Olá! Tenho interesse no Jeep Renegade 2019." },
  { id:"6", nome:"Fiat Strada", tipo:"pickup", marca:"Fiat", modelo:"Strada", ano:2022, km:28000, preco:94900, preco_exibicao:"R$ 94.900", destaque:false, ativo:true, ordem:6, foto_url:null, whatsapp_msg:"Olá! Tenho interesse na Fiat Strada 2022." },
];

export default function Stock() {
  const [vehicles, setVehicles] = useState<VehicleDB[]>(FALLBACK_VEHICLES);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchResumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveredRef = useRef<boolean>(false);

  // Buscar dados do Supabase
  useEffect(() => {
    const fetchVehicles = async () => {
      const { data, error } = await supabase
        .from('estoque')
        .select('*')
        .eq('ativo', true)
        .order('ordem');
      if (!error && data && data.length > 0) setVehicles(data);
      setLoading(false);
    };
    fetchVehicles();

    // Realtime: atualiza quando admin muda algo
    const channel = supabase
      .channel('estoque-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'estoque' }, fetchVehicles)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const N = vehicles.length;
  const extended = [...vehicles, ...vehicles, ...vehicles];

  useEffect(() => {
    setCurrentIndex(N);
  }, [N]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isTransitioning) {
      const t = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(t);
    }
  }, [isTransitioning]);

  const stopAutoplay = () => {
    if (autoplayTimerRef.current) { clearInterval(autoplayTimerRef.current); autoplayTimerRef.current = null; }
    if (touchResumeTimerRef.current) { clearTimeout(touchResumeTimerRef.current); touchResumeTimerRef.current = null; }
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (isHoveredRef.current) return;
    autoplayTimerRef.current = setInterval(() => nextSlide(), 3500);
  };

  useEffect(() => { startAutoplay(); return () => stopAutoplay(); }, [N]);

  const nextSlide = () => { setIsTransitioning(true); setCurrentIndex(p => p + 1); };
  const prevSlide = () => { setIsTransitioning(true); setCurrentIndex(p => p - 1); };

  const handleTransitionEnd = () => {
    if (currentIndex >= 2 * N) { setIsTransitioning(false); setCurrentIndex(currentIndex - N); }
    else if (currentIndex < N) { setIsTransitioning(false); setCurrentIndex(currentIndex + N); }
  };

  const handleTouchStart = (e: TouchEvent) => { stopAutoplay(); touchStartX.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e: TouchEvent) => { touchEndX.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => {
    if (touchStartX.current && touchEndX.current) {
      const d = touchStartX.current - touchEndX.current;
      if (d > 50) nextSlide(); else if (d < -50) prevSlide();
    }
    touchStartX.current = null; touchEndX.current = null;
    stopAutoplay();
    touchResumeTimerRef.current = setTimeout(() => startAutoplay(), 5000);
  };

  const activeDotIndex = ((currentIndex % N) + N) % N;
  const goToDot = (idx: number) => {
    setIsTransitioning(true);
    const base = Math.floor(currentIndex / N) * N;
    setCurrentIndex(base + idx);
  };

  const isMoto = (v: VehicleDB) => v.tipo === 'moto';
  const kmDisplay = (v: VehicleDB) => `${v.km.toLocaleString('pt-BR')} km`;
  const waMsg = (v: VehicleDB) => encodeURIComponent(v.whatsapp_msg || `Olá! Tenho interesse no ${v.nome} ${v.ano}.`);

  return (
    <section id="estoque" className="py-24 bg-[#F5F4F0] overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-[#8B7355] text-[11px] font-medium tracking-[0.2em] font-['DM_Sans'] uppercase mb-2 block">
              QUALIDADE & PROCEDÊNCIA
            </span>
            <h2 className="text-4xl md:text-6xl font-light text-[#1A1A1A] font-['Cormorant_Garamond']">
              Estoque <span className="italic font-bold text-[#C41E1E]">selecionado.</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 self-end md:self-auto">
            <button onClick={() => { prevSlide(); startAutoplay(); }} aria-label="Anterior"
              className="w-11 h-11 rounded-full bg-white border border-[#E5E0D8] flex items-center justify-center text-[#1A1A1A] hover:bg-[#F5F4F0] transition-all cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button onClick={() => { nextSlide(); startAutoplay(); }} aria-label="Próximo"
              className="w-11 h-11 rounded-full bg-white border border-[#E5E0D8] flex items-center justify-center text-[#1A1A1A] hover:bg-[#F5F4F0] transition-all cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#C41E1E] border-t-transparent rounded-full animate-spin"/>
          </div>
        )}

        {!loading && (
          <>
            <div className="overflow-hidden w-full py-2"
              onMouseEnter={() => { isHoveredRef.current = true; stopAutoplay(); }}
              onMouseLeave={() => { isHoveredRef.current = false; startAutoplay(); }}
              onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
              <div className="flex"
                style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`, transition: isTransitioning ? "transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)" : "none" }}
                onTransitionEnd={handleTransitionEnd}>
                {extended.map((v, i) => (
                  <div key={i} className="flex-shrink-0 px-3" style={{ width: `${100 / visibleCards}%` }}>
                    <div className="bg-white border border-[#E5E0D8] rounded-[8px] p-5 flex flex-col justify-between h-full group hover:-translate-y-1 hover:border-[#C41E1E] transition-all duration-300">
                      <div>
                        <div className="bg-[#F0EDE8] aspect-[4/3] rounded-[6px] mb-5 relative flex items-center justify-center overflow-hidden">
                          {v.foto_url ? (
                            <img src={v.foto_url} alt={v.nome} className="w-full h-full object-cover"/>
                          ) : isMoto(v) ? (
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9C0B4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/>
                              <path d="M15 6h2l2 4"/><path d="M12 17.5V14l-3-3 4-3 2 3h3.5"/>
                            </svg>
                          ) : (
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9C0B4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.2 1 12.1 1 13v3c0 .6.4 1 1 1h2"/>
                              <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
                            </svg>
                          )}
                          <span className="absolute top-3 left-3 bg-[#F0EDE8] text-[#1A1A1A] text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-[4px] uppercase font-['DM_Sans']">
                            {v.tipo.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-['Cormorant_Garamond'] font-semibold text-[18px] text-[#1A1A1A] mb-1">{v.nome}</h3>
                        <p className="font-['DM_Sans'] font-light text-[12px] text-[#9B8E7E] mb-4">{kmDisplay(v)} · {v.ano}</p>
                      </div>
                      <div>
                        <div className="font-['Playfair_Display'] font-bold italic text-[1.3rem] text-[#8B7355] mb-4">{v.preco_exibicao}</div>
                        <a href={`https://wa.me/5521969320071?text=${waMsg(v)}`} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#C41E1E] text-[13px] font-medium font-['DM_Sans'] hover:underline">
                          Tenho interesse →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: N }).map((_, idx) => (
                <button key={idx} onClick={() => goToDot(idx)} aria-label={`Slide ${idx + 1}`}
                  className={`transition-all duration-300 cursor-pointer ${activeDotIndex === idx ? "w-[18px] h-[6px] bg-[#C41E1E] rounded-full" : "w-[6px] h-[6px] bg-[#E5E0D8] rounded-full hover:bg-[#C9C0B4]"}`}/>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
