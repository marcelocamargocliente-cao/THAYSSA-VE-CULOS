import { useState, useEffect, useRef } from "react";
import { supabaseAdmin, STORAGE_URL, VehicleDB, GaleriaDB } from "../lib/supabase";


const SB_URL = 'https://kvywklyujlnkotnckivd.supabase.co';
const SB_SK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2eXdrbHl1amxua290bmNraXZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjI4NzMwNSwiZXhwIjoyMTAxODYzMzA1fQ.r6xOZosUxLhv53O0lzHGbJ_8LAWfJ3W1GR1Kboc6fNI';
const sbFetch = async (path: string, opts: RequestInit = {}) => {
  const r = await fetch(`${SB_URL}${path}`, {
    ...opts,
    headers: {
      'apikey': SB_SK,
      'Authorization': `Bearer ${SB_SK}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
      ...(opts.headers || {}),
    }
  });
  return r;
};

const ADMIN_SESSION_KEY = "thayssa_admin";

function showToast(msg: string, tipo: "success" | "error" | "info" = "success") {
  const el = document.createElement("div");
  el.style.cssText = `position:fixed;bottom:90px;left:50%;transform:translateX(-50%);
    background:${tipo==="success"?"#22C55E":tipo==="error"?"#C41E1E":"#1A1A1A"};
    color:#fff;padding:10px 24px;border-radius:6px;font-family:'DM Sans',sans-serif;
    font-size:13px;font-weight:500;z-index:99999;animation:fadeIn .3s ease;
    box-shadow:0 4px 20px rgba(0,0,0,.2);white-space:nowrap`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

export default function AdminPanel() {
  const [visible, setVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [adminNome, setAdminNome] = useState("");
  const [aba, setAba] = useState<"estoque" | "galeria">("estoque");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [veiculos, setVeiculos] = useState<VehicleDB[]>([]);
  const [galeria, setGaleria] = useState<GaleriaDB[]>([]);
  const [editando, setEditando] = useState<VehicleDB | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galeriaInputRef = useRef<HTMLInputElement>(null);

  // Verificar sessão ao carregar
  useEffect(() => {
    const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (session) {
      const s = JSON.parse(session);
      setLoggedIn(true);
      setAdminNome(s.nome);
    }

    // Abrir painel via URL /?admin ou #admin
    const checkUrl = () => {
      if (window.location.search.includes("admin") || window.location.hash.includes("admin")) {
        setVisible(true);
        if (!sessionStorage.getItem(ADMIN_SESSION_KEY)) setShowLogin(true);
      }
    };
    checkUrl();
    window.addEventListener("hashchange", checkUrl);
    return () => window.removeEventListener("hashchange", checkUrl);
  }, []);

  useEffect(() => {
    if (loggedIn) fetchData();
  }, [loggedIn, aba]);

  const fetchData = async () => {
    if (aba === "estoque") {
      const r = await sbFetch('/rest/v1/estoque?select=*&order=ordem', { method: 'GET' });
      const data = await r.json();
      if (Array.isArray(data)) setVeiculos(data);
    } else {
      const r = await sbFetch('/rest/v1/galeria?select=*&order=ordem', { method: 'GET' });
      const data = await r.json();
      if (Array.isArray(data)) setGaleria(data);
    }
  };

  const handleLogin = async () => {
    if (!email || !senha) return;
    const loginR = await sbFetch(`/rest/v1/admins?email=eq.${encodeURIComponent(email)}&senha_hash=eq.${encodeURIComponent(senha)}&ativo=eq.true&select=id,nome&limit=1`, { method: 'GET' });
    const loginData = await loginR.json();
    const data = Array.isArray(loginData) && loginData.length > 0 ? loginData[0] : null;
    const error = !data;

    if (error || !data) {
      const loginCard = document.getElementById("login-card");
      if (loginCard) {
        loginCard.style.animation = "shake .4s ease";
        setTimeout(() => { loginCard.style.animation = ""; }, 400);
      }
      showToast("Email ou senha incorretos", "error");
      return;
    }

    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ id: data.id, nome: data.nome }));
    setLoggedIn(true);
    setAdminNome(data.nome);
    setShowLogin(false);
    setSidebarOpen(true);
    showToast(`Bem-vindo, ${data.nome}!`);

    // Atualizar último acesso
    await sbFetch(`/rest/v1/admins?id=eq.${data.id}`, { method: "PATCH", body: JSON.stringify({ ultimo_acesso: new Date().toISOString() }) });
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setLoggedIn(false);
    setSidebarOpen(false);
    window.location.hash = "";
    showToast("Sessão encerrada", "info");
  };

  const uploadFoto = async (file: File, bucket: string): Promise<string | null> => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const SUPABASE_URL = 'https://kvywklyujlnkotnckivd.supabase.co';
    const SK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2eXdrbHl1amxua290bmNraXZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjI4NzMwNSwiZXhwIjoyMTAxODYzMzA1fQ.r6xOZosUxLhv53O0lzHGbJ_8LAWfJ3W1GR1Kboc6fNI';

    const r = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${filename}`, {
      method: 'POST',
      headers: {
        'apikey': SK,
        'Authorization': `Bearer ${SK}`,
        'Content-Type': file.type || 'image/jpeg',
        'x-upsert': 'true'
      },
      body: file
    });

    setUploading(false);
    if (!r.ok) {
      const txt = await r.text();
      showToast(`Erro no upload: ${r.status} ${txt.slice(0,60)}`, "error");
      return null;
    }
    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filename}`;
  };

  const salvarVeiculo = async (v: VehicleDB) => {
    const SUPABASE_URL = 'https://kvywklyujlnkotnckivd.supabase.co';
    const SK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2eXdrbHl1amxua290bmNraXZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjI4NzMwNSwiZXhwIjoyMTAxODYzMzA1fQ.r6xOZosUxLhv53O0lzHGbJ_8LAWfJ3W1GR1Kboc6fNI';

    const r = await fetch(`${SUPABASE_URL}/rest/v1/estoque?id=eq.${v.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SK,
        'Authorization': `Bearer ${SK}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        nome: v.nome, tipo: v.tipo, marca: v.marca, modelo: v.modelo,
        ano: v.ano, km: v.km, preco_exibicao: v.preco_exibicao,
        whatsapp_msg: v.whatsapp_msg, destaque: v.destaque, foto_url: v.foto_url
      })
    });

    if (!r.ok) { showToast("Erro ao salvar: " + r.status, "error"); return; }
    showToast("✓ Veículo atualizado! Recarregando...");
    setEditando(null);
    fetchData();
    // Forçar reload do carrossel via evento customizado
    setTimeout(() => window.dispatchEvent(new Event('estoque-updated')), 500);
  };

  const uploadFotoVeiculo = async (file: File) => {
    if (!editando) return;
    const url = await uploadFoto(file, "fotos-estoque");
    if (url) setEditando(prev => prev ? { ...prev, foto_url: url } : prev);
  };

  const uploadFotoGaleria = async (file: File, galeriaId?: string) => {
    const url = await uploadFoto(file, "fotos-galeria");
    if (!url) return;
    if (galeriaId) {
      await sbFetch(`/rest/v1/galeria?id=eq.${galeriaId}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ foto_url: url }) });
      showToast("✓ Foto atualizada!");
    } else {
      const maxOrdem = galeria.length > 0 ? Math.max(...galeria.map(g => g.ordem)) + 1 : 1;
      await sbFetch("/rest/v1/galeria", { method: "POST", body: JSON.stringify({ foto_url: url, ordem: maxOrdem, ativo: true }) });
      showToast("✓ Foto adicionada!");
    }
    fetchData();
  };

  const removerFotoGaleria = async (id: string) => {
    await sbFetch(`/rest/v1/galeria?id=eq.${id}`, { method: "PATCH", body: JSON.stringify({ ativo: false }) });
    showToast("Foto removida", "info");
    fetchData();
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
        @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @keyframes fadeIn { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>

      {/* LOGIN OVERLAY */}
      {showLogin && !loggedIn && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.85)", zIndex:99998, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div id="login-card" style={{ background:"#1A1A1A", border:"1px solid #333", borderRadius:12, padding:"40px 36px", width:340, textAlign:"center" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:"#C41E1E", fontWeight:700, fontStyle:"italic", marginBottom:4 }}>Thayssa</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#9B8E7E", textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:28 }}>Painel Administrativo</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ background:"#111", border:"1px solid #333", borderRadius:6, padding:"11px 14px", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none" }}/>
              <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ background:"#111", border:"1px solid #333", borderRadius:6, padding:"11px 14px", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none" }}/>
            </div>
            <button onClick={handleLogin}
              style={{ width:"100%", background:"#C41E1E", color:"#fff", border:"none", borderRadius:6, padding:"12px", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, cursor:"pointer" }}>
              Entrar →
            </button>
            <button onClick={() => { setShowLogin(false); setVisible(false); window.location.hash=""; }}
              style={{ marginTop:12, background:"none", border:"none", color:"#9B8E7E", fontFamily:"'DM Sans',sans-serif", fontSize:12, cursor:"pointer" }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* BOTÃO ENGRENAGEM */}
      {loggedIn && (
        <button onClick={() => setSidebarOpen(o => !o)}
          style={{ position:"fixed", top:80, right:20, zIndex:9998, width:44, height:44, borderRadius:"50%", background:"#1A1A1A", border:"1px solid #333", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 12px rgba(0,0,0,.3)" }}
          title="Painel Admin">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9B8E7E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      )}

      {/* SIDEBAR */}
      {loggedIn && sidebarOpen && (
        <div style={{ position:"fixed", top:0, right:0, bottom:0, width:380, background:"#0A0A0A", borderLeft:"1px solid #222", zIndex:9997, display:"flex", flexDirection:"column", animation:"slideIn .3s ease", overflowY:"auto" }}>
          {/* Header */}
          <div style={{ padding:"16px 20px", borderBottom:"1px solid #222", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14, color:"#fff" }}>Painel Admin</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#9B8E7E" }}>{adminNome}</div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={handleLogout} style={{ background:"none", border:"1px solid #333", borderRadius:6, padding:"5px 12px", color:"#9B8E7E", fontFamily:"'DM Sans',sans-serif", fontSize:11, cursor:"pointer" }}>Sair</button>
              <button onClick={() => setSidebarOpen(false)} style={{ background:"none", border:"1px solid #333", borderRadius:6, padding:"5px 10px", color:"#9B8E7E", cursor:"pointer" }}>✕</button>
            </div>
          </div>

          {/* Abas */}
          <div style={{ display:"flex", borderBottom:"1px solid #222" }}>
            {(["estoque", "galeria"] as const).map(a => (
              <button key={a} onClick={() => setAba(a)}
                style={{ flex:1, padding:"12px", background:"none", border:"none", borderBottom: aba===a ? "2px solid #C41E1E" : "2px solid transparent", color: aba===a ? "#fff" : "#9B8E7E", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight: aba===a ? 600 : 400, cursor:"pointer", textTransform:"capitalize" }}>
                {a === "estoque" ? "🚗 Estoque" : "📸 Galeria"}
              </button>
            ))}
          </div>

          {/* CONTEÚDO ABA ESTOQUE */}
          {aba === "estoque" && (
            <div style={{ padding:16, flex:1 }}>
              {editando ? (
                <div>
                  <button onClick={() => setEditando(null)} style={{ background:"none", border:"none", color:"#9B8E7E", fontFamily:"'DM Sans',sans-serif", fontSize:12, cursor:"pointer", marginBottom:16 }}>← Voltar</button>
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {/* Foto */}
                    <div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#9B8E7E", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Foto do Veículo</div>
                      <div onClick={() => fileInputRef.current?.click()}
                        style={{ background:"#141414", border:"1px dashed #333", borderRadius:8, aspectRatio:"16/10", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", overflow:"hidden", position:"relative" }}>
                        {editando.foto_url ? (
                          <img src={editando.foto_url} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                        ) : (
                          <div style={{ textAlign:"center", color:"#9B8E7E", fontFamily:"'DM Sans',sans-serif", fontSize:13 }}>
                            {uploading ? "Enviando..." : "📷 Clique para adicionar foto"}
                          </div>
                        )}
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" style={{ display:"none" }}
                        onChange={e => { if (e.target.files?.[0]) uploadFotoVeiculo(e.target.files[0]); }}/>
                    </div>

                    {[
                      { label:"Nome", key:"nome" as const },
                      { label:"Marca", key:"marca" as const },
                      { label:"Modelo", key:"modelo" as const },
                    ].map(f => (
                      <div key={f.key}>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#9B8E7E", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>{f.label}</div>
                        <input value={editando[f.key] as string || ""} onChange={e => setEditando({ ...editando, [f.key]: e.target.value })}
                          style={{ width:"100%", background:"#141414", border:"1px solid #333", borderRadius:6, padding:"9px 12px", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none" }}/>
                      </div>
                    ))}

                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                      <div>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#9B8E7E", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Ano</div>
                        <input type="number" value={editando.ano || ""} onChange={e => setEditando({ ...editando, ano: parseInt(e.target.value) })}
                          style={{ width:"100%", background:"#141414", border:"1px solid #333", borderRadius:6, padding:"9px 12px", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none" }}/>
                      </div>
                      <div>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#9B8E7E", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>KM</div>
                        <input type="number" value={editando.km || ""} onChange={e => setEditando({ ...editando, km: parseInt(e.target.value) })}
                          style={{ width:"100%", background:"#141414", border:"1px solid #333", borderRadius:6, padding:"9px 12px", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none" }}/>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#9B8E7E", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Preço (exibição)</div>
                      <input value={editando.preco_exibicao || ""} onChange={e => setEditando({ ...editando, preco_exibicao: e.target.value })}
                        placeholder="R$ 68.900"
                        style={{ width:"100%", background:"#141414", border:"1px solid #333", borderRadius:6, padding:"9px 12px", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none" }}/>
                    </div>

                    <div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#9B8E7E", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Tipo</div>
                      <select value={editando.tipo} onChange={e => setEditando({ ...editando, tipo: e.target.value as VehicleDB["tipo"] })}
                        style={{ width:"100%", background:"#141414", border:"1px solid #333", borderRadius:6, padding:"9px 12px", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none" }}>
                        {["carro","moto","suv","pickup","outro"].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                      </select>
                    </div>

                    <div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#9B8E7E", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Mensagem WhatsApp</div>
                      <textarea value={editando.whatsapp_msg || ""} onChange={e => setEditando({ ...editando, whatsapp_msg: e.target.value })}
                        rows={2} style={{ width:"100%", background:"#141414", border:"1px solid #333", borderRadius:6, padding:"9px 12px", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none", resize:"vertical" }}/>
                    </div>

                    <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                      <input type="checkbox" checked={editando.destaque} onChange={e => setEditando({ ...editando, destaque: e.target.checked })}/>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#9B8E7E" }}>Destaque</span>
                    </label>

                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={() => salvarVeiculo(editando)}
                        style={{ flex:1, background:"#C41E1E", color:"#fff", border:"none", borderRadius:6, padding:"11px", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                        {uploading ? "Enviando..." : "✓ Salvar"}
                      </button>
                      <button onClick={() => setEditando(null)}
                        style={{ flex:1, background:"none", border:"1px solid #333", borderRadius:6, padding:"11px", color:"#9B8E7E", fontFamily:"'DM Sans',sans-serif", fontSize:13, cursor:"pointer" }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {veiculos.map(v => (
                    <div key={v.id} style={{ display:"flex", alignItems:"center", gap:10, background:"#141414", border:"1px solid #222", borderRadius:8, padding:"10px 12px" }}>
                      <div style={{ width:48, height:36, background:"#1A1A1A", borderRadius:4, overflow:"hidden", flexShrink:0 }}>
                        {v.foto_url ? <img src={v.foto_url} style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:"#333", fontSize:16 }}>🚗</div>}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{v.nome}</div>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#9B8E7E" }}>{v.preco_exibicao} · {v.ano}</div>
                      </div>
                      <button onClick={() => setEditando(v)}
                        style={{ background:"none", border:"1px solid #C41E1E", borderRadius:4, padding:"4px 10px", color:"#C41E1E", fontFamily:"'DM Sans',sans-serif", fontSize:11, cursor:"pointer", flexShrink:0 }}>
                        Editar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CONTEÚDO ABA GALERIA */}
          {aba === "galeria" && (
            <div style={{ padding:16, flex:1 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
                {galeria.map(g => (
                  <div key={g.id} style={{ position:"relative", aspectRatio:"1", borderRadius:6, overflow:"hidden", background:"#141414", cursor:"pointer" }}
                    onClick={() => { if (galeriaInputRef.current) { galeriaInputRef.current.dataset.id = g.id; galeriaInputRef.current.click(); } }}>
                    {g.foto_url ? <img src={g.foto_url} style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:"#333" }}>📷</div>}
                    <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.5)", opacity:0, transition:".2s", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}
                      onMouseEnter={e => (e.currentTarget.style.opacity="1")}
                      onMouseLeave={e => (e.currentTarget.style.opacity="0")}>
                      <span style={{ color:"#fff", fontSize:11, fontFamily:"'DM Sans',sans-serif" }}>✎ Trocar</span>
                      <button onClick={e => { e.stopPropagation(); removerFotoGaleria(g.id); }}
                        style={{ background:"#C41E1E", border:"none", borderRadius:4, padding:"2px 6px", color:"#fff", fontSize:10, cursor:"pointer" }}>✕</button>
                    </div>
                  </div>
                ))}

                {galeria.length < 12 && (
                  <div onClick={() => { if (galeriaInputRef.current) { galeriaInputRef.current.removeAttribute("data-id"); galeriaInputRef.current.click(); } }}
                    style={{ aspectRatio:"1", borderRadius:6, border:"1px dashed #333", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#9B8E7E", fontFamily:"'DM Sans',sans-serif", fontSize:11, flexDirection:"column", gap:4 }}>
                    <span style={{ fontSize:20 }}>+</span>
                    <span>Adicionar</span>
                  </div>
                )}
              </div>

              <input ref={galeriaInputRef} type="file" accept="image/*" style={{ display:"none" }}
                onChange={e => {
                  if (e.target.files?.[0]) {
                    const id = (e.target as HTMLInputElement).dataset.id;
                    uploadFotoGaleria(e.target.files[0], id);
                  }
                  e.target.value = "";
                }}/>

              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#9B8E7E", textAlign:"center", marginTop:8 }}>
                {uploading ? "Enviando foto..." : `${galeria.length}/12 fotos · Clique para trocar · ✕ para remover`}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
