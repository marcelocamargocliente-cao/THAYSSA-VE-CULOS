import { motion } from "motion/react";

export default function Hero() {
  return (
    <section className="relative min-h-[100vh] flex flex-col justify-center bg-[#F5F4F0] px-6 md:px-20 pt-10 overflow-hidden">
      {/* 
        Substitua hero-video.mp4 por um vídeo de carros em movimento, loop de 10-30s, máximo 5MB, formato MP4 H.264 
      */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        poster="hero-poster.jpg"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 0.15
        }}
      >
        <source src="hero-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay sobre o vídeo */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(245,244,240,0.92) 0%, rgba(245,244,240,0.75) 100%)',
          zIndex: 1
        }}
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-10 h-[1px] bg-[#9B8E7E]"></div>
          <span className="text-[#9B8E7E] text-[13px] font-light tracking-[0.2em] font-['DM_Sans'] uppercase">
            SEU PRÓXIMO VEÍCULO.
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col mb-8"
        >
          <span className="text-7xl md:text-[108px] font-bold text-[#C41E1E] font-['DM_Sans'] leading-none tracking-tighter">
            THAYSSA
          </span>
          <span className="text-5xl md:text-[84px] font-bold text-[#1A1A1A] font-['DM_Sans'] leading-none -mt-2 tracking-tighter">
            VEÍCULOS
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-[#6B6B6B] text-base md:text-lg max-w-[480px] font-light font-['DM_Sans'] mb-12 leading-relaxed"
        >
          Seleção de seminovos e 0km com procedência garantida. <br />
          Experiência de aquisição premium em Cosmos, RJ.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="flex flex-col sm:flex-row gap-6 mb-20"
        >
          <a 
            href="#estoque"
            className="bg-[#8B7355] text-white px-10 py-5 text-[12px] font-bold tracking-[0.2em] uppercase font-['DM_Sans'] transition-all hover:bg-[#705c44] flex items-center justify-center gap-3"
          >
            Ver estoque →
          </a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="border-t border-[#E5E0D8] pt-12 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16"
        >
          {[
            { num: "500+", label: "veículos vendidos" },
            { num: "4.9", label: "avaliação google" },
            { num: "100%", label: "documentação ok" },
            { num: "05", label: "anos de história" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-3xl md:text-4xl font-bold italic text-[#8B7355] font-['Playfair_Display'] mb-1">
                {item.num}
              </span>
              <span className="text-[#1A1A1A] text-[10px] font-light tracking-[0.1em] font-['DM_Sans'] uppercase">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
