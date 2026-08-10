import { useEffect, useRef, useState } from "react";

// Velocímetro SVG animado
function Speedometer({ active }: { active: boolean }) {
  const [speed, setSpeed] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const duration = 2200;
    const maxSpeed = 220;

    const animate = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quártico
      const eased = 1 - Math.pow(1 - progress, 4);
      setSpeed(Math.round(eased * maxSpeed));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  // SVG coords
  const cx = 260;
  const cy = 260;
  const R = 210;
  const startAngle = -220; // graus (embaixo-esquerda)
  const endAngle = 40;    // graus (embaixo-direita)
  const totalAngle = endAngle - startAngle; // 260°
  const maxSpeed = 220;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Posição do ponteiro
  const needleAngle = startAngle + (speed / maxSpeed) * totalAngle;
  const needleX = cx + (R - 28) * Math.cos(toRad(needleAngle));
  const needleY = cy + (R - 28) * Math.sin(toRad(needleAngle));

  // Arco de fundo
  const arcPath = (r: number, start: number, end: number) => {
    const s = toRad(start);
    const e = toRad(end);
    const x1 = cx + r * Math.cos(s);
    const y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e);
    const y2 = cy + r * Math.sin(e);
    const large = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  // Arco de progresso (vermelho)
  const progressEnd = startAngle + (speed / maxSpeed) * totalAngle;

  // Marcações
  const ticks = [];
  for (let i = 0; i <= 22; i++) {
    const val = i * 10;
    const angle = startAngle + (val / maxSpeed) * totalAngle;
    const rad = toRad(angle);
    const isMajor = i % 2 === 0;
    const r1 = R - (isMajor ? 0 : 8);
    const r2 = R - (isMajor ? 22 : 16);
    ticks.push({
      x1: cx + r1 * Math.cos(rad),
      y1: cy + r1 * Math.sin(rad),
      x2: cx + r2 * Math.cos(rad),
      y2: cy + r2 * Math.sin(rad),
      major: isMajor,
      val,
      angle,
    });
  }

  // Labels nos múltiplos de 20
  const labels = [0, 40, 80, 120, 160, 200, 220].map(val => {
    const angle = startAngle + (val / maxSpeed) * totalAngle;
    const rad = toRad(angle);
    const lr = R - 42;
    return { x: cx + lr * Math.cos(rad), y: cy + lr * Math.sin(rad), val };
  });

  return (
    <svg viewBox="0 0 520 400" className="w-full h-full" style={{ maxWidth: 520 }}>
      <defs>
        <radialGradient id="speedo-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1C1C1C"/>
          <stop offset="100%" stopColor="#0A0A0A"/>
        </radialGradient>
        <filter id="glow-red">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-white">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Fundo circular */}
      <circle cx={cx} cy={cy} r={R + 20} fill="url(#speedo-bg)" opacity="0.95"/>
      <circle cx={cx} cy={cy} r={R + 20} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>

      {/* Anel externo */}
      <circle cx={cx} cy={cy} r={R + 8} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>

      {/* Arco de fundo cinza */}
      <path d={arcPath(R, startAngle, endAngle)} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" strokeLinecap="round"/>

      {/* Arco de progresso vermelho */}
      {speed > 0 && (
        <path
          d={arcPath(R, startAngle, progressEnd)}
          fill="none"
          stroke="#C41E1E"
          strokeWidth="12"
          strokeLinecap="round"
          filter="url(#glow-red)"
          style={{ transition: "none" }}
        />
      )}

      {/* Zona vermelha (160+) */}
      <path
        d={arcPath(R, startAngle + (160 / maxSpeed) * totalAngle, endAngle)}
        fill="none"
        stroke="rgba(196,30,30,0.2)"
        strokeWidth="20"
        strokeLinecap="round"
      />

      {/* Marcações */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={t.val >= 160 ? "rgba(196,30,30,0.7)" : "rgba(255,255,255,0.4)"}
          strokeWidth={t.major ? 2 : 1}
        />
      ))}

      {/* Labels */}
      {labels.map((l, i) => (
        <text
          key={i}
          x={l.x} y={l.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={l.val >= 160 ? "rgba(196,30,30,0.8)" : "rgba(255,255,255,0.5)"}
          fontSize="14"
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight="500"
        >
          {l.val}
        </text>
      ))}

      {/* Ponteiro */}
      <line
        x1={cx} y1={cy}
        x2={needleX} y2={needleY}
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#glow-white)"
      />
      {/* Ponta vermelha do ponteiro */}
      <line
        x1={cx} y1={cy}
        x2={cx + (R * 0.15) * Math.cos(toRad(needleAngle + 180))}
        y2={cy + (R * 0.15) * Math.sin(toRad(needleAngle + 180))}
        stroke="#C41E1E"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Centro do velocímetro */}
      <circle cx={cx} cy={cy} r="14" fill="#1A1A1A" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
      <circle cx={cx} cy={cy} r="5" fill="#C41E1E"/>

      {/* Display de velocidade */}
      <text
        x={cx} y={cy + 60}
        textAnchor="middle"
        fill="white"
        fontSize="48"
        fontFamily="'Space Grotesk', sans-serif"
        fontWeight="700"
        letterSpacing="-1"
      >
        {speed}
      </text>
      <text
        x={cx} y={cy + 88}
        textAnchor="middle"
        fill="rgba(255,255,255,0.4)"
        fontSize="13"
        fontFamily="'DM Sans', sans-serif"
        letterSpacing="3"
      >
        KM/H
      </text>

      {/* Label THAYSSA dentro do velocímetro */}
      <text
        x={cx} y={cy + 116}
        textAnchor="middle"
        fill="rgba(196,30,30,0.7)"
        fontSize="11"
        fontFamily="'DM Sans', sans-serif"
        fontWeight="700"
        letterSpacing="4"
      >
        THAYSSA
      </text>
    </svg>
  );
}

export default function Hero() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const show = (minPhase: number, delay = "0s") => ({
    opacity: phase >= minPhase ? 1 : 0,
    transform: phase >= minPhase ? "translateY(0) translateX(0)" : "translateY(20px)",
    transition: `opacity 0.7s ease ${delay}, transform 0.7s ease ${delay}`,
  });

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-[#0A0A0A]">

      {/* Linhas de fundo decorativas */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 60px,
          rgba(255,255,255,0.012) 60px,
          rgba(255,255,255,0.012) 61px
        )`
      }}/>

      {/* Glow vermelho difuso */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(196,30,30,0.12) 0%, transparent 70%)" }}/>

      {/* LAYOUT: texto esquerda + velocímetro direita */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-24">

        {/* ESQUERDA — texto */}
        <div>
          {/* Label */}
          <div style={show(1)} className="flex items-center gap-3 mb-8">
            <div className="w-8 h-[1px] bg-[#C41E1E]"/>
            <span className="text-[#9B8E7E] text-[11px] tracking-[0.25em] font-['DM_Sans'] uppercase">
              Cosmos · Rio de Janeiro
            </span>
          </div>

          {/* Headline */}
          <div style={show(2)} className="mb-6">
            <h1 className="font-['DM_Sans'] font-black leading-none tracking-tighter text-white"
              style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)" }}>
              SEU<br/>
              <span className="text-[#C41E1E]">PRÓXIMO</span><br/>
              VEÍCULO.
            </h1>
          </div>

          {/* Tagline drift */}
          <div style={{ ...show(2, "0.15s"), display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <span
              className="font-['Cormorant_Garamond'] italic text-[#9B8E7E] font-light"
              style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)" }}
            >
              Na largada desde o primeiro contato.
            </span>
          </div>

          {/* Subtítulo */}
          <div style={show(3, "0.1s")} className="mb-10">
            <p className="text-[#6B6B6B] text-sm font-['DM_Sans'] font-light leading-relaxed max-w-sm">
              Troca, financia e consigna. Carros e motos seminovos<br/>
              com procedência garantida em Cosmos, RJ.
            </p>
          </div>

          {/* CTAs */}
          <div style={show(3, "0.2s")} className="flex flex-col sm:flex-row gap-4 mb-14">
            <a href="#estoque"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#C41E1E] text-white font-['DM_Sans'] text-[11px] font-bold tracking-[0.25em] uppercase overflow-hidden">
              <span className="relative z-10">Ver estoque</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-500" style={{ transform: "skewX(-20deg)" }}/>
            </a>
            <a href="https://wa.me/5521969320071" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 border border-white/15 text-white font-['DM_Sans'] text-[11px] font-bold tracking-[0.25em] uppercase hover:border-white/40 transition-colors">
              💬 WhatsApp
            </a>
          </div>

          {/* Stats */}
          <div style={show(4, "0s")}
            className="grid grid-cols-2 gap-6 pt-8 border-t border-white/8">
            {[
              { num: "500+", label: "Veículos vendidos" },
              { num: "4.9★", label: "Avaliação Google" },
              { num: "100%", label: "Documentação OK" },
              { num: "5 anos", label: "De história" },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-white font-['Space_Grotesk'] font-bold text-xl mb-0.5">{s.num}</div>
                <div className="text-[#6B6B6B] text-[10px] tracking-[0.12em] uppercase font-['DM_Sans']">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* DIREITA — velocímetro */}
        <div
          className="flex items-center justify-center"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "scale(1) rotate(0deg)" : "scale(0.85) rotate(-8deg)",
            transition: "opacity 1s ease 0.2s, transform 1.2s cubic-bezier(0.22,1,0.36,1) 0.2s",
          }}
        >
          <div className="w-full max-w-[480px]">
            <Speedometer active={phase >= 1} />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        style={{ opacity: phase >= 4 ? 1 : 0, transition: "opacity 0.8s ease" }}>
        <div className="w-[1px] h-10 bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 w-full bg-[#C41E1E]"
            style={{ height: "40%", animation: "scrollPulse 1.8s ease-in-out infinite" }}/>
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
