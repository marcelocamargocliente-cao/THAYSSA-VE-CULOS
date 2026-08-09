import { useState, useEffect } from "react";

const galleryItems = [
  { id: 1, title: "Showroom Thayssa Veículos", tag: "Carros Seminovos" },
  { id: 2, title: "Motos e Scooter Selecionadas", tag: "Duas Rodas" },
  { id: 3, title: "Atendimento Personalizado em Cosmos", tag: "Equipe" },
  { id: 4, title: "Pátio com Veículos Revisados", tag: "Estoque" },
  { id: 5, title: "Entrega de Veículos com Garantia", tag: "Clientes" },
  { id: 6, title: "Seleção de Veículos Premium", tag: "Destaque" },
];

export default function GalleryLightbox() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev === 0 ? galleryItems.length - 1 : prev - 1) : null
        );
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev === galleryItems.length - 1 ? 0 : prev + 1) : null
        );
      }
    };

    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  return (
    <section id="galeria" className="py-24 bg-[#F5F4F0]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-12">
          <span className="text-[#8B7355] text-[11px] font-medium tracking-[0.2em] font-['DM_Sans'] uppercase mb-2 block">
            CONHEÇA NOSSO ESPAÇO
          </span>
          <h2 className="text-4xl md:text-6xl font-light text-[#1A1A1A] font-['Cormorant_Garamond']">
            Nossa <span className="italic font-bold text-[#C41E1E]">galeria.</span>
          </h2>
        </div>

        {/* Grid 3x2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {galleryItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedIndex(idx)}
              className="relative aspect-[4/3] bg-[#E5E0D8] rounded-[8px] overflow-hidden cursor-pointer group flex items-center justify-center"
            >
              {/* Camera Icon */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C9C0B4"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>

              {/* Tag overlay bottom-left */}
              <div className="absolute bottom-3 left-3 bg-[#1A1A1A]/80 text-white text-[10px] font-medium font-['DM_Sans'] px-2.5 py-1 rounded-[4px] uppercase tracking-wider">
                {item.tag}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#1A1A1A]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 bg-black/95 z-[9999] flex flex-col items-center justify-center p-4 animate-fade-in"
        >
          {/* Close Button X */}
          <button
            onClick={closeLightbox}
            aria-label="Fechar galeria"
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Prev Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) =>
                prev !== null ? (prev === 0 ? galleryItems.length - 1 : prev - 1) : null
              );
            }}
            aria-label="Foto anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Next Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) =>
                prev !== null ? (prev === galleryItems.length - 1 ? 0 : prev + 1) : null
              );
            }}
            aria-label="Próxima foto"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Content Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[80vh] flex flex-col items-center justify-center"
          >
            <div className="w-[80vw] max-w-[800px] aspect-[16/10] bg-[#222222] border border-[#333333] rounded-[8px] flex flex-col items-center justify-center p-8 relative">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555555"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-4"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <p className="text-white font-['Cormorant_Garamond'] text-2xl font-semibold text-center mb-1">
                {galleryItems[selectedIndex].title}
              </p>
              <span className="text-[#C41E1E] text-xs uppercase font-['DM_Sans'] tracking-widest">
                {galleryItems[selectedIndex].tag}
              </span>
            </div>

            <p className="font-['DM_Sans'] font-light text-[13px] text-white/60 mt-4 text-center">
              Nosso estoque — @thayssaveiculosbco
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
