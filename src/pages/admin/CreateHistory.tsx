import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { get, post, put } from "../../services/api";

interface Categoria {
  id: number;
  nome: string;
  slug: string;
}

interface Aviso {
  id: number;
  nome: string;
  slug: string;
}

interface HistoriaForm {
  titulo: string;
  sinopse: string;
  capa_url: string;
  classificacao_etaria: string;
  publicada: boolean;
  categorias_ids: number[];
  avisos_ids: number[];
}

const CLASSIFICACOES = [
  { valor: "Livre", label: "Livre — para todos os públicos" },
  { valor: "+14", label: "+14 — não recomendado para menores de 14 anos" },
  { valor: "+16", label: "+16 — não recomendado para menores de 16 anos" },
  { valor: "+18", label: "+18 — somente para maiores de 18 anos" },
];

const labelEstilo = {
  fontSize: "0.8rem", color: "#8b7fa8",
  fontFamily: "'Lora', serif", letterSpacing: "0.04em", textTransform: "uppercase" as const,
};

export default function CreateHistory() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const editando = !!id;

  const [form, setForm] = useState<HistoriaForm>({
    titulo: "",
    sinopse: "",
    capa_url: "",
    classificacao_etaria: "Livre",
    publicada: false,
    categorias_ids: [],
    avisos_ids: [],
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const token = localStorage.getItem("token") ?? undefined;

  // Carrega categorias e avisos disponíveis
  useEffect(() => {
    get("admin/categorias/listar.php", token)
      .then((d) => setCategorias(d.categorias))
      .catch(console.error);

    // Busca avisos direto do banco via endpoint público (ou admin)
    get("admin/avisos/listar.php", token)
      .then((d) => setAvisos(d.avisos))
      .catch(console.error);
  }, []);

  // Se editando, carrega os dados da história pelo ID
  useEffect(() => {
    if (!editando) return;
    get(`admin/historias/detalhe.php?id=${id}`, token)
      .then((d) => {
        const h = d.historia;
        if (!h) {
          setErro("História não encontrada.");
          return;
        }
        setForm({
          titulo: h.titulo ?? "",
          sinopse: h.sinopse ?? "",
          capa_url: h.capa_url ?? "",
          classificacao_etaria: h.classificacao_etaria ?? "Livre",
          publicada: !!h.publicada,
          categorias_ids: (h.categorias ?? []).map((c: Categoria) => c.id),
          avisos_ids: (h.avisos ?? []).map((a: Aviso) => a.id),
        });
      })
      .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao carregar história"))
      .finally(() => setCarregando(false));
  }, [id]);

  function toggleId(campo: "categorias_ids" | "avisos_ids", itemId: number) {
    setForm((prev) => ({
      ...prev,
      [campo]: prev[campo].includes(itemId)
        ? prev[campo].filter((i) => i !== itemId)
        : [...prev[campo], itemId],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro("");

    const endpoint = editando
      ? "admin/historias/atualizar.php"
      : "admin/historias/criar.php";

    const corpo = {
      ...(editando ? { id: Number(id) } : {}),
      titulo: form.titulo,
      sinopse: form.sinopse,
      capa_url: form.capa_url,
      classificacao_etaria: form.classificacao_etaria,
      publicada: form.publicada,
      categorias: form.categorias_ids,
      avisos: form.avisos_ids,
      data_publicacao: form.publicada
        ? new Date().toISOString().slice(0, 19).replace("T", " ")
        : null,
    };

    try {
      if (editando) {
        await put(endpoint, corpo, token);
      } else {
        await post(endpoint, corpo, token);
      }
      navigate("/admin/historias");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSalvando(false);
    }
  }

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/auth");
  }

  if (carregando) {
    return (
      <div style={{ minHeight: "100vh", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
        <p style={{ color: "#8b7fa8", fontFamily: "'Lora', serif", fontStyle: "italic" }}>Carregando história...</p>
        {erro && (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#e07070", fontFamily: "'Lora', serif", fontSize: "0.9rem", marginBottom: "12px" }}>{erro}</p>
            <Link to="/admin/historias" style={{ color: "#c9a96e", fontFamily: "'Lora', serif", fontSize: "0.875rem" }}>
              ← Voltar para histórias
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(15, 12, 26, 0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #2e2645",
        padding: "0 24px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link to="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", color: "#c9a96e", textDecoration: "none", fontWeight: 700 }}>Daraverso</Link>
          <span style={{ color: "#2e2645" }}>|</span>
          <Link to="/admin" style={{ fontFamily: "'Lora', serif", fontSize: "0.85rem", color: "#8b7fa8", textDecoration: "none" }}>Admin</Link>
          <span style={{ color: "#2e2645" }}>›</span>
          <Link to="/admin/historias" style={{ fontFamily: "'Lora', serif", fontSize: "0.85rem", color: "#8b7fa8", textDecoration: "none" }}>Histórias</Link>
          <span style={{ color: "#2e2645" }}>›</span>
          <span style={{ fontFamily: "'Lora', serif", fontSize: "0.85rem", color: "#f0eaff" }}>
            {editando ? "Editar" : "Nova história"}
          </span>
        </div>
        <button onClick={sair} style={{ background: "none", border: "1px solid #2e2645", borderRadius: "8px", color: "#8b7fa8", cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "0.85rem", padding: "6px 14px" }}>
          Sair
        </button>
      </nav>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#f0eaff", fontWeight: 700, marginBottom: "36px" }}>
          {editando ? "Editar história" : "Nova história"}
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Título */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={labelEstilo}>Título</label>
            <input
              className="input-celestial"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Título da história"
              required
            />
          </div>

          {/* URL da capa */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={labelEstilo}>URL da capa <span style={{ color: "#2e2645", textTransform: "none" }}>(opcional)</span></label>
            <input
              className="input-celestial"
              value={form.capa_url}
              onChange={(e) => setForm({ ...form, capa_url: e.target.value })}
              placeholder="https://..."
              type="url"
            />
            {form.capa_url && (
              <div style={{ width: "80px", height: "110px", borderRadius: "8px", marginTop: "4px", background: `url(${form.capa_url}) center/cover`, border: "1px solid #2e2645" }} />
            )}
          </div>

          {/* Sinopse */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={labelEstilo}>Sinopse <span style={{ color: "#2e2645", textTransform: "none" }}>(opcional)</span></label>
            <textarea
              className="input-celestial"
              value={form.sinopse}
              onChange={(e) => setForm({ ...form, sinopse: e.target.value })}
              placeholder="Uma breve descrição da história..."
              rows={3}
              style={{ resize: "vertical", lineHeight: 1.7 }}
            />
          </div>

          {/* Classificação etária */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={labelEstilo}>Classificação etária</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {CLASSIFICACOES.map((c) => {
                const ativa = form.classificacao_etaria === c.valor;
                return (
                  <label key={c.valor} style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    background: ativa ? "rgba(201, 169, 110, 0.08)" : "rgba(26, 21, 48, 0.5)",
                    border: `1px solid ${ativa ? "rgba(201, 169, 110, 0.3)" : "#2e2645"}`,
                    borderRadius: "10px", padding: "12px 16px",
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                    <input
                      type="radio"
                      name="classificacao"
                      value={c.valor}
                      checked={ativa}
                      onChange={() => setForm({ ...form, classificacao_etaria: c.valor })}
                      style={{ accentColor: "#c9a96e" }}
                    />
                    <span style={{ fontFamily: "'Lora', serif", fontSize: "0.9rem", color: ativa ? "#c9a96e" : "#8b7fa8" }}>
                      {c.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Categorias */}
          {categorias.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={labelEstilo}>Gêneros</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {categorias.map((c) => {
                  const ativa = form.categorias_ids.includes(c.id);
                  return (
                    <button key={c.id} type="button" onClick={() => toggleId("categorias_ids", c.id)} style={{
                      background: ativa ? "linear-gradient(135deg, #c9a96e, #a8883f)" : "rgba(26, 21, 48, 0.7)",
                      border: ativa ? "none" : "1px solid #2e2645",
                      borderRadius: "20px", padding: "6px 16px",
                      color: ativa ? "#0f0c1a" : "#8b7fa8",
                      fontFamily: "'Lora', serif", fontSize: "0.875rem",
                      cursor: "pointer", fontWeight: ativa ? 600 : 400, transition: "all 0.2s",
                    }}>
                      {c.nome}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Avisos */}
          {avisos.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={labelEstilo}>Avisos de conteúdo</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {avisos.map((a) => {
                  const ativo = form.avisos_ids.includes(a.id);
                  return (
                    <button key={a.id} type="button" onClick={() => toggleId("avisos_ids", a.id)} style={{
                      background: ativo ? "rgba(224, 112, 112, 0.15)" : "rgba(26, 21, 48, 0.7)",
                      border: `1px solid ${ativo ? "rgba(224, 112, 112, 0.4)" : "#2e2645"}`,
                      borderRadius: "20px", padding: "6px 16px",
                      color: ativo ? "#e07070" : "#8b7fa8",
                      fontFamily: "'Lora', serif", fontSize: "0.875rem",
                      cursor: "pointer", fontWeight: ativo ? 600 : 400, transition: "all 0.2s",
                    }}>
                      {a.nome}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Toggle publicar */}
          <div style={{
            display: "flex", alignItems: "center", gap: "14px",
            background: "rgba(26, 21, 48, 0.7)", border: "1px solid #2e2645",
            borderRadius: "12px", padding: "16px 20px",
          }}>
            <button type="button" onClick={() => setForm({ ...form, publicada: !form.publicada })} style={{
              width: "44px", height: "24px", borderRadius: "12px",
              background: form.publicada ? "#c9a96e" : "#2e2645",
              border: "none", cursor: "pointer", position: "relative",
              transition: "background 0.2s", flexShrink: 0,
            }}>
              <div style={{
                width: "18px", height: "18px", borderRadius: "50%",
                background: "#f0eaff", position: "absolute",
                top: "3px", left: form.publicada ? "23px" : "3px",
                transition: "left 0.2s",
              }} />
            </button>
            <div>
              <p style={{ fontFamily: "'Lora', serif", fontSize: "0.95rem", color: "#f0eaff" }}>
                {form.publicada ? "Publicada" : "Rascunho"}
              </p>
              <p style={{ fontFamily: "'Lora', serif", fontSize: "0.8rem", color: "#8b7fa8" }}>
                {form.publicada ? "Visível para todos no site" : "Apenas você pode ver"}
              </p>
            </div>
          </div>

          {erro && (
            <p style={{ color: "#e07070", fontFamily: "'Lora', serif", fontSize: "0.875rem", fontStyle: "italic" }}>{erro}</p>
          )}

          {/* Ações */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <Link to="/admin/historias" style={{
              border: "1px solid #2e2645", borderRadius: "10px", padding: "11px 20px",
              color: "#8b7fa8", fontFamily: "'Lora', serif", fontSize: "0.9rem",
              textDecoration: "none", display: "inline-flex", alignItems: "center",
            }}>
              Cancelar
            </Link>
            <button type="submit" disabled={salvando} className="btn-primario" style={{ width: "auto", padding: "11px 28px" }}>
              {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Criar história"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
