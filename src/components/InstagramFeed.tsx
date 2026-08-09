export default function InstagramFeed() {
  const posts = [
    { id: 1, likes: "142 curtidas" },
    { id: 2, likes: "98 curtidas" },
    { id: 3, likes: "210 curtidas" },
    { id: 4, likes: "175 curtidas" },
    { id: 5, likes: "89 curtidas" },
    { id: 6, likes: "320 curtidas" },
  ];

  return (
    <section id="instagram" className="py-24 bg-[#FFFFFF]">
      {/* Para feed real, integre a Instagram Basic Display API ou use serviço como Elfsight */}
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#8B7355] text-[11px] font-medium tracking-[0.2em] font-['DM_Sans'] uppercase mb-2 block">
            ACOMPANHE NO SOCIAL
          </span>
          <h2 className="text-4xl md:text-6xl font-light text-[#1A1A1A] font-['Cormorant_Garamond'] mb-4">
            Siga a gente <span className="italic font-bold text-[#C41E1E]">no Instagram.</span>
          </h2>
          <p className="text-[#6B6B6B] text-sm md:text-base font-light font-['DM_Sans'] leading-relaxed">
            Confira nosso estoque atualizado diariamente em{" "}
            <a
              href="https://www.instagram.com/thayssaveiculosbco/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C41E1E] font-medium hover:underline"
            >
              @thayssaveiculosbco
            </a>
          </p>
        </div>

        {/* Grid 3x2 = 6 posts */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
          {posts.map((post) => (
            <a
              key={post.id}
              href="https://www.instagram.com/thayssaveiculosbco/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-[4px] bg-gradient-to-br from-[#F0EDE8] to-[#E5E0D8] overflow-hidden group flex items-center justify-center border border-[#E5E0D8]"
            >
              {/* Instagram SVG Icon */}
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C9C0B4"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-50"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#1A1A1A]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white">
                <div className="flex items-center gap-2 font-['DM_Sans'] font-semibold text-sm">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>{post.likes}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a
            href="https://www.instagram.com/thayssaveiculosbco/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-[1.5px] border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white px-8 py-3 rounded-[2px] font-['DM_Sans'] text-xs uppercase tracking-widest font-semibold transition-all duration-300"
          >
            Ver perfil completo no Instagram →
          </a>
        </div>
      </div>
    </section>
  );
}
