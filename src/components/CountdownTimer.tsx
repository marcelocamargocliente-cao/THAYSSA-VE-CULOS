import { useEffect, useState } from "react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days:"00", hours:"00", minutes:"00", seconds:"00" });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const end = new Date(); end.setHours(23,59,59,999);
      let diff = Math.max(end.getTime() - now.getTime(), 0);
      setTimeLeft({
        days: String(Math.floor(diff/(1000*60*60*24))).padStart(2,"0"),
        hours: String(Math.floor((diff/(1000*60*60))%24)).padStart(2,"0"),
        minutes: String(Math.floor((diff/1000/60)%60)).padStart(2,"0"),
        seconds: String(Math.floor((diff/1000)%60)).padStart(2,"0"),
      });
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section className="bg-[#1A1A1A] py-1.5 px-4 border-b border-[#333]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4">
        <span className="text-[#9B8E7E] text-[9px] font-medium tracking-[0.2em] font-['DM_Sans'] uppercase">
          Ofertas especiais — condições exclusivas até:
        </span>
        <div className="flex items-center gap-2">
          {[
            { value: timeLeft.days, label:"DIAS" },
            { value: timeLeft.hours, label:"HORAS" },
            { value: timeLeft.minutes, label:"MIN" },
            { value: timeLeft.seconds, label:"SEG" },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#222] border border-[#333] rounded px-2 py-1 min-w-[40px] text-center">
              <div className="font-['Playfair_Display'] font-bold italic text-sm text-[#C41E1E] leading-none mb-0.5">{item.value}</div>
              <div className="font-['DM_Sans'] text-[8px] tracking-wider text-[#9B8E7E] uppercase leading-none">{item.label}</div>
            </div>
          ))}
        </div>
        <a href="https://wa.me/5521969320071" target="_blank" rel="noopener noreferrer"
          className="text-[#C41E1E] text-[10px] font-semibold tracking-wider font-['DM_Sans'] uppercase hover:underline flex items-center gap-1">
          Aproveite agora →
        </a>
      </div>
    </section>
  );
}
