import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get, post, put, del } from "../../services/api";

interface Categoria {
  id: number;
  nome: string;
  slug: string;
}

export default function AdminHistory() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [novoNome, setNovoNome] = useState("");
  const [criando, setCriando] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editandoNome, setEditandoNome] = useState("");
  const [erro, setErro] = useState("");

  const token = localStorage.getItem("token") ?? undefined;

  function carregarCategorias() {
    get("admin/categorias/listar.php", token)
      .then((d) => setCategorias(d.categorias))
      .catch(console.error)
      .finally(() => setCarregando(false));
  }

  useEffect(() => { carregarCategorias(); }, []);

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    if (!novoNome.trim()) return;
    setCriando(true);
    setErro("");
    try {
      await post("admin/categorias/criar.php", { nome: novoNome }, token);
      setNovoNome("");
      carregarCategorias();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao criar");
    } finally {
      setCriando(false);
    }
  }

  async function salvarEdicao(id: number) {
    if (!editandoNome.trim()) return;
    setErro("");
    try {
      await put("admin/categorias/atualizar.php", { id, nome: editandoNome }, token);
      setEditandoId(null);
      carregarCategorias();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar");
    }
  }

  async function deletar(id: number, nome: string) {
    if (!confirm(`Deletar a categoria "${nome}"? Essa ação não pode ser desfeita.`)) return;
    setErro("");
    try {
      await del("admin/categorias/deletar.php", { id }, token);
      carregarCategorias();
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
          <span style={{ fontFamily: "'Lora', serif", fontSize: "0.85rem", color: "#f0eaff" }}>Categorias</span>
        </div>
        <button onClick={sair} style={{ background: "none", border: "1px solid #2e2645", borderRadius: "8px", color: "#8b7fa8", cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "0.85rem", padding: "6px 14px" }}>
          Sair
        </button>
      </nav>

      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#f0eaff", fontWeight: 700, marginBottom: "32px" }}>
          Categorias
        </h1>

        {/* Formulário criar */}
        <form onSubmit={criar} style={{ display: "flex", gap: "10px", marginBottom: "32px" }}>
          <input
            className="input-celestial"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            placeholder="Nome da nova categoria"
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            disabled={criando}
            className="btn-primario"
            style={{ width: "auto", padding: "12px 20px", whiteSpace: "nowrap" }}
          >
            {criando ? "..." : "+ Criar"}
          </button>
        </form>

        {erro && <p style={{ color: "#e07070", fontFamily: "'Lora', serif", fontSize: "0.875rem", marginBottom: "16px" }}>{erro}</p>}

        {/* Lista */}
        {carregando && (
          <p style={{ color: "#8b7fa8", fontFamily: "'Lora', serif", fontStyle: "italic" }}>Carregando...</p>
        )}

        {!carregando && categorias.length === 0 && (
          <p style={{ color: "#8b7fa8", fontFamily: "'Lora', serif", fontStyle: "italic" }}>Nenhuma categoria cadastrada.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {categorias.map((c) => (
            <div key={c.id} style={{
              background: "rgba(26, 21, 48, 0.8)", border: "1px solid #2e2645",
              borderRadius: "12px", padding: "14px 18px",
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              {editandoId === c.id ? (
                <>
                  <input
                    className="input-celestial"
                    value={editandoNome}
                    onChange={(e) => setEditandoNome(e.target.value)}
                    style={{ flex: 1 }}
                    autoFocus
                  />
                  <button onClick={() => salvarEdicao(c.id)} style={{ background: "none", border: "none", color: "#c9a96e", cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "0.875rem" }}>
                    Salvar
                  </button>
                  <button onClick={() => setEditandoId(null)} style={{ background: "none", border: "none", color: "#8b7fa8", cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "0.875rem" }}>
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span style={{ flex: 1, fontFamily: "'Lora', serif", color: "#f0eaff", fontSize: "0.95rem" }}>{c.nome}</span>
                  <span style={{ fontFamily: "'Lora', serif", color: "#2e2645", fontSize: "0.8rem" }}>{c.slug}</span>
                  <button onClick={() => { setEditandoId(c.id); setEditandoNome(c.nome); }} style={{ background: "none", border: "none", color: "#8b7fa8", cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "0.875rem" }}>
                    Editar
                  </button>
                  <button onClick={() => deletar(c.id, c.nome)} style={{ background: "none", border: "none", color: "#e07070", cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "0.875rem" }}>
                    Deletar
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
