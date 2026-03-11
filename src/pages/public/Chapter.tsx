import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { get } from "../../services/api";

interface Capitulo {
  id: number;
  titulo: string;
  conteudo: string;
  ordem: number;
  historia_titulo: string;
  historia_slug: string;
  total_capitulos: number;
}

function Navbar({ historiaSlug, historiaTitulo }: { historiaSlug: string; historiaTitulo: string }) {
  const navigate = useNavigate();
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
      <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
        <Link to="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#c9a96e", textDecoration: "none", fontWeight: 700, flexShrink: 0 }}>
          Daraverso
        </Link>
        <span style={{ color: "#2e2645" }}>›</span>
        <Link to={`/historia/${historiaSlug}`} style={{
          fontFamily: "'Lora', serif", fontSize: "0.85rem", color: "#8b7fa8",
          textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {historiaTitulo}
        </Link>
      </div>
      {token && (
        <button onClick={sair} style={{ background: "none", border: "1px solid #2e2645", borderRadius: "8px", color: "#8b7fa8", cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "0.85rem", padding: "6px 14px", flexShrink: 0 }}>
          Sair
        </button>
      )}
    </nav>
  );
}

export default function Chapter() {
  const { slug, ordem } = useParams<{ slug: string; ordem: string }>();
  const navigate = useNavigate();
  const [capitulo, setCapitulo] = useState<Capitulo | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!slug || !ordem) return;

    // Primeiro busca o ID da história pelo slug
    get(`historias/detalhe.php?slug=${slug}`)
      .then((d) => get(`capitulos/detalhe.php?historia_id=${d.historia.id}&ordem=${ordem}`))
      .then((d) => setCapitulo(d.capitulo))
      .catch(() => navigate(`/historia/${slug}`))
      .finally(() => setCarregando(false));
  }, [slug, ordem]);

  if (carregando || !capitulo) {
    return (
      <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
        {slug && <Navbar historiaSlug={slug} historiaTitulo="..." />}
        <p style={{ color: "#8b7fa8", fontFamily: "'Lora', serif", fontStyle: "italic", textAlign: "center", padding: "100px 0" }}>Abrindo capítulo...</p>
      </div>
    );
  }

  const ordemAtual = capitulo.ordem;
  const temAnterior = ordemAtual > 1;
  const temProximo = ordemAtual < capitulo.total_capitulos;

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <Navbar historiaSlug={capitulo.historia_slug} historiaTitulo={capitulo.historia_titulo} />

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 24px" }}>
        {/* Cabeçalho do capítulo */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontFamily: "'Lora', serif", fontSize: "0.8rem", color: "#c9a96e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
            Capítulo {ordemAtual}
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "#f0eaff", fontWeight: 700, lineHeight: 1.25 }}>
            {capitulo.titulo}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", justifyContent: "center", marginTop: "24px" }}>
            <div style={{ width: "48px", height: "1px", background: "#2e2645" }} />
            <span style={{ color: "#c9a96e", fontSize: "0.8rem", opacity: 0.6 }}>✦</span>
            <div style={{ width: "48px", height: "1px", background: "#2e2645" }} />
          </div>
        </div>

        {/* Conteúdo */}
        <div style={{
          fontFamily: "'Lora', serif", fontSize: "1.1rem", lineHeight: 1.9,
          color: "#e8e0f5", whiteSpace: "pre-wrap", marginBottom: "64px",
        }}>
          {capitulo.conteudo}
        </div>

        {/* Separador final */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
          <div style={{ flex: 1, height: "1px", background: "#2e2645" }} />
          <span style={{ color: "#c9a96e", fontSize: "0.8rem", opacity: 0.5 }}>fim do capítulo</span>
          <div style={{ flex: 1, height: "1px", background: "#2e2645" }} />
        </div>

        {/* Navegação entre capítulos */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
          {temAnterior ? (
            <Link
              to={`/historia/${capitulo.historia_slug}/capitulo/${ordemAtual - 1}`}
              style={{
                background: "rgba(26, 21, 48, 0.8)", border: "1px solid #2e2645",
                borderRadius: "12px", padding: "12px 20px",
                color: "#8b7fa8", fontFamily: "'Lora', serif", fontSize: "0.9rem",
                textDecoration: "none", transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "#c9a96e44"}
              onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2e2645"}
            >
              ← Capítulo anterior
            </Link>
          ) : (
            <div />
          )}

          <Link to={`/historia/${capitulo.historia_slug}`} style={{ color: "#8b7fa8", fontFamily: "'Lora', serif", fontSize: "0.8rem", textDecoration: "none" }}>
            Ver todos
          </Link>

          {temProximo ? (
            <Link
              to={`/historia/${capitulo.historia_slug}/capitulo/${ordemAtual + 1}`}
              style={{
                background: "linear-gradient(135deg, #c9a96e, #a8883f)",
                borderRadius: "12px", padding: "12px 20px",
                color: "#0f0c1a", fontFamily: "'Lora', serif", fontSize: "0.9rem",
                fontWeight: 600, textDecoration: "none", transition: "opacity 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
            >
              Próximo capítulo →
            </Link>
          ) : (
            <Link
              to={`/historia/${capitulo.historia_slug}`}
              style={{
                background: "rgba(201, 169, 110, 0.1)", border: "1px solid rgba(201, 169, 110, 0.25)",
                borderRadius: "12px", padding: "12px 20px",
                color: "#c9a96e", fontFamily: "'Lora', serif", fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              ✦ Fim da história
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
