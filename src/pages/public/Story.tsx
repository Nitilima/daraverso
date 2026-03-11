import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { get, post } from "../../services/api";

interface Categoria { id: number; nome: string; slug: string; }
interface Aviso { id: number; nome: string; slug: string; }
interface Capitulo { id: number; titulo: string; ordem: number; }

interface Historia {
  id: number;
  titulo: string;
  slug: string;
  sinopse: string | null;
  capa_url: string | null;
  classificacao_etaria: string;
  categorias: Categoria[];
  avisos: Aviso[];
  ja_lida: boolean;
}

function Navbar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const token = localStorage.getItem("token");

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/auth");
  }

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 10,
      background: "rgba(15, 12, 26, 0.9)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid #2e2645",
      padding: "0 24px", height: "60px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <Link to="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", color: "#c9a96e", textDecoration: "none", fontWeight: 700 }}>
        Daraverso
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <Link to="/" style={{ color: "#8b7fa8", textDecoration: "none", fontFamily: "'Lora', serif", fontSize: "0.9rem" }}>Histórias</Link>
        {token && <Link to="/leituras" style={{ color: "#8b7fa8", textDecoration: "none", fontFamily: "'Lora', serif", fontSize: "0.9rem" }}>Minhas leituras</Link>}
        {usuario?.is_admin && <Link to="/admin" style={{ color: "#c9a96e", textDecoration: "none", fontFamily: "'Lora', serif", fontSize: "0.9rem" }}>Admin</Link>}
        {token ? (
          <button onClick={sair} style={{ background: "none", border: "1px solid #2e2645", borderRadius: "8px", color: "#8b7fa8", cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "0.85rem", padding: "6px 14px" }}>Sair</button>
        ) : (
          <Link to="/auth" style={{ background: "linear-gradient(135deg, #c9a96e, #a8883f)", color: "#0f0c1a", borderRadius: "8px", padding: "6px 16px", fontFamily: "'Lora', serif", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>Entrar</Link>
        )}
      </div>
    </nav>
  );
}

export default function Story() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [historia, setHistoria] = useState<Historia | null>(null);
  const [capitulos, setCapitulos] = useState<Capitulo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [marcando, setMarcando] = useState(false);
  const [jaLida, setJaLida] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!slug) return;
    get(`historias/detalhe.php?slug=${slug}`, token ?? undefined)
      .then((d) => {
        setHistoria(d.historia);
        setJaLida(d.historia.ja_lida ?? false);
        // Busca capítulos após ter o id da história
        return get(`capitulos/listar.php?historia_id=${d.historia.id}`);
      })
      .then((d) => setCapitulos(d.capitulos ?? []))
      .catch(() => navigate("/"))
      .finally(() => setCarregando(false));
  }, [slug]);

  async function marcarComoLida() {
    if (!historia || !token) { navigate("/auth"); return; }
    setMarcando(true);
    try {
      await post("leituras/marcar.php", { historia_id: historia.id }, token);
      setJaLida(true);
    } catch (err) {
      console.error(err);
    } finally {
      setMarcando(false);
    }
  }

  if (carregando) {
    return (
      <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
        <Navbar />
        <p style={{ color: "#8b7fa8", fontFamily: "'Lora', serif", fontStyle: "italic", textAlign: "center", padding: "100px 0" }}>Carregando...</p>
      </div>
    );
  }

  if (!historia) return null;

  const temCapitulos = capitulos.length > 0;

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <Navbar />

      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "48px 24px" }}>
        <Link to="/" style={{ color: "#8b7fa8", textDecoration: "none", fontFamily: "'Lora', serif", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "40px" }}>
          ← Voltar às histórias
        </Link>

        {/* Layout principal */}
        <div style={{ display: "flex", gap: "36px", alignItems: "flex-start", marginBottom: "40px" }}>
          {/* Capa */}
          <div style={{
            width: "160px", minWidth: "160px", height: "220px", borderRadius: "12px", flexShrink: 0,
            background: historia.capa_url ? `url(${historia.capa_url}) center/cover` : "linear-gradient(160deg, #2e2645 0%, #1a1530 100%)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px #2e2645",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {!historia.capa_url && <span style={{ color: "#c9a96e", opacity: 0.3, fontSize: "2rem" }}>✦</span>}
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            {/* Categorias */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
              {historia.categorias.map((c) => (
                <span key={c.id} style={{
                  background: "rgba(201, 169, 110, 0.12)", border: "1px solid rgba(201, 169, 110, 0.25)",
                  borderRadius: "20px", padding: "2px 10px",
                  fontSize: "0.75rem", color: "#c9a96e", fontFamily: "'Lora', serif",
                }}>{c.nome}</span>
              ))}
            </div>

            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#f0eaff", fontWeight: 700, lineHeight: 1.2, marginBottom: "12px" }}>
              {historia.titulo}
            </h1>

            {/* Classificação etária */}
            {historia.classificacao_etaria && historia.classificacao_etaria !== "Livre" && (
              <div style={{ marginBottom: "10px" }}>
                <span style={{
                  background: "rgba(224, 112, 112, 0.12)", border: "1px solid rgba(224, 112, 112, 0.3)",
                  borderRadius: "8px", padding: "3px 10px",
                  fontSize: "0.78rem", color: "#e07070", fontFamily: "'Lora', serif",
                }}>
                  Não recomendado para menores de {historia.classificacao_etaria.replace("+", "")} anos
                </span>
              </div>
            )}

            {/* Avisos */}
            {(historia.avisos?.length ?? 0) > 0 && (
              <div style={{ marginBottom: "12px" }}>
                <span style={{ fontFamily: "'Lora', serif", fontSize: "0.72rem", color: "#8b7fa8", letterSpacing: "0.05em", textTransform: "uppercase", marginRight: "8px" }}>Avisos:</span>
                {(historia.avisos ?? []).map((a) => (
                  <span key={a.id} style={{
                    background: "rgba(224, 112, 112, 0.08)", border: "1px solid rgba(224, 112, 112, 0.2)",
                    borderRadius: "20px", padding: "1px 8px", marginRight: "4px",
                    fontSize: "0.72rem", color: "#e07070", fontFamily: "'Lora', serif",
                  }}>{a.nome}</span>
                ))}
              </div>
            )}

            {/* Capítulos info */}
            {temCapitulos && (
              <p style={{ fontFamily: "'Lora', serif", fontSize: "0.85rem", color: "#8b7fa8", marginBottom: "16px" }}>
                {capitulos.length} {capitulos.length === 1 ? "capítulo" : "capítulos"}
              </p>
            )}
          </div>
        </div>

        {/* Sinopse */}
        {historia.sinopse && (
          <div style={{
            background: "rgba(26, 21, 48, 0.7)", border: "1px solid #2e2645",
            borderRadius: "16px", padding: "24px 28px", marginBottom: "32px",
          }}>
            <p style={{ fontFamily: "'Lora', serif", fontSize: "0.8rem", color: "#c9a96e", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>Sinopse</p>
            <p style={{ fontFamily: "'Lora', serif", fontSize: "1rem", color: "#c8bfe0", lineHeight: 1.8, fontStyle: "italic" }}>
              {historia.sinopse}
            </p>
          </div>
        )}

        {/* Separador */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div style={{ flex: 1, height: "1px", background: "#2e2645" }} />
          <span style={{ color: "#c9a96e", fontSize: "0.8rem", opacity: 0.6 }}>✦</span>
          <div style={{ flex: 1, height: "1px", background: "#2e2645" }} />
        </div>

        {/* Lista de capítulos OU botão ler */}
        {temCapitulos ? (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#f0eaff", fontWeight: 600, marginBottom: "16px" }}>
              Capítulos
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {capitulos.map((c) => (
                <Link
                  key={c.id}
                  to={`/historia/${slug}/capitulo/${c.ordem}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: "rgba(26, 21, 48, 0.7)", border: "1px solid #2e2645",
                      borderRadius: "12px", padding: "16px 20px",
                      display: "flex", alignItems: "center", gap: "16px",
                      transition: "border-color 0.2s, transform 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "#c9a96e44";
                      (e.currentTarget as HTMLDivElement).style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "#2e2645";
                      (e.currentTarget as HTMLDivElement).style.transform = "translateX(0)";
                    }}
                  >
                    <span style={{ fontFamily: "'Lora', serif", fontSize: "0.8rem", color: "#c9a96e", minWidth: "24px" }}>
                      {c.ordem}
                    </span>
                    <span style={{ fontFamily: "'Lora', serif", fontSize: "0.95rem", color: "#f0eaff", flex: 1 }}>
                      {c.titulo}
                    </span>
                    <span style={{ color: "#2e2645", fontSize: "1rem" }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Link
              to={`/historia/${slug}/ler`}
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #c9a96e, #a8883f)",
                color: "#0f0c1a", borderRadius: "12px", padding: "14px 32px",
                fontFamily: "'Lora', serif", fontSize: "1rem", fontWeight: 600,
                textDecoration: "none", transition: "opacity 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
            >
              ✦ Ler história
            </Link>

            {/* Marcar como lida (apenas para histórias sem capítulos) */}
            {token && (
              <div style={{ marginTop: "16px" }}>
                {jaLida ? (
                  <p style={{ color: "#c9a96e", fontFamily: "'Lora', serif", fontSize: "0.875rem" }}>✦ Você já leu esta história</p>
                ) : (
                  <button onClick={marcarComoLida} disabled={marcando} style={{
                    background: "none", border: "none", color: "#8b7fa8",
                    cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "0.875rem",
                    textDecoration: "underline", textUnderlineOffset: "3px",
                  }}>
                    {marcando ? "Salvando..." : "Marcar como lida"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
