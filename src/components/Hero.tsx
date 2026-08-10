import { useEffect, useRef, useState } from "react";

// Partículas de faísca
function Sparks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Spark = {
      x: number; y: number;
      vx: number; vy: number;
      life: number; maxLife: number;
      size: number; color: string;
    };

    const sparks: Spark[] = [];
    let raf: number;

    const spawnBurst = () => {
      // Origem: região do velocímetro (direita-baixo)
      const ox = canvas.width * 0.72 + (Math.random() - 0.5) * 60;
      const oy = canvas.height * 0.78 + (Math.random() - 0.5) * 40;
      const count = Math.floor(Math.random() * 6) + 4;
      for (let i = 0; i < count; i++) {
        const angle = (Math.random() * 140 - 160) * (Math.PI / 180); // espalha para esquerda/cima
        const speed = Math.random() * 5 + 2;
        const colors = ["#C41E1E", "#FF4444", "#FF8800", "#FFCC00", "#fff"];
        sparks.push({
          x: ox, y: oy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 2,
          life: 0,
          maxLife: Math.random() * 40 + 30,
          size: Math.random() * 2.5 + 0.8,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      if (frame % 8 === 0) spawnBurst();

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.12; // gravidade
        s.vx *= 0.98; // arrasto
        s.life++;

        const t = s.life / s.maxLife;
        const alpha = 1 - t;

        ctx.beginPath();
        // Traço (linha fina para dar sensação de velocidade)
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 3, s.y - s.vy * 3);
        ctx.strokeStyle = s.color.replace(")", `,${alpha * 0.8})`).replace("rgb", "rgba").replace("#", "rgba(").replace(")", "").replace("C41E1E", "196,30,30").replace("FF4444", "255,68,68").replace("FF8800", "255,136,0").replace("FFCC00", "255,204,0").replace("fff", "255,255,255");

        // Usar globalAlpha mais simples
        ctx.globalAlpha = alpha * 0.9;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.lineCap = "round";
        ctx.stroke();

        // Ponto brilhante na ponta
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = alpha * 0.6;
        ctx.fill();

        ctx.globalAlpha = 1;

        if (s.life >= s.maxLife) sparks.splice(i, 1);
      }

      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
    />
  );
}

// Velocímetro
function Speedometer({ active }: { active: boolean }) {
  const [speed, setSpeed] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const duration = 2000;
    const maxSpeed = 220;
    const animate = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const p = Math.min((now - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setSpeed(Math.round(eased * maxSpeed));
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  const cx = 220; const cy = 220; const R = 175;
  const startAngle = -220; const endAngle = 40;
  const totalAngle = endAngle - startAngle;
  const maxSpeed = 220;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const needleAngle = startAngle + (speed / maxSpeed) * totalAngle;
  const needleX = cx + (R - 22) * Math.cos(toRad(needleAngle));
  const needleY = cy + (R - 22) * Math.sin(toRad(needleAngle));

  const arcPath = (r: number, s: number, e: number) => {
    const sr = toRad(s); const er = toRad(e);
    const x1 = cx + r * Math.cos(sr); const y1 = cy + r * Math.sin(sr);
    const x2 = cx + r * Math.cos(er); const y2 = cy + r * Math.sin(er);
    return `M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`;
  };

  const progressEnd = startAngle + (speed / maxSpeed) * totalAngle;

  const ticks = Array.from({ length: 23 }, (_, i) => {
    const val = i * 10;
    const angle = startAngle + (val / maxSpeed) * totalAngle;
    const rad = toRad(angle);
    const major = i % 2 === 0;
    return {
      x1: cx + R * Math.cos(rad), y1: cy + R * Math.sin(rad),
      x2: cx + (R - (major ? 18 : 10)) * Math.cos(rad),
      y2: cy + (R - (major ? 18 : 10)) * Math.sin(rad),
      major, val,
    };
  });

  const labels = [0, 40, 80, 120, 160, 200].map(val => {
    const rad = toRad(startAngle + (val / maxSpeed) * totalAngle);
    return { x: cx + (R - 36) * Math.cos(rad), y: cy + (R - 36) * Math.sin(rad), val };
  });

  return (
    <svg viewBox="0 0 440 340" className="w-full h-full">
      <defs>
        <radialGradient id="bg2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1C1C1C"/>
          <stop offset="100%" stopColor="#080808"/>
        </radialGradient>
        <filter id="gr"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="gw"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      <circle cx={cx} cy={cy} r={R + 22} fill="url(#bg2)"/>
      <circle cx={cx} cy={cy} r={R + 22} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5"/>
      <circle cx={cx} cy={cy} r={R + 10} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>

      {/* Arco fundo */}
      <path d={arcPath(R, startAngle, endAngle)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round"/>
      {/* Zona vermelha */}
      <path d={arcPath(R, startAngle + (160/maxSpeed)*totalAngle, endAngle)} fill="none" stroke="rgba(196,30,30,0.18)" strokeWidth="18" strokeLinecap="round"/>
      {/* Progresso */}
      {speed > 0 && <path d={arcPath(R, startAngle, progressEnd)} fill="none" stroke="#C41E1E" strokeWidth="10" strokeLinecap="round" filter="url(#gr)"/>}

      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={t.val >= 160 ? "rgba(196,30,30,0.6)" : "rgba(255,255,255,0.35)"}
          strokeWidth={t.major ? 2 : 1}/>
      ))}

      {labels.map((l, i) => (
        <text key={i} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle"
          fill={l.val >= 160 ? "rgba(196,30,30,0.75)" : "rgba(255,255,255,0.45)"}
          fontSize="12" fontFamily="'Space Grotesk',sans-serif" fontWeight="500">{l.val}</text>
      ))}

      {/* Ponteiro */}
      <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke="white" strokeWidth="2.5" strokeLinecap="round" filter="url(#gw)"/>
      <line x1={cx} y1={cy}
        x2={cx + (R*0.13)*Math.cos(toRad(needleAngle+180))}
        y2={cy + (R*0.13)*Math.sin(toRad(needleAngle+180))}
        stroke="#C41E1E" strokeWidth="2.5" strokeLinecap="round"/>

      <circle cx={cx} cy={cy} r="12" fill="#111" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
      <circle cx={cx} cy={cy} r="4.5" fill="#C41E1E"/>

      {/* Display */}
      <text x={cx} y={cy + 50} textAnchor="middle" fill="white"
        fontSize="40" fontFamily="'Space Grotesk',sans-serif" fontWeight="700" letterSpacing="-1">{speed}</text>
      <text x={cx} y={cy + 72} textAnchor="middle" fill="rgba(255,255,255,0.35)"
        fontSize="11" fontFamily="'DM Sans',sans-serif" letterSpacing="3">KM/H</text>
      <text x={cx} y={cy + 92} textAnchor="middle" fill="rgba(196,30,30,0.6)"
        fontSize="9" fontFamily="'DM Sans',sans-serif" fontWeight="700" letterSpacing="4">THAYSSA</text>
    </svg>
  );
}

export default function Hero() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 1000),
      setTimeout(() => setPhase(4), 2400),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  const tr = (minPhase: number, dy = "16px", delay = "0s") => ({
    opacity: phase >= minPhase ? 1 : 0,
    transform: phase >= minPhase ? "translateY(0)" : `translateY(${dy})`,
    transition: `opacity 0.6s ease ${delay}, transform 0.6s ease ${delay}`,
  });

  return (
    <section
      className="relative flex items-center overflow-hidden bg-[#0A0A0A]"
      style={{ height: "100vh", minHeight: 560, maxHeight: 900 }}
    >
      {/* Fundo: linhas diagonais sutis */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(-45deg,transparent,transparent 60px,rgba(255,255,255,0.012) 60px,rgba(255,255,255,0.012) 61px)"
      }}/>

      {/* Glow vermelho */}
      <div className="absolute z-0 pointer-events-none"
        style={{ top:"40%", right:"20%", width:500, height:500, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(196,30,30,0.13) 0%,transparent 70%)",
          transform:"translate(50%,-50%)" }}/>

      {/* Faíscas */}
      <Sparks/>

      {/* CONTEÚDO */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16
        grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-center">

        {/* ESQUERDA */}
        <div className="flex flex-col">

          {/* Label */}
          <div style={tr(1,"12px")} className="flex items-center gap-3 mb-4">
            <div className="w-7 h-[1px] bg-[#C41E1E]"/>
            <span className="text-[#9B8E7E] text-[10px] tracking-[0.25em] font-['DM_Sans'] uppercase">
              Cosmos · Rio de Janeiro
            </span>
          </div>

          {/* Headline — compacto mas impactante */}
          <div style={tr(2,"20px","0.05s")} className="mb-3 leading-none">
            <h1 className="font-['DM_Sans'] font-black tracking-tighter leading-[0.92]"
              style={{ fontSize:"clamp(2.8rem,7.5vw,6.2rem)" }}>
              <span className="text-white block">SEU</span>
              <span className="text-[#C41E1E] block">PRÓXIMO</span>
              <span className="text-white block">VEÍCULO.</span>
            </h1>
          </div>

          {/* Tagline */}
          <div style={tr(2,"12px","0.12s")} className="mb-4">
            <span className="font-['Cormorant_Garamond'] italic text-[#9B8E7E] font-light"
              style={{ fontSize:"clamp(1rem,2vw,1.3rem)" }}>
              Na largada desde o primeiro contato.
            </span>
          </div>

          {/* Sub */}
          <div style={tr(3,"12px","0.05s")} className="mb-6">
            <p className="text-[#555] text-xs md:text-sm font-['DM_Sans'] font-light leading-relaxed max-w-xs">
              Troca, financia e consigna.<br/>
              Carros e motos seminovos em Cosmos, RJ.
            </p>
          </div>

          {/* CTAs */}
          <div style={tr(3,"12px","0.1s")} className="flex flex-wrap gap-3 mb-6">
            <a href="#estoque"
              className="group relative inline-flex items-center gap-2 px-8 py-3 bg-[#C41E1E] text-white font-['DM_Sans'] text-[10px] font-bold tracking-[0.22em] uppercase overflow-hidden">
              <span className="relative z-10">Ver estoque</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-[-20deg]"/>
            </a>
            <a href="https://wa.me/5521969320071" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 border border-white/15 text-white font-['DM_Sans'] text-[10px] font-bold tracking-[0.22em] uppercase hover:border-white/40 transition-colors">
              💬 WhatsApp
            </a>
          </div>

          {/* Stats — linha horizontal compacta */}
          <div style={tr(4,"8px","0s")}
            className="grid grid-cols-4 gap-4 pt-5 border-t border-white/8">
            {[
              { num:"500+", label:"Vendidos" },
              { num:"4.9★", label:"Google" },
              { num:"100%", label:"Doc. OK" },
              { num:"5 anos", label:"História" },
            ].map((s,i)=>(
              <div key={i}>
                <div className="text-white font-['Space_Grotesk'] font-bold leading-none mb-0.5"
                  style={{ fontSize:"clamp(1rem,2vw,1.3rem)" }}>{s.num}</div>
                <div className="text-[#555] text-[9px] tracking-[0.1em] uppercase font-['DM_Sans']">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* DIREITA — velocímetro */}
        <div className="hidden lg:flex items-center justify-center"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "scale(1) rotate(0deg)" : "scale(0.82) rotate(-10deg)",
            transition: "opacity 1s ease 0.15s, transform 1.2s cubic-bezier(0.22,1,0.36,1) 0.15s",
          }}>
          <Speedometer active={phase >= 1}/>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20"
        style={{ opacity: phase >= 4 ? 1 : 0, transition:"opacity 0.8s ease" }}>
        <div className="w-[1px] h-8 bg-white/15 relative overflow-hidden mx-auto">
          <div className="absolute top-0 w-full bg-[#C41E1E]"
            style={{ height:"40%", animation:"scrollPulse 1.8s ease-in-out infinite" }}/>
        </div>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%{transform:translateY(-100%);opacity:1}
          100%{transform:translateY(300%);opacity:0}
        }
      `}</style>
    </section>
  );
}
