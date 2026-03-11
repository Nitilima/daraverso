import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get, del } from "../../services/api";

interface Categoria {
  id: number;
  nome: string;
  slug: string;
}

interface Historia {
  id: number;
  titulo: string;
  slug: string;
  publicada: number;
  data_publicacao: string | null;
  categorias: Categoria[];
}

export default function ListHistory() {
  const navigate = useNavigate();
  const [historias, setHistorias] = useState<Historia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const token = localStorage.getItem("token") ?? undefined;

  function carregar() {
    get("admin/historias/listar.php", token)
      .then((d) => setHistorias(d.historias))
      .catch(console.error)
      .finally(() => setCarregando(false));
  }

  useEffect(() => { carregar(); }, []);

  async function deletar(id: number, titulo: string) {
    if (!confirm(`Deletar "${titulo}"? Essa ação não pode ser desfeita.`)) return;
    setErro("");
    try {
      await del("admin/historias/deletar.php", { id }, token);
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao deletar");
    }
  }

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/auth");
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
          <span style={{ fontFamily: "'Lora', serif", fontSize: "0.85rem", color: "#f0eaff" }}>Histórias</span>
        </div>
        <button onClick={sair} style={{ background: "none", border: "1px solid #2e2645", borderRadius: "8px", color: "#8b7fa8", cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "0.85rem", padding: "6px 14px" }}>
          Sair
        </button>
      </nav>

      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 24px" }}>
        {/* Cabeçalho */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#f0eaff", fontWeight: 700 }}>
            Histórias
          </h1>
          <Link to="/admin/historias/nova" style={{
            background: "linear-gradient(135deg, #c9a96e, #a8883f)",
            color: "#0f0c1a", borderRadius: "10px", padding: "10px 20px",
            fontFamily: "'Lora', serif", fontSize: "0.875rem", fontWeight: 600,
            textDecoration: "none",
          }}>
            + Nova história
          </Link>
        </div>

        {erro && <p style={{ color: "#e07070", fontFamily: "'Lora', serif", fontSize: "0.875rem", marginBottom: "16px" }}>{erro}</p>}

        {carregando && (
          <p style={{ color: "#8b7fa8", fontFamily: "'Lora', serif", fontStyle: "italic" }}>Carregando...</p>
        )}

        {!carregando && historias.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontFamily: "'Lora', serif", color: "#8b7fa8", fontStyle: "italic" }}>Nenhuma história cadastrada ainda.</p>
            <Link to="/admin/historias/nova" style={{ display: "inline-block", marginTop: "16px", color: "#c9a96e", fontFamily: "'Lora', serif", fontSize: "0.9rem" }}>
              Criar a primeira →
            </Link>
          </div>
        )}

        {/* Lista */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {historias.map((h) => (
            <div key={h.id} style={{
              background: "rgba(26, 21, 48, 0.8)", border: "1px solid #2e2645",
              borderRadius: "14px", padding: "18px 22px",
              display: "flex", alignItems: "center", gap: "16px",
            }}>
              {/* Status publicada */}
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                background: h.publicada ? "#6bc98e" : "#8b7fa8",
              }} title={h.publicada ? "Publicada" : "Rascunho"} />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif", fontSize: "1rem",
                  color: "#f0eaff", fontWeight: 600, marginBottom: "6px",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {h.titulo}
                </h3>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {h.categorias.slice(0, 3).map((c) => (
                    <span key={c.id} style={{
                      background: "rgba(201, 169, 110, 0.1)", border: "1px solid rgba(201, 169, 110, 0.15)",
                      borderRadius: "20px", padding: "1px 9px",
                      fontSize: "0.72rem", color: "#c9a96e", fontFamily: "'Lora', serif",
                    }}>
                      {c.nome}
                    </span>
                  ))}
                </div>
              </div>

              {/* Badge status */}
              <span style={{
                fontFamily: "'Lora', serif", fontSize: "0.75rem",
                color: h.publicada ? "#6bc98e" : "#8b7fa8",
                flexShrink: 0,
              }}>
                {h.publicada ? "Publicada" : "Rascunho"}
              </span>

              {/* Ações */}
              <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
                <Link
                  to={`/historia/${h.slug}`}
                  style={{ color: "#8b7fa8", fontFamily: "'Lora', serif", fontSize: "0.85rem", textDecoration: "none" }}
                >
                  Ver
                </Link>
                <Link
                  to={`/admin/historias/${h.id}/capitulos`}
                  style={{ color: "#8b7fa8", fontFamily: "'Lora', serif", fontSize: "0.85rem", textDecoration: "none" }}
                >
                  Capítulos
                </Link>
                <Link
                  to={`/admin/historias/${h.id}/editar`}
                  style={{ color: "#c9a96e", fontFamily: "'Lora', serif", fontSize: "0.85rem", textDecoration: "none" }}
                >
                  Editar
                </Link>
                <button
                  onClick={() => deletar(h.id, h.titulo)}
                  style={{ background: "none", border: "none", color: "#e07070", cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "0.85rem", padding: 0 }}
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
