import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { get, post } from "../../services/api";

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

interface Historia {
  id: number;
  titulo: string;
  slug: string;
  sinopse: string | null;
  conteudo: string;
  capa_url: string | null;
  classificacao_etaria: string;
  data_publicacao: string;
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
        {token && (
          <Link to="/leituras" style={{ color: "#8b7fa8", textDecoration: "none", fontFamily: "'Lora', serif", fontSize: "0.9rem" }}>Minhas leituras</Link>
        )}
        {usuario?.is_admin && (
          <Link to="/admin" style={{ color: "#c9a96e", textDecoration: "none", fontFamily: "'Lora', serif", fontSize: "0.9rem" }}>Admin</Link>
        )}
        {token ? (
          <button onClick={sair} style={{
            background: "none", border: "1px solid #2e2645", borderRadius: "8px",
            color: "#8b7fa8", cursor: "pointer", fontFamily: "'Lora', serif",
            fontSize: "0.85rem", padding: "6px 14px",
          }}>
            Sair
          </button>
        ) : (
          <Link to="/auth" style={{
            background: "linear-gradient(135deg, #c9a96e, #a8883f)",
            color: "#0f0c1a", borderRadius: "8px", padding: "6px 16px",
            fontFamily: "'Lora', serif", fontSize: "0.85rem", fontWeight: 600,
            textDecoration: "none",
          }}>
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}

export default function Detail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [historia, setHistoria] = useState<Historia | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [marcando, setMarcando] = useState(false);
  const [jaLida, setJaLida] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!slug) return;
    const header = token ?? undefined;
    get(`historias/detalhe.php?slug=${slug}`, header)
      .then((d) => {
        setHistoria(d.historia);
        setJaLida(d.historia.ja_lida ?? false);
      })
      .catch(() => navigate("/"))
      .finally(() => setCarregando(false));
  }, [slug]);

  async function marcarComoLida() {
    if (!historia || !token) {
      navigate("/auth");
      return;
    }
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
        <p style={{ color: "#8b7fa8", fontFamily: "'Lora', serif", fontStyle: "italic", textAlign: "center", padding: "100px 0" }}>
          Abrindo a história...
        </p>
      </div>
    );
  }

  if (!historia) return null;

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <Navbar />

      {/* Capa de fundo com gradiente */}
      {historia.capa_url && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 0,
          background: `url(${historia.capa_url}) center/cover`,
          opacity: 0.06, pointerEvents: "none",
        }} />
      )}

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 24px", position: "relative", zIndex: 1 }}>
        {/* Voltar */}
        <Link to="/" style={{ color: "#8b7fa8", textDecoration: "none", fontFamily: "'Lora', serif", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "32px" }}>
          ← Voltar às histórias
        </Link>

        {/* Capa */}
        {historia.capa_url && (
          <div style={{
            width: "160px", height: "220px", borderRadius: "12px", margin: "0 auto 32px",
            background: `url(${historia.capa_url}) center/cover`,
            boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px #2e2645",
          }} />
        )}

        {/* Cabeçalho */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          {/* Categorias */}
          <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap", marginBottom: "16px" }}>
            {historia.categorias.map((c) => (
              <span key={c.id} style={{
                background: "rgba(201, 169, 110, 0.12)", border: "1px solid rgba(201, 169, 110, 0.25)",
                borderRadius: "20px", padding: "3px 12px",
                fontSize: "0.8rem", color: "#c9a96e", fontFamily: "'Lora', serif",
              }}>
                {c.nome}
              </span>
            ))}
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            color: "#f0eaff", fontWeight: 700, lineHeight: 1.25, marginBottom: "16px",
          }}>
            {historia.titulo}
          </h1>

          {/* Classificação etária */}
          {historia.classificacao_etaria && historia.classificacao_etaria !== "Livre" && (
            <div style={{ marginBottom: "12px" }}>
              <span style={{
                background: "rgba(224, 112, 112, 0.12)", border: "1px solid rgba(224, 112, 112, 0.3)",
                borderRadius: "8px", padding: "4px 12px",
                fontSize: "0.8rem", color: "#e07070", fontFamily: "'Lora', serif",
              }}>
                Não recomendado para menores de {historia.classificacao_etaria.replace("+", "")} anos
              </span>
            </div>
          )}

          {/* Avisos de conteúdo */}
          {(historia.avisos?.length ?? 0) > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontFamily: "'Lora', serif", fontSize: "0.75rem", color: "#8b7fa8", marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Avisos
              </p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                {(historia.avisos ?? []).map((a) => (
                  <span key={a.id} style={{
                    background: "rgba(224, 112, 112, 0.08)", border: "1px solid rgba(224, 112, 112, 0.2)",
                    borderRadius: "20px", padding: "2px 10px",
                    fontSize: "0.75rem", color: "#e07070", fontFamily: "'Lora', serif",
                  }}>
                    {a.nome}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sinopse */}
          {historia.sinopse && (
            <p style={{
              fontFamily: "'Lora', serif", fontSize: "1rem", color: "#8b7fa8",
              fontStyle: "italic", lineHeight: 1.7, marginBottom: "20px",
              maxWidth: "520px", margin: "0 auto 20px",
            }}>
              "{historia.sinopse}"
            </p>
          )}

          {/* Separador */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", justifyContent: "center", marginBottom: "32px" }}>
            <div style={{ width: "48px", height: "1px", background: "#2e2645" }} />
            <span style={{ color: "#c9a96e", fontSize: "0.8rem", opacity: 0.7 }}>✦</span>
            <div style={{ width: "48px", height: "1px", background: "#2e2645" }} />
          </div>
        </div>

        {/* Conteúdo da história */}
        <div style={{
          fontFamily: "'Lora', serif", fontSize: "1.1rem", lineHeight: 1.9,
          color: "#e8e0f5",
          whiteSpace: "pre-wrap",
          marginBottom: "56px",
        }}>
          {historia.conteudo}
        </div>

        {/* Separador final */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
          <div style={{ flex: 1, height: "1px", background: "#2e2645" }} />
          <span style={{ color: "#c9a96e", fontSize: "0.8rem", opacity: 0.5 }}>fim</span>
          <div style={{ flex: 1, height: "1px", background: "#2e2645" }} />
        </div>

        {/* Botão marcar como lida */}
        <div style={{ textAlign: "center" }}>
          {jaLida ? (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(201, 169, 110, 0.08)", border: "1px solid rgba(201, 169, 110, 0.2)",
              borderRadius: "12px", padding: "12px 24px",
              color: "#c9a96e", fontFamily: "'Lora', serif", fontSize: "0.95rem",
            }}>
              ✦ Você já leu esta história
            </div>
          ) : (
            <button
              onClick={marcarComoLida}
              disabled={marcando}
              className="btn-primario"
              style={{ maxWidth: "280px" }}
            >
              {marcando ? "Salvando..." : token ? "✦ Marcar como lida" : "Entre para marcar como lida"}
            </button>
          )}
        </div>

        {/* Rodapé */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <Link to="/" style={{ color: "#8b7fa8", fontFamily: "'Lora', serif", fontSize: "0.875rem", textDecoration: "none", fontStyle: "italic" }}>
            ← Explorar mais histórias
          </Link>
        </div>
      </main>
    </div>
  );
}
