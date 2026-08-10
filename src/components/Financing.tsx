import { motion } from "motion/react";

export default function Financing() {
  const banks = ["BRADESCO", "ITAÚ", "SANTANDER", "BV FINANCEIRA", "BANCO PAN", "CAIXA"];

  return (
    <section id="financiamento" className="py-32 bg-[#1A1A1A] text-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-light font-['Cormorant_Garamond'] mb-8">
              Crédito para <br />
              <span className="italic font-bold text-[#C41E1E]">todo mundo.</span>
            </h2>
            
            <ul className="space-y-6">
              {["Aprovação em até 24h", "Aceitamos seu veículo como entrada", "Taxas exclusivas para seminovos", "Sem burocracia excessiva"].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-white/70 font-light font-['DM_Sans'] text-lg">
                  <span className="w-1.5 h-1.5 bg-[#C41E1E] rounded-full"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {banks.map((bank, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-[#C41E1E]/40 hover:border-[#C41E1E] p-6 flex items-center justify-center text-[10px] tracking-[0.3em] font-bold text-white/50 hover:text-white font-['DM_Sans'] uppercase transition-all duration-200"
              >
                {bank}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
