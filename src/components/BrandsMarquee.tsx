export default function BrandsMarquee() {
  const brands = "TOYOTA · HONDA · VOLKSWAGEN · CHEVROLET · HYUNDAI · FORD · NISSAN · JEEP · FIAT · RENAULT · MITSUBISHI · KIA · BMW · MERCEDES-BENZ · AUDI · VOLVO · PEUGEOT · CITROËN · LAND ROVER · PORSCHE · FERRARI · LAMBORGHINI · MASERATI · LEXUS · INFINITI · JAGUAR · ALFA ROMEO · DODGE · RAM · TOYOTA · HONDA · VOLKSWAGEN · CHEVROLET · ";

  return (
    <div className="bg-[#F0EDE8] border-y border-[#E5E0D8] h-[36px] flex items-center overflow-hidden relative z-40 mt-[73px] md:mt-[81px]">
      <div className="brands-track flex whitespace-nowrap">
        <span className="text-[#9B8E7E] font-['DM_Sans'] text-[10px] uppercase tracking-[0.15em] py-2">
          {brands} {brands} {brands}
        </span>
        <span className="text-[#9B8E7E] font-['DM_Sans'] text-[10px] uppercase tracking-[0.15em] py-2">
          {brands} {brands} {brands}
        </span>
      </div>

      <style>{`
        .brands-track {
          display: flex;
          gap: 0;
          white-space: nowrap;
          animation: marquee-brands 150s linear infinite;
        }
        @keyframes marquee-brands {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
