import { useState, useEffect } from "react";
import { supabase, GaleriaDB } from "../lib/supabase";

const BASE = 'https://kvywklyujlnkotnckivd.supabase.co/storage/v1/object/public';

const INSTA_FOTOS = [
  { foto_url: `${BASE}/fotos-galeria/insta_visite_loja.png`, likes: "142 curtidas" },
  { foto_url: `${BASE}/fotos-galeria/insta_shrek_oferta.png`, likes: "98 curtidas" },
  { foto_url: `${BASE}/fotos-galeria/insta_chave_mao.png`, likes: "210 curtidas" },
  { foto_url: `${BASE}/fotos-galeria/insta_chave_carro.png`, likes: "175 curtidas" },
  { foto_url: `${BASE}/fotos-galeria/insta_mobi_oferta.png`, likes: "89 curtidas" },
  { foto_url: `${BASE}/fotos-galeria/insta_s10_oferta.png`, likes: "320 curtidas" },
];

export default function InstagramFeed() {
  return (
    <section id="instagram" className="py-24 bg-[#FFFFFF]">
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
            <a href="https://www.instagram.com/thayssaveiculosbco/" target="_blank" rel="noopener noreferrer"
              className="text-[#C41E1E] font-medium hover:underline">
              @thayssaveiculosbco
            </a>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
          {INSTA_FOTOS.map((post, i) => (
            <a key={i}
              href="https://www.instagram.com/thayssaveiculosbco/"
              target="_blank" rel="noopener noreferrer"
              className="relative aspect-square rounded-[4px] overflow-hidden group border border-[#E5E0D8]"
            >
              <img src={post.foto_url} alt="Post Instagram Thayssa Veículos"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="flex items-center gap-2 text-white font-['DM_Sans'] font-semibold text-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span>{post.likes}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center">
          <a href="https://www.instagram.com/thayssaveiculosbco/" target="_blank" rel="noopener noreferrer"
            className="inline-block border-[1.5px] border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white px-8 py-3 rounded-[2px] font-['DM_Sans'] text-xs uppercase tracking-widest font-semibold transition-all duration-300">
            Ver perfil completo no Instagram →
          </a>
        </div>
      </div>
    </section>
  );
}
