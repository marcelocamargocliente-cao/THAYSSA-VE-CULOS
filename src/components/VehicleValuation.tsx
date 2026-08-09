import { useState, ChangeEvent } from "react";

export default function VehicleValuation() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [km, setKm] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [shaking, setShaking] = useState(false);

  const formatWhatsapp = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits ? `(${digits}` : "";
    if (digits.length <= 7)
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleWhatsappChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWhatsapp(formatWhatsapp(e.target.value));
  };

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {};

    if (!brand) newErrors.brand = true;
    if (!model.trim()) newErrors.model = true;
    if (!year) newErrors.year = true;
    if (!km) newErrors.km = true;
    if (!whatsapp.trim() || whatsapp.replace(/\D/g, "").length < 10)
      newErrors.whatsapp = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }

    const message = `Olá! Quero avaliar meu veículo:
Marca: ${brand} | Modelo: ${model} | Ano: ${year}
KM: ${km} | Contato: ${whatsapp}${notes ? `\nObs: ${notes}` : ""}`;

    const url = `https://wa.me/5521969320071?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const brandsList = [
    "Chevrolet",
    "Fiat",
    "Ford",
    "Honda",
    "Hyundai",
    "Jeep",
    "KIA",
    "Mitsubishi",
    "Nissan",
    "Renault",
    "Toyota",
    "Volkswagen",
    "Yamaha",
    "Outra",
  ];

  const yearsList = Array.from({ length: 15 }, (_, i) => String(2024 - i));

  return (
    <section id="avaliacao" className="py-24 bg-[#FFFFFF]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#8B7355] text-[11px] font-medium tracking-[0.2em] font-['DM_Sans'] uppercase mb-2 block">
            AVALIAÇÃO GRATUITA
          </span>
          <h2 className="text-4xl md:text-6xl font-light text-[#1A1A1A] font-['Cormorant_Garamond'] mb-4">
            Quanto vale <span className="italic font-bold text-[#C41E1E]">seu veículo?</span>
          </h2>
          <p className="text-[#6B6B6B] text-sm md:text-base font-light font-['DM_Sans'] leading-relaxed">
            Preencha os dados e nossa equipe envia uma avaliação gratuita pelo WhatsApp em minutos.
          </p>
        </div>

        <div
          className={`max-w-[620px] mx-auto bg-[#F5F4F0] border border-[#E5E0D8] rounded-[8px] p-8 md:p-12 transition-transform ${
            shaking ? "animate-shake" : ""
          }`}
        >
          <div className="flex flex-col gap-5">
            {/* CAMPO 1: Marca */}
            <div>
              <label className="block text-[#9B8E7E] text-[11px] font-medium uppercase tracking-[0.1em] font-['DM_Sans'] mb-2">
                Marca *
              </label>
              <select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setErrors((prev) => ({ ...prev, brand: false }));
                }}
                className={`w-full bg-[#FFFFFF] border ${
                  errors.brand ? "border-[#C41E1E]" : "border-[#E5E0D8]"
                } rounded-[4px] px-4 py-3 text-sm text-[#1A1A1A] font-['DM_Sans'] focus:border-[#C41E1E] focus:outline-none transition-colors`}
              >
                <option value="">Selecione a marca...</option>
                {brandsList.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* CAMPO 2: Modelo */}
            <div>
              <label className="block text-[#9B8E7E] text-[11px] font-medium uppercase tracking-[0.1em] font-['DM_Sans'] mb-2">
                Modelo *
              </label>
              <input
                type="text"
                placeholder="Ex: Onix, Civic, Titan..."
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                  setErrors((prev) => ({ ...prev, model: false }));
                }}
                className={`w-full bg-[#FFFFFF] border ${
                  errors.model ? "border-[#C41E1E]" : "border-[#E5E0D8]"
                } rounded-[4px] px-4 py-3 text-sm text-[#1A1A1A] font-['DM_Sans'] focus:border-[#C41E1E] focus:outline-none transition-colors`}
              />
            </div>

            {/* Grid 2 colunas para Ano e KM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* CAMPO 3: Ano */}
              <div>
                <label className="block text-[#9B8E7E] text-[11px] font-medium uppercase tracking-[0.1em] font-['DM_Sans'] mb-2">
                  Ano *
                </label>
                <select
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    setErrors((prev) => ({ ...prev, year: false }));
                  }}
                  className={`w-full bg-[#FFFFFF] border ${
                    errors.year ? "border-[#C41E1E]" : "border-[#E5E0D8]"
                  } rounded-[4px] px-4 py-3 text-sm text-[#1A1A1A] font-['DM_Sans'] focus:border-[#C41E1E] focus:outline-none transition-colors`}
                >
                  <option value="">Selecione o ano...</option>
                  {yearsList.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* CAMPO 4: Quilometragem */}
              <div>
                <label className="block text-[#9B8E7E] text-[11px] font-medium uppercase tracking-[0.1em] font-['DM_Sans'] mb-2">
                  Quilometragem *
                </label>
                <select
                  value={km}
                  onChange={(e) => {
                    setKm(e.target.value);
                    setErrors((prev) => ({ ...prev, km: false }));
                  }}
                  className={`w-full bg-[#FFFFFF] border ${
                    errors.km ? "border-[#C41E1E]" : "border-[#E5E0D8]"
                  } rounded-[4px] px-4 py-3 text-sm text-[#1A1A1A] font-['DM_Sans'] focus:border-[#C41E1E] focus:outline-none transition-colors`}
                >
                  <option value="">Selecione a faixa...</option>
                  <option value="Até 20.000 km">Até 20.000 km</option>
                  <option value="20.001 a 50.000 km">20.001 a 50.000 km</option>
                  <option value="50.001 a 100.000 km">50.001 a 100.000 km</option>
                  <option value="Acima de 100.000 km">Acima de 100.000 km</option>
                </select>
              </div>
            </div>

            {/* CAMPO 5: Seu WhatsApp */}
            <div>
              <label className="block text-[#9B8E7E] text-[11px] font-medium uppercase tracking-[0.1em] font-['DM_Sans'] mb-2">
                Seu WhatsApp *
              </label>
              <input
                type="tel"
                placeholder="(21) 99999-9999"
                value={whatsapp}
                onChange={handleWhatsappChange}
                className={`w-full bg-[#FFFFFF] border ${
                  errors.whatsapp ? "border-[#C41E1E]" : "border-[#E5E0D8]"
                } rounded-[4px] px-4 py-3 text-sm text-[#1A1A1A] font-['DM_Sans'] focus:border-[#C41E1E] focus:outline-none transition-colors`}
              />
            </div>

            {/* CAMPO 6: Observações */}
            <div>
              <label className="block text-[#9B8E7E] text-[11px] font-medium uppercase tracking-[0.1em] font-['DM_Sans'] mb-2">
                Observações (opcional)
              </label>
              <textarea
                rows={3}
                placeholder="Algum detalhe importante? Acessórios, revisões..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#E5E0D8] rounded-[4px] px-4 py-3 text-sm text-[#1A1A1A] font-['DM_Sans'] focus:border-[#C41E1E] focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Botão Enviar */}
            <button
              onClick={handleSubmit}
              type="button"
              className="w-full bg-[#C41E1E] text-white py-4 px-6 rounded-[4px] font-['DM_Sans'] font-bold text-sm uppercase tracking-wider hover:bg-[#a81818] transition-colors mt-2"
            >
              Quero minha avaliação gratuita →
            </button>

            {/* Aviso de privacidade */}
            <p className="text-[#9B8E7E] text-[11px] font-light text-center font-['DM_Sans'] mt-2">
              🔒 Seus dados são usados apenas para a avaliação. Não compartilhamos com terceiros.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
