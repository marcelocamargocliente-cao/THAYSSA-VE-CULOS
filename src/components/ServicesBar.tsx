export default function ServicesBar() {
  const items = ["COMPRA", "VENDA", "TROCA", "FINANCIA", "CONSIGNA"];

  return (
    <div className="bg-[#1A1A1A] py-6 overflow-hidden relative">
      <div className="flex animate-[marquee_120s_linear_infinite] whitespace-nowrap items-center">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center">
            {items.map((item, j) => (
              <div key={j} className="flex items-center mx-8">
                <span className="text-white font-['DM_Sans'] font-medium text-[12px] tracking-[0.4em] uppercase">
                  {item}
                </span>
                <span className="text-white/20 mx-8">·</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
