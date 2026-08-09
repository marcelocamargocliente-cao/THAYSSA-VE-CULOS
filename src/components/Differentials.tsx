import { motion } from "motion/react";

export default function Differentials() {
  const diffs = [
    { title: "Procedência 100%", desc: "Vistoria cautelar e revisão completa em todos os veículos do nosso estoque." },
    { title: "Crédito Facilitado", desc: "Trabalhamos com os maiores bancos para garantir a melhor taxa do mercado." },
    { title: "Melhor Avaliação", desc: "Pagamos o preço justo no seu veículo usado na troca por um novo." },
    { title: "Venda Segura", desc: "Opção de consignação para você vender seu carro com total segurança." },
    { title: "Mix de Estoque", desc: "Ampla variedade entre carros de passeio e motos urbanas selecionadas." },
    { title: "Atendimento RJ", desc: "Ponto estratégico em Cosmos para atender toda a Zona Oeste com excelência." },
  ];

  return (
    <section id="sobre" className="py-32 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-light text-[#1A1A1A] font-['Cormorant_Garamond'] leading-tight mb-4"
          >
            O que nos <br />
            <span className="italic font-bold text-[#8B7355]">diferencia.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {diffs.map((diff, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group border-t border-[#E5E0D8] pt-12 relative hover:border-[#C41E1E] transition-all duration-500"
            >
              <div className="flex gap-6">
                <span className="text-3xl font-bold italic text-[#8B7355] font-['Playfair_Display'] leading-none">
                  0{i + 1}
                </span>
                <div>
                  <h4 className="text-[13px] font-bold text-[#1A1A1A] mb-3 tracking-[0.2em] font-['DM_Sans'] uppercase">
                    {diff.title}
                  </h4>
                  <p className="text-[#6B6B6B] text-[15px] leading-relaxed font-light font-['DM_Sans'] max-w-xs">
                    {diff.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
