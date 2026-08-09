import { useState, useEffect, useRef, useCallback } from "react";
import { supabase, GaleriaDB } from "../lib/supabase";

const ITEMS_PER_PAGE = 6;
const INTERVAL_MS = 8000;

// Pré-carrega um array de URLs de imagens e resolve quando todas estiverem prontas
function preloadImages(urls: string[]): Promise<void> {
  return Promise.all(
    urls.map(url => new Promise<void>(resolve => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // resolve mesmo se falhar — não bloqueia
      img.src = url;
    }))
  ).then(() => undefined);
}

export default function GalleryLightbox() {
  const [allItems, setAllItems] = useState<GaleriaDB[]>([]);
  const [page, setPage] = useState(0);
  const [visible, setVisible] = useState(true); // controla opacity
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitioning = useRef(false);

  useEffect(() => {
    const fetchGaleria = async () => {
      const { data } = await supabase
        .from("galeria").select("*").eq("ativo", true).order("ordem");
      if (data && data.length > 0) setAllItems(data);
    };
    fetchGaleria();
    const ch = supabase.channel("galeria-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "galeria" }, fetchGaleria)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);

  // Navega para uma página: pré-carrega → fade out → troca → fade in
  const goToPage = useCallback(async (nextPage: number) => {
    if (transitioning.current || allItems.length === 0) return;
    transitioning.current = true;

    // URLs da próxima página
    const start = nextPage * ITEMS_PER_PAGE;
    const nextUrls = allItems
      .slice(start, start + ITEMS_PER_PAGE)
      .map(i => i.foto_url)
      .filter(Boolean) as string[];

    // Pré-carregar antes de qualquer animação
    await preloadImages(nextUrls);

    // Fade out (200ms)
    setVisible(false);
    await new Promise(r => setTimeout(r, 220));

    // Trocar página
    setPage(nextPage);

    // Fade in (200ms)
    setVisible(true);
    await new Promise(r => setTimeout(r, 220));

    transitioning.current = false;
  }, [allItems]);

  // Auto-avanço
  const scheduleNext = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const next = (page + 1) % (Math.ceil(allItems.length / ITEMS_PER_PAGE) || 1);
      await goToPage(next);
      scheduleNext();
    }, INTERVAL_MS);
  }, [page, allItems, goToPage]);

  useEffect(() => {
    if (allItems.length > ITEMS_PER_PAGE) scheduleNext();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [allItems, page]);

  // Pré-carrega a próxima página em background enquanto exibe a atual
  useEffect(() => {
    if (allItems.length <= ITEMS_PER_PAGE) return;
    const nextPage = (page + 1) % totalPages;
    const start = nextPage * ITEMS_PER_PAGE;
    const urls = allItems.slice(start, start + ITEMS_PER_PAGE).map(i => i.foto_url).filter(Boolean) as string[];
    preloadImages(urls);
  }, [page, allItems]);

  // Teclado lightbox
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      else if (e.key === "ArrowLeft") setSelectedIndex(p => p !== null ? (p === 0 ? allItems.length - 1 : p - 1) : null);
      else if (e.key === "ArrowRight") setSelectedIndex(p => p !== null ? (p === allItems.length - 1 ? 0 : p + 1) : null);
    };
    if (selectedIndex !== null) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    window.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleKey); };
  }, [selectedIndex, allItems]);

  const handleDotClick = async (i: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    await goToPage(i);
    scheduleNext();
  };

  const visibleItems = allItems.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <section id="galeria" className="py-24 bg-[#F5F4F0]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-12">
          <span className="text-[#8B7355] text-[11px] font-medium tracking-[0.2em] font-['DM_Sans'] uppercase mb-2 block">
            CLIENTES SATISFEITOS
          </span>
          <h2 className="text-4xl md:text-6xl font-light text-[#1A1A1A] font-['Cormorant_Garamond']">
            Nossa <span className="italic font-bold text-[#C41E1E]">galeria.</span>
          </h2>
          {allItems.length > ITEMS_PER_PAGE && (
            <p className="font-['DM_Sans'] text-[13px] text-[#9B8E7E] mt-2">
              {allItems.length} fotos
            </p>
          )}
        </div>

        {/* Grid com fade controlado por pré-carregamento */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
          }}
        >
          {visibleItems.map((item, idx) => {
            const globalIdx = page * ITEMS_PER_PAGE + idx;
            return (
              <div key={item.id}
                onClick={() => setSelectedIndex(globalIdx)}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group bg-[#E5E0D8]">
                {item.foto_url ? (
                  <img
                    src={item.foto_url}
                    alt={item.titulo || "Galeria Thayssa Veículos"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#C9C0B4] text-4xl">📷</div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white font-['DM_Sans'] text-sm font-medium">
                    🔍 Ver
                  </span>
                </div>
              </div>
            );
          })}
          {Array.from({ length: ITEMS_PER_PAGE - visibleItems.length }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-lg bg-[#E5E0D8]/40" />
          ))}
        </div>

        {/* Dots */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mb-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => handleDotClick(i)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  page === i ? "w-[18px] h-[6px] bg-[#C41E1E]" : "w-[6px] h-[6px] bg-[#E5E0D8] hover:bg-[#C9C0B4]"
                }`}
                aria-label={`Página ${i + 1}`}
              />
            ))}
          </div>
        )}

        <p className="font-['DM_Sans'] text-[12px] text-[#9B8E7E] text-center">
          Siga{" "}
          <a href="https://www.instagram.com/thayssaveiculosbco/" target="_blank" rel="noopener noreferrer"
            className="text-[#C41E1E] hover:underline">@thayssaveiculosbco</a>{" "}
          no Instagram para mais fotos
        </p>
      </div>

      {/* LIGHTBOX */}
      {selectedIndex !== null && allItems[selectedIndex] && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center"
          onClick={() => setSelectedIndex(null)}>
          <div className="relative max-w-3xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <img
              src={allItems[selectedIndex].foto_url}
              alt={allItems[selectedIndex].titulo || ""}
              className="w-full rounded-lg object-contain max-h-[80vh]"
            />
            {allItems[selectedIndex].titulo && (
              <p className="text-white/70 font-['DM_Sans'] text-sm text-center mt-3">
                {allItems[selectedIndex].titulo}
              </p>
            )}
          </div>
          <button onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-all">
            ✕
          </button>
          <button onClick={() => setSelectedIndex(p => p !== null ? (p === 0 ? allItems.length - 1 : p - 1) : null)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-all">
            ‹
          </button>
          <button onClick={() => setSelectedIndex(p => p !== null ? (p === allItems.length - 1 ? 0 : p + 1) : null)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-all">
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 font-['DM_Sans'] text-xs">
            {selectedIndex + 1} / {allItems.length}
          </div>
        </div>
      )}
    </section>
  );
}
