import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../../services/api";

interface Categoria {
  id: number;
  nome: string;
  slug: string;
}

interface Historia {
  id: number;
  titulo: string;
  slug: string;
  capa_url: string | null;
  data_publicacao: string;
  categorias: Categoria[];
}

// Navbar compartilhada
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
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(15, 12, 26, 0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #2e2645",
        padding: "0 24px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link
        to="/"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.25rem",
          color: "#c9a96e",
          textDecoration: "none",
          fontWeight: 700,
        }}
      >
        Daraverso
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <Link
          to="/"
          style={{
            color: "#f0eaff",
            textDecoration: "none",
            fontFamily: "'Lora', serif",
            fontSize: "0.9rem",
          }}
        >
          Histórias
        </Link>
        {token && (
          <Link
            to="/leituras"
            style={{
              color: "#8b7fa8",
              textDecoration: "none",
              fontFamily: "'Lora', serif",
              fontSize: "0.9rem",
            }}
          >
            Minhas leituras
          </Link>
        )}
        {usuario?.is_admin && (
          <Link
            to="/admin"
            style={{
              color: "#c9a96e",
              textDecoration: "none",
              fontFamily: "'Lora', serif",
              fontSize: "0.9rem",
            }}
          >
            Admin
          </Link>
        )}
        {token ? (
          <button
            onClick={sair}
            style={{
              background: "none",
              border: "1px solid #2e2645",
              borderRadius: "8px",
              color: "#8b7fa8",
              cursor: "pointer",
              fontFamily: "'Lora', serif",
              fontSize: "0.85rem",
              padding: "6px 14px",
            }}
          >
            Sair
          </button>
        ) : (
          <Link
            to="/auth"
            style={{
              background: "linear-gradient(135deg, #c9a96e, #a8883f)",
              color: "#0f0c1a",
              borderRadius: "8px",
              padding: "6px 16px",
              fontFamily: "'Lora', serif",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}

export default function Home() {
  const [historias, setHistorias] = useState<Historia[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Busca categorias uma vez
  useEffect(() => {
    get("categorias/listar.php")
      .then((d) => setCategorias(d.categorias))
      .catch(console.error);
  }, []);

  // Busca histórias sempre que o filtro muda
  useEffect(() => {
    setCarregando(true);
    const endpoint = categoriaAtiva
      ? `historias/listar.php?categoria_id=${categoriaAtiva}`
      : "historias/listar.php";

    get(endpoint)
      .then((d) => setHistorias(d.historias))
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, [categoriaAtiva]);

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <Navbar />

      <main
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" }}
      >
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "0.85rem",
              color: "#c9a96e",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            ✦ boas vindas ao universo ✦
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              color: "#f0eaff",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "16px",
            }}
          >
            Histórias que
            <br />
            <em style={{ color: "#c9a96e" }}>atravessam mundos</em>
          </h1>
          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "1rem",
              color: "#8b7fa8",
              fontStyle: "italic",
            }}
          >
            Explore universos criados com palavras
          </p>
        </div>

        {/* Filtros de categoria */}
        {categorias.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "40px",
            }}
          >
            <button
              onClick={() => setCategoriaAtiva(null)}
              style={{
                background:
                  categoriaAtiva === null
                    ? "linear-gradient(135deg, #c9a96e, #a8883f)"
                    : "rgba(26, 21, 48, 0.7)",
                border: categoriaAtiva === null ? "none" : "1px solid #2e2645",
                borderRadius: "20px",
                padding: "6px 18px",
                color: categoriaAtiva === null ? "#0f0c1a" : "#8b7fa8",
                fontFamily: "'Lora', serif",
                fontSize: "0.875rem",
                cursor: "pointer",
                fontWeight: categoriaAtiva === null ? 600 : 400,
                transition: "all 0.2s",
              }}
            >
              Todas
            </button>
            {categorias.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoriaAtiva(c.id)}
                style={{
                  background:
                    categoriaAtiva === c.id
                      ? "linear-gradient(135deg, #c9a96e, #a8883f)"
                      : "rgba(26, 21, 48, 0.7)",
                  border:
                    categoriaAtiva === c.id ? "none" : "1px solid #2e2645",
                  borderRadius: "20px",
                  padding: "6px 18px",
                  color: categoriaAtiva === c.id ? "#0f0c1a" : "#8b7fa8",
                  fontFamily: "'Lora', serif",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  fontWeight: categoriaAtiva === c.id ? 600 : 400,
                  transition: "all 0.2s",
                }}
              >
                {c.nome}
              </button>
            ))}
          </div>
        )}

        {/* Estados */}
        {carregando && (
          <p
            style={{
              color: "#8b7fa8",
              fontFamily: "'Lora', serif",
              fontStyle: "italic",
              textAlign: "center",
              padding: "60px 0",
            }}
          >
            Abrindo o grimório...
          </p>
        )}

        {!carregando && historias.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div
              style={{ fontSize: "2.5rem", marginBottom: "16px", opacity: 0.4 }}
            >
              ✦
            </div>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.2rem",
                color: "#8b7fa8",
              }}
            >
              Nenhuma história encontrada
            </p>
          </div>
        )}

        {/* Grid de histórias */}
        {!carregando && historias.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "24px",
            }}
          >
            {historias.map((h) => (
              <Link
                key={h.id}
                to={`/historia/${h.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "rgba(26, 21, 48, 0.8)",
                    border: "1px solid #2e2645",
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition:
                      "transform 0.25s, border-color 0.25s, box-shadow 0.25s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = "translateY(-6px)";
                    el.style.borderColor = "#c9a96e44";
                    el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = "translateY(0)";
                    el.style.borderColor = "#2e2645";
                    el.style.boxShadow = "none";
                  }}
                >
                  {/* Capa */}
                  <div
                    style={{
                      height: "260px",
                      background: h.capa_url
                        ? `url(${h.capa_url}) center/cover`
                        : "linear-gradient(160deg, #2e2645 0%, #1a1530 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {!h.capa_url && (
                      <span
                        style={{
                          color: "#c9a96e",
                          opacity: 0.3,
                          fontSize: "2rem",
                        }}
                      >
                        ✦
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "16px" }}>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1rem",
                        color: "#f0eaff",
                        fontWeight: 600,
                        marginBottom: "10px",
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {h.titulo}
                    </h3>
                    <div
                      style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}
                    >
                      {h.categorias.slice(0, 2).map((c) => (
                        <span
                          key={c.id}
                          style={{
                            background: "rgba(201, 169, 110, 0.1)",
                            border: "1px solid rgba(201, 169, 110, 0.2)",
                            borderRadius: "20px",
                            padding: "2px 9px",
                            fontSize: "0.72rem",
                            color: "#c9a96e",
                            fontFamily: "'Lora', serif",
                          }}
                        >
                          {c.nome}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
