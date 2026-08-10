import { motion } from "motion/react";

export default function FinalCTA() {
  return (
    <section className="py-40 bg-white text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-5xl md:text-8xl font-light font-['Cormorant_Garamond'] text-[#1A1A1A] mb-12">
          O veículo dos seus <br />
          <span className="italic font-bold text-[#8B7355]">sonhos</span> espera.
        </h2>
        
        <p className="text-[#6B6B6B] text-lg font-light font-['DM_Sans'] mb-12 max-w-xl mx-auto leading-relaxed">
          Nossa equipe especializada está pronta para oferecer uma experiência de compra personalizada e sem complicações na Zona Oeste do Rio.
        </p>

        <a 
          href="https://wa.me/5521969320071"
          className="inline-block bg-[#1A1A1A] text-white px-16 py-6 text-[12px] font-bold tracking-[0.3em] uppercase font-['DM_Sans'] transition-all hover:bg-[#C41E1E]"
        >
          Agendar consultoria →
        </a>
      </motion.div>
    </section>
  );
}
