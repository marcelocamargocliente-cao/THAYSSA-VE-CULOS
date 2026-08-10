import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [flagDown, setFlagDown] = useState(false);
  const [textPhase, setTextPhase] = useState(0);
  const animRef = useRef<number>(0);

  // Animação da pista em perspectiva
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let offset = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Ponto de fuga — centro-topo
      const vx = W / 2;
      const vy = H * 0.38;

      // Pista escura
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, W, H);

      // Linhas da pista em perspectiva
      const numLines = 18;
      for (let i = 0; i <= numLines; i++) {
        const t = (i / numLines + offset * 0.012) % 1;
        const ease = Math.pow(t, 1.6); // perspectiva

        // Largura da pista no horizonte → base
        const roadWidthTop = W * 0.08;
        const roadWidthBot = W * 1.6;
        const lw = roadWidthTop + (roadWidthBot - roadWidthTop) * ease;

        const y = vy + (H - vy) * ease;
        const x1 = vx - lw / 2;
        const x2 = vx + lw / 2;

        // Linhas laterais da pista
        const alpha = ease * 0.35;
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 1;

        if (i > 0 && i < numLines) {
          // Linhas tracejadas centrais
          const prevT = ((i - 1) / numLines + offset * 0.012) % 1;
          const prevEase = Math.pow(prevT, 1.6);
          const prevLw = roadWidthTop + (roadWidthBot - roadWidthTop) * prevEase;
          const prevY = vy + (H - vy) * prevEase;

          // Só desenha traço se intervalo for adequado (alternado)
          if (i % 2 === 0) {
            ctx.beginPath();
            ctx.moveTo(vx, prevY);
            ctx.lineTo(vx, y);
            ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.6})`;
            ctx.lineWidth = Math.max(1, ease * 3);
            ctx.stroke();
          }
        }

        // Bordas da pista
        if (i === 0 || i === numLines) continue;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.15})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Linhas laterais convergindo ao ponto de fuga
      [[0.15, 0.85], [0.3, 0.7]].forEach(([lt, rt], gi) => {
        const alpha = gi === 0 ? 0.5 : 0.2;
        ctx.beginPath();
        ctx.moveTo(vx, vy);
        ctx.lineTo(W * lt, H);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = gi === 0 ? 1.5 : 0.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(vx, vy);
        ctx.lineTo(W * rt, H);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = gi === 0 ? 1.5 : 0.5;
        ctx.stroke();
      });

      // Linha vermelha no horizonte (linha de chegada)
      ctx.beginPath();
      ctx.moveTo(0, vy + 2);
      ctx.lineTo(W, vy + 2);
      ctx.strokeStyle = "rgba(196,30,30,0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Gradiente de fade no topo (escurece)
      const gradTop = ctx.createLinearGradient(0, 0, 0, vy * 0.8);
      gradTop.addColorStop(0, "rgba(10,10,10,1)");
      gradTop.addColorStop(1, "rgba(10,10,10,0)");
      ctx.fillStyle = gradTop;
      ctx.fillRect(0, 0, W, vy * 0.8);

      // Gradiente de fade na base
      const gradBot = ctx.createLinearGradient(0, H * 0.7, 0, H);
      gradBot.addColorStop(0, "rgba(10,10,10,0)");
      gradBot.addColorStop(1, "rgba(10,10,10,0.95)");
      ctx.fillStyle = gradBot;
      ctx.fillRect(0, H * 0.7, W, H * 0.3);

      offset += 1;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Sequência de reveal
  useEffect(() => {
    const t1 = setTimeout(() => setFlagDown(true), 300);
    const t2 = setTimeout(() => setTextPhase(1), 900);
    const t3 = setTimeout(() => setTextPhase(2), 1600);
    const t4 = setTimeout(() => setTextPhase(3), 2200);
    const t5 = setTimeout(() => setRevealed(true), 2800);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  return (
    <section className="relative min-h-[100vh] flex flex-col justify-center overflow-hidden bg-[#0A0A0A]">

      {/* PISTA ANIMADA */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* BANDEIRA XADREZ — cai do topo */}
      <div
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          transform: flagDown ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Padrão xadrez SVG */}
        <svg width="100%" height="48" preserveAspectRatio="none">
          <defs>
            <pattern id="xadrez" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <rect width="12" height="12" fill="#1A1A1A"/>
              <rect x="12" width="12" height="12" fill="#fff"/>
              <rect y="12" width="12" height="12" fill="#fff"/>
              <rect x="12" y="12" width="12" height="12" fill="#1A1A1A"/>
            </pattern>
          </defs>
          <rect width="100%" height="48" fill="url(#xadrez)" opacity="0.9"/>
          {/* Linha vermelha abaixo do xadrez */}
          <rect y="44" width="100%" height="4" fill="#C41E1E"/>
        </svg>
      </div>

      {/* CONTEÚDO */}
      <div className="relative z-20 px-6 md:px-20 max-w-7xl mx-auto w-full pt-24 pb-16">

        {/* LABEL */}
        <div
          className="flex items-center gap-4 mb-8"
          style={{
            opacity: textPhase >= 1 ? 1 : 0,
            transform: textPhase >= 1 ? "translateX(0)" : "translateX(-20px)",
            transition: "all 0.6s ease",
          }}
        >
          <div className="w-10 h-[1px] bg-[#C41E1E]"/>
          <span className="text-[#9B8E7E] text-[11px] tracking-[0.25em] font-['DM_Sans'] uppercase">
            Cosmos · Rio de Janeiro
          </span>
        </div>

        {/* HEADLINE */}
        <div className="mb-10 overflow-hidden">
          <div
            style={{
              opacity: textPhase >= 1 ? 1 : 0,
              transform: textPhase >= 1 ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <span
              className="block font-['DM_Sans'] font-black leading-none tracking-tighter text-white"
              style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)" }}
            >
              THAYSSA
            </span>
          </div>
          <div
            style={{
              opacity: textPhase >= 2 ? 1 : 0,
              transform: textPhase >= 2 ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <span
              className="block font-['DM_Sans'] font-black leading-none tracking-tighter"
              style={{
                fontSize: "clamp(3.5rem, 10vw, 8rem)",
                color: "#C41E1E",
                WebkitTextStroke: "0px",
              }}
            >
              VEÍCULOS
            </span>
          </div>
          <div
            className="mt-4"
            style={{
              opacity: textPhase >= 3 ? 1 : 0,
              transform: textPhase >= 3 ? "translateX(0)" : "translateX(-16px)",
              transition: "all 0.5s ease",
            }}
          >
            <span
              className="font-['Cormorant_Garamond'] italic text-[#9B8E7E] font-light"
              style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)" }}
            >
              Seu próximo veículo, na largada.
            </span>
          </div>
        </div>

        {/* SUBTÍTULO + CTA */}
        <div
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.6s ease",
          }}
        >
          <p className="text-[#6B6B6B] text-sm md:text-base max-w-md font-['DM_Sans'] font-light leading-relaxed mb-10">
            Seminovos e 0km com procedência garantida.<br />
            Troca, financia e consigna em Cosmos, RJ.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#estoque"
              className="group relative inline-flex items-center gap-3 px-10 py-4 font-['DM_Sans'] text-[11px] font-bold tracking-[0.25em] uppercase overflow-hidden"
              style={{ background: "#C41E1E", color: "#fff" }}
            >
              <span className="relative z-10">Ver estoque</span>
              <span
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
              >→</span>
              {/* Shimmer */}
              <span
                className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"
                style={{ skewX: "-20deg" }}
              />
            </a>
            <a
              href="https://wa.me/5521969320071"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 font-['DM_Sans'] text-[11px] font-bold tracking-[0.25em] uppercase text-white border border-white/20 hover:border-white/60 transition-colors duration-300"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>

        {/* STATS — placar de corrida */}
        <div
          className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8"
          style={{
            opacity: revealed ? 1 : 0,
            transition: "opacity 0.8s ease 0.3s",
          }}
        >
          {[
            { num: "500+", label: "Veículos vendidos" },
            { num: "4.9★", label: "Avaliação Google" },
            { num: "100%", label: "Documentação OK" },
            { num: "5 anos", label: "De história" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span
                className="font-['Space_Grotesk'] font-bold text-white"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
              >
                {s.num}
              </span>
              <span className="text-[#6B6B6B] text-[10px] tracking-[0.12em] uppercase font-['DM_Sans']">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        style={{ opacity: revealed ? 1 : 0, transition: "opacity 1s ease 0.5s" }}
      >
        <div className="w-[1px] h-10 bg-white/20 relative overflow-hidden">
          <div
            className="absolute top-0 w-full bg-[#C41E1E]"
            style={{
              height: "40%",
              animation: "scrollPulse 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0% { transform: translateY(-100%); opacity: 1; }
          100% { transform: translateY(300%); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
