import { useEffect, useRef, useState } from "react";

function Speedometer({ active }: { active: boolean }) {
  const [speed, setSpeed] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const oscillating = useRef(false);
  const oscRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;

    // Fase 1: acelera de 0 → 220 em 2s
    const accelerate = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const p = Math.min((now - startRef.current) / 2000, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setSpeed(Math.round(eased * 220));
      if (p < 1) {
        rafRef.current = requestAnimationFrame(accelerate);
      } else {
        // Fase 2: oscila entre 195 e 220 indefinidamente
        oscillating.current = true;
        oscRef.current = 0;
        const oscillate = () => {
          oscRef.current += 0.04;
          // Oscilação suave: seno com amplitude ±12 e deriva lenta
          const osc = Math.sin(oscRef.current * 1.3) * 12
                    + Math.sin(oscRef.current * 0.7) * 6;
          setSpeed(Math.round(208 + osc));
          rafRef.current = requestAnimationFrame(oscillate);
        };
        rafRef.current = requestAnimationFrame(oscillate);
      }
    };

    rafRef.current = requestAnimationFrame(accelerate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  const cx = 220; const cy = 215; const R = 178;
  const startAngle = -220; const endAngle = 40;
  const totalAngle = endAngle - startAngle;
  const maxSpeed = 220;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const needleAngle = startAngle + (speed / maxSpeed) * totalAngle;
  const needleX = cx + (R - 20) * Math.cos(toRad(needleAngle));
  const needleY = cy + (R - 20) * Math.sin(toRad(needleAngle));

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
    <svg viewBox="0 0 440 360" className="w-full h-full">
      <defs>
        <radialGradient id="sbg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1C1C1C"/>
          <stop offset="100%" stopColor="#060606"/>
        </radialGradient>
        <filter id="gr"><feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="gw"><feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      <circle cx={cx} cy={cy} r={R+22} fill="url(#sbg)"/>
      <circle cx={cx} cy={cy} r={R+22} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5"/>
      <circle cx={cx} cy={cy} r={R+10} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>

      <path d={arcPath(R,startAngle,endAngle)} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" strokeLinecap="round"/>
      <path d={arcPath(R,startAngle+(160/maxSpeed)*totalAngle,endAngle)} fill="none" stroke="rgba(196,30,30,0.15)" strokeWidth="10" strokeLinecap="round"/>
      {speed > 0 && (
        <path d={arcPath(R,startAngle,progressEnd)} fill="none" stroke="#C41E1E" strokeWidth="5" strokeLinecap="round" filter="url(#gr)"/>
      )}

      {ticks.map((t,i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={t.val>=160?"rgba(196,30,30,0.6)":"rgba(255,255,255,0.3)"}
          strokeWidth={t.major?2:1}/>
      ))}
      {labels.map((l,i) => (
        <text key={i} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle"
          fill={l.val>=160?"rgba(196,30,30,0.7)":"rgba(255,255,255,0.4)"}
          fontSize="12" fontFamily="'Space Grotesk',sans-serif" fontWeight="500">{l.val}</text>
      ))}

      {/* Ponteiro */}
      <line x1={cx} y1={cy} x2={needleX} y2={needleY}
        stroke="white" strokeWidth="2.5" strokeLinecap="round" filter="url(#gw)"/>
      <line x1={cx} y1={cy}
        x2={cx+(R*0.13)*Math.cos(toRad(needleAngle+180))}
        y2={cy+(R*0.13)*Math.sin(toRad(needleAngle+180))}
        stroke="#C41E1E" strokeWidth="2.5" strokeLinecap="round"/>

      <circle cx={cx} cy={cy} r="12" fill="#111" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
      <circle cx={cx} cy={cy} r="4.5" fill="#C41E1E"/>

      <text x={cx} y={cy+48} textAnchor="middle" fill="white"
        fontSize="42" fontFamily="'Space Grotesk',sans-serif" fontWeight="700" letterSpacing="-1">{speed}</text>
      <text x={cx} y={cy+70} textAnchor="middle" fill="rgba(255,255,255,0.3)"
        fontSize="11" fontFamily="'DM Sans',sans-serif" letterSpacing="3">KM/H</text>
      <text x={cx} y={cy+88} textAnchor="middle" fill="rgba(196,30,30,0.55)"
        fontSize="9" fontFamily="'DM Sans',sans-serif" fontWeight="700" letterSpacing="4">THAYSSA</text>
    </svg>
  );
}

export default function Hero() {
  const [phase, setPhase] = useState(0);
  const [offsetTop, setOffsetTop] = useState(109);

  useEffect(() => {
    // Mede a altura real do nav + marquee para calcular o espaço disponível
    const measure = () => {
      const nav = document.querySelector('nav');
      const marquee = document.querySelector('[class*="brands"]') || 
                       document.querySelector('[class*="BrandsMarquee"]') ||
                       document.querySelector('.brands-track')?.closest('div');
      const navH = nav ? nav.getBoundingClientRect().bottom : 73;
      const marqueeEl = document.querySelector('[class*="bg-\\[#F0EDE8\\]"]');
      const marqueeH = marqueeEl ? marqueeEl.getBoundingClientRect().bottom : 109;
      setOffsetTop(Math.round(marqueeH));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 900),
      setTimeout(() => setPhase(4), 2200),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  const tr = (p: number, delay = "0s") => ({
    opacity: phase >= p ? 1 : 0,
    transform: phase >= p ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.55s ease ${delay}, transform 0.55s ease ${delay}`,
  });

  return (
    <section
      className="relative flex items-center overflow-hidden bg-[#0A0A0A] py-10"
      style={{ minHeight:"calc(100dvh - 109px)", maxHeight:"calc(100dvh - 109px)" }}
    >
      {/* Linhas diagonais fundo */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage:"repeating-linear-gradient(-45deg,transparent,transparent 60px,rgba(255,255,255,0.012) 60px,rgba(255,255,255,0.012) 61px)"
      }}/>

      {/* Glow vermelho */}
      <div className="absolute z-0 pointer-events-none" style={{
        top:"50%", right:"18%", width:520, height:520, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(196,30,30,0.11) 0%,transparent 70%)",
        transform:"translate(50%,-50%)"
      }}/>

      {/* MARCA D'ÁGUA — BCO&CIA atrás do conteúdo */}
      <div className="absolute inset-0 z-0 flex items-center pointer-events-none overflow-hidden"
        style={{
          opacity: phase >= 2 ? 1 : 0,
          transition: "opacity 1.5s ease 0.5s",
        }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 900,
          fontSize: "clamp(8rem, 20vw, 18rem)",
          letterSpacing: "-0.02em",
          color: "transparent",
          WebkitTextStroke: "1px rgba(196,30,30,0.25)",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          userSelect: "none",
          lineHeight: 1,
          position: "absolute",
          left: "-2%",
          top: "50%",
          transform: "translateY(-50%)",
        }}>
          BCO&CIA
        </span>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16
        grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 lg:items-center"
      >

        {/* ESQUERDA */}
        <div className="flex flex-col">

          {/* Nome da marca — GRANDE e impactante */}
          <div style={tr(1,"0.05s")} className="mb-3">
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2.8rem,7vw,6rem)",
              letterSpacing: "-0.02em",
              lineHeight: 0.9,
              textTransform: "uppercase",
            }}>
              <span style={{
                background: "linear-gradient(90deg, #C41E1E 0%, #FF4444 50%, #C41E1E 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 3s linear infinite",
                display: "block",
              }}>Thayssa</span>
              <span style={{ color: "#fff", display: "block" }}>Veículos</span>
            </div>
          </div>
          <style>{`
            @keyframes shimmer {
              0% { background-position: 0% center; }
              100% { background-position: 200% center; }
            }
          `}</style>

          {/* Headline — menor, como subtítulo */}
          <div style={tr(2,"0.05s")} className="mb-2">
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(1rem,2vw,1.4rem)",
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.05em",
              lineHeight: 1.3,
            }}>
              Seu próximo veículo,<br/>na largada desde o primeiro contato.
            </p>
          </div>

          <div style={tr(3,"0.05s")} className="mb-3">
            <p className="text-[#4A4A4A] text-xs font-['DM_Sans'] font-light leading-relaxed max-w-xs">
              Troca, financia e consigna.<br/>
              Carros e motos seminovos em Cosmos, RJ.
            </p>
          </div>

          <div style={tr(3,"0.1s")} className="flex flex-wrap gap-3 mb-4">
            <a href="#estoque"
              className="group relative inline-flex items-center gap-2 px-8 py-3 bg-[#C41E1E] text-white font-['DM_Sans'] text-[10px] font-bold tracking-[0.22em] uppercase overflow-hidden">
              <span className="relative z-10">Ver estoque</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-500" style={{transform:"skewX(-20deg)"}}/>
            </a>
            <a href="https://wa.me/5521969320071" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 border border-white/15 text-white font-['DM_Sans'] text-[10px] font-bold tracking-[0.22em] uppercase hover:border-white/40 transition-colors">
              💬 WhatsApp
            </a>
          </div>

          <div style={tr(4)} className="grid grid-cols-4 gap-4 pt-3 border-t border-white/8">
            {[
              { num:"500+", label:"Vendidos" },
              { num:"4.9★", label:"Google" },
              { num:"100%", label:"Doc. OK" },
              { num:"5 anos", label:"História" },
            ].map((s,i) => (
              <div key={i}>
                <div className="text-white font-['Space_Grotesk'] font-bold leading-none mb-0.5"
                  style={{ fontSize:"clamp(0.95rem,1.6vw,1.15rem)" }}>{s.num}</div>
                <div className="text-[#444] text-[9px] tracking-[0.1em] uppercase font-['DM_Sans']">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* DIREITA — velocímetro */}
        <div className="hidden lg:flex items-center justify-center" style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "scale(1) rotate(0deg)" : "scale(0.82) rotate(-10deg)",
          transition: "opacity 1s ease 0.1s, transform 1.2s cubic-bezier(0.22,1,0.36,1) 0.1s",
        }}>
          <Speedometer active={phase >= 1}/>
        </div>
      </div>

      {/* Scroll indicator removido para ganhar espaço */}
    </section>
  );
}
