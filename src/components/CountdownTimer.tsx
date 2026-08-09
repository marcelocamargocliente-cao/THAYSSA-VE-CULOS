import { useEffect, useState } from "react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      let diff = endOfDay.getTime() - now.getTime();
      if (diff <= 0) {
        diff = 0;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#1A1A1A] py-6 px-4 border-y border-[#333333]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 text-center">
        <span className="text-[#9B8E7E] text-[11px] font-medium tracking-[0.2em] font-['DM_Sans'] uppercase">
          OFERTAS ESPECIAIS — CONDIÇÕES EXCLUSIVAS ATÉ:
        </span>

        <div className="flex items-center gap-3">
          {[
            { value: timeLeft.days, label: "DIAS" },
            { value: timeLeft.hours, label: "HORAS" },
            { value: timeLeft.minutes, label: "MIN" },
            { value: timeLeft.seconds, label: "SEG" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#222222] border border-[#333333] rounded-[6px] px-4 py-2 min-w-[64px] text-center"
            >
              <div className="font-['Playfair_Display'] font-bold italic text-2xl text-[#C41E1E] leading-none mb-1">
                {item.value}
              </div>
              <div className="font-['DM_Sans'] font-light text-[10px] tracking-wider text-[#9B8E7E] uppercase leading-none">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <a
          href="https://wa.me/5521969320071"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#C41E1E] text-[12px] font-semibold tracking-wider font-['DM_Sans'] uppercase hover:underline transition-all flex items-center gap-1 mt-2 md:mt-0"
        >
          Aproveite agora →
        </a>
      </div>
    </section>
  );
}
