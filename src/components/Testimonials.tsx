import { motion } from "motion/react";

export default function Testimonials() {
  const reviews = [
    { name: "Ricardo Silva", text: "Atendimento excepcional. A Thayssa Veículos elevou meu conceito de comprar um seminovo. Tudo impecável.", location: "Cosmos" },
    { name: "Mariana Costa", text: "A seleção de motos é fantástica. Fiz a troca da minha e o processo foi extremamente elegante e rápido.", location: "Campo Grande" },
    { name: "Carlos Eduardo", text: "Melhor experiência de compra. Transparência total e um ambiente muito acolhedor. Recomendo fortemente.", location: "Bangu" }
  ];

  return (
    <section className="py-32 bg-[#F5F4F0]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-white p-12 border border-[#E5E0D8] relative"
            >
              <span className="absolute top-4 left-6 text-8xl text-[#F0EDE8] font-['Cormorant_Garamond'] leading-none">“</span>
              <div className="flex gap-1 mb-6 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#8B7355] text-xs">★</span>
                ))}
              </div>
              <p className="text-[#1A1A1A] text-lg font-light italic font-['DM_Sans'] mb-8 relative z-10">
                {r.text}
              </p>
              <div className="relative z-10">
                <div className="text-[13px] font-bold text-[#1A1A1A] tracking-[0.1em] font-['DM_Sans'] uppercase">{r.name}</div>
                <div className="text-[11px] font-medium text-[#8B7355] tracking-[0.1em] font-['DM_Sans'] uppercase">{r.location} · RJ</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
