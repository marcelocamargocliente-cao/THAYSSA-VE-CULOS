import { motion } from "motion/react";

export default function HowItWorks() {
  const steps = [
    { title: "Escolha o veículo", desc: "Navegue pelo nosso estoque editorial de carros e motos selecionadas." },
    { title: "Simule agora", desc: "Condições personalizadas com as melhores instituições financeiras." },
    { title: "Entrega premium", desc: "Processo rápido, documentação pronta e entrega com excelência." }
  ];

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col"
            >
              <span className="text-6xl font-bold italic text-[#E5E0D8] font-['Playfair_Display'] mb-6 leading-none">
                0{i + 1}
              </span>
              <h4 className="text-[13px] font-semibold text-[#1A1A1A] mb-4 tracking-[0.2em] font-['DM_Sans'] uppercase">
                {step.title}
              </h4>
              <p className="text-[#6B6B6B] text-[15px] font-light font-['DM_Sans'] leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
