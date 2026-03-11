import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  lida_em: string;
  categorias: Categoria[];
}

// Navbar compartilhada
function Navbar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

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
        <Link to="/leituras" style={{ color: "#f0eaff", textDecoration: "none", fontFamily: "'Lora', serif", fontSize: "0.9rem" }}>Minhas leituras</Link>
        {usuario?.is_admin && (
          <Link to="/admin" style={{ color: "#c9a96e", textDecoration: "none", fontFamily: "'Lora', serif", fontSize: "0.9rem" }}>Admin</Link>
        )}
        <button onClick={sair} style={{
          background: "none", border: "1px solid #2e2645", borderRadius: "8px",
          color: "#8b7fa8", cursor: "pointer", fontFamily: "'Lora', serif",
          fontSize: "0.85rem", padding: "6px 14px", transition: "all 0.2s",
        }}>
          Sair
        </button>
      </div>
    </nav>
  );
}

export default function Reads() {
  const [historias, setHistorias] = useState<Historia[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token") ?? undefined;
    get("leituras/minhas.php", token)
      .then((dados) => setHistorias(dados.historias))
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <Navbar />

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>
        {/* Cabeçalho */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#f0eaff", fontWeight: 700, marginBottom: "8px" }}>
            Minhas leituras
          </h1>
          <p style={{ fontFamily: "'Lora', serif", fontSize: "0.95rem", color: "#8b7fa8", fontStyle: "italic" }}>
            Histórias que você já percorreu
          </p>
        </div>

        {/* Estados */}
        {carregando && (
          <p style={{ color: "#8b7fa8", fontFamily: "'Lora', serif", fontStyle: "italic", textAlign: "center", padding: "60px 0" }}>
            Buscando suas leituras...
          </p>
        )}

        {!carregando && historias.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "16px", opacity: 0.4 }}>✦</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#8b7fa8" }}>
              Nenhuma história lida ainda
            </p>
            <Link to="/" style={{ display: "inline-block", marginTop: "16px", color: "#c9a96e", fontFamily: "'Lora', serif", fontSize: "0.9rem" }}>
              Explorar histórias →
            </Link>
          </div>
        )}

        {/* Lista de leituras */}
        {!carregando && historias.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {historias.map((h) => (
              <Link
                key={h.id}
                to={`/historia/${h.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  display: "flex", gap: "20px", alignItems: "center",
                  background: "rgba(26, 21, 48, 0.7)", border: "1px solid #2e2645",
                  borderRadius: "16px", padding: "16px 20px",
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
                  {/* Capa pequena */}
                  <div style={{
                    width: "52px", height: "72px", borderRadius: "8px", flexShrink: 0,
                    background: h.capa_url ? `url(${h.capa_url}) center/cover` : "linear-gradient(135deg, #2e2645, #1a1530)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {!h.capa_url && <span style={{ color: "#c9a96e", opacity: 0.4, fontSize: "1.2rem" }}>✦</span>}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "#f0eaff", fontWeight: 600, marginBottom: "6px" }}>
                      {h.titulo}
                    </h3>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                      {h.categorias.map((c) => (
                        <span key={c.id} style={{
                          background: "rgba(201, 169, 110, 0.12)", border: "1px solid rgba(201, 169, 110, 0.2)",
                          borderRadius: "20px", padding: "2px 10px",
                          fontSize: "0.75rem", color: "#c9a96e", fontFamily: "'Lora', serif",
                        }}>
                          {c.nome}
                        </span>
                      ))}
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#8b7fa8", fontFamily: "'Lora', serif" }}>
                      Lida em {formatarData(h.lida_em)}
                    </p>
                  </div>

                  <span style={{ color: "#2e2645", fontSize: "1.2rem" }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
