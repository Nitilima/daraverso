import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { get, post, put, del } from "../../services/api";

interface Capitulo {
  id: number;
  titulo: string;
  conteudo: string;
  ordem: number;
}

export default function AdminCapitulos() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [capitulos, setCapitulos] = useState<Capitulo[]>([]);
  const [historiaTitulo, setHistoriaTitulo] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Formulário de novo capítulo
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoConteudo, setNovoConteudo] = useState("");
  const [criando, setCriando] = useState(false);

  // Capítulo sendo editado
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editandoTitulo, setEditandoTitulo] = useState("");
  const [editandoConteudo, setEditandoConteudo] = useState("");

  const token = localStorage.getItem("token") ?? undefined;

  function carregar() {
    get(`admin/historias/detalhe.php?id=${id}`, token)
      .then((d) => setHistoriaTitulo(d.historia?.titulo ?? ""))
      .catch(console.error);

    get(`admin/capitulos/listar.php?historia_id=${id}`, token)
      .then((d) => setCapitulos(d.capitulos ?? []))
      .catch(console.error)
      .finally(() => setCarregando(false));
  }

  useEffect(() => { carregar(); }, [id]);

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    if (!novoTitulo.trim() || !novoConteudo.trim()) return;
    setCriando(true);
    setErro("");
    try {
      await post("admin/capitulos/criar.php", { historia_id: Number(id), titulo: novoTitulo, conteudo: novoConteudo }, token);
      setNovoTitulo("");
      setNovoConteudo("");
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao criar");
    } finally {
      setCriando(false);
    }
  }

  async function salvarEdicao() {
    if (!editandoId || !editandoTitulo.trim() || !editandoConteudo.trim()) return;
    setErro("");
    try {
      await put("admin/capitulos/atualizar.php", { id: editandoId, titulo: editandoTitulo, conteudo: editandoConteudo }, token);
      setEditandoId(null);
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar");
    }
  }

  async function deletar(capId: number, titulo: string) {
    if (!confirm(`Deletar o capítulo "${titulo}"? Essa ação não pode ser desfeita.`)) return;
    setErro("");
    try {
      await del("admin/capitulos/deletar.php", { id: capId }, token);
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
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link to="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", color: "#c9a96e", textDecoration: "none", fontWeight: 700 }}>Daraverso</Link>
          <span style={{ color: "#2e2645" }}>|</span>
          <Link to="/admin" style={{ fontFamily: "'Lora', serif", fontSize: "0.85rem", color: "#8b7fa8", textDecoration: "none" }}>Admin</Link>
          <span style={{ color: "#2e2645" }}>›</span>
          <Link to="/admin/historias" style={{ fontFamily: "'Lora', serif", fontSize: "0.85rem", color: "#8b7fa8", textDecoration: "none" }}>Histórias</Link>
          <span style={{ color: "#2e2645" }}>›</span>
          <span style={{ fontFamily: "'Lora', serif", fontSize: "0.85rem", color: "#f0eaff" }}>Capítulos</span>
        </div>
        <button onClick={sair} style={{ background: "none", border: "1px solid #2e2645", borderRadius: "8px", color: "#8b7fa8", cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "0.85rem", padding: "6px 14px" }}>
          Sair
        </button>
      </nav>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontFamily: "'Lora', serif", fontSize: "0.8rem", color: "#c9a96e", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>Capítulos de</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#f0eaff", fontWeight: 700 }}>
            {historiaTitulo || "..."}
          </h1>
        </div>

        {erro && <p style={{ color: "#e07070", fontFamily: "'Lora', serif", fontSize: "0.875rem", marginBottom: "16px" }}>{erro}</p>}

        {/* Lista de capítulos existentes */}
        {!carregando && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
            {capitulos.length === 0 && (
              <p style={{ color: "#8b7fa8", fontFamily: "'Lora', serif", fontStyle: "italic" }}>Nenhum capítulo ainda. Crie o primeiro abaixo.</p>
            )}
            {capitulos.map((c) => (
              <div key={c.id} style={{
                background: "rgba(26, 21, 48, 0.8)", border: "1px solid #2e2645",
                borderRadius: "12px", padding: "16px 20px",
              }}>
                {editandoId === c.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input
                      className="input-celestial"
                      value={editandoTitulo}
                      onChange={(e) => setEditandoTitulo(e.target.value)}
                      placeholder="Título do capítulo"
                    />
                    <textarea
                      className="input-celestial"
                      value={editandoConteudo}
                      onChange={(e) => setEditandoConteudo(e.target.value)}
                      rows={10}
                      style={{ resize: "vertical", lineHeight: 1.8 }}
                    />
                    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                      <button onClick={() => setEditandoId(null)} style={{ background: "none", border: "1px solid #2e2645", borderRadius: "8px", color: "#8b7fa8", cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "0.875rem", padding: "8px 16px" }}>
                        Cancelar
                      </button>
                      <button onClick={salvarEdicao} className="btn-primario" style={{ width: "auto", padding: "8px 20px" }}>
                        Salvar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontFamily: "'Lora', serif", fontSize: "0.8rem", color: "#c9a96e", minWidth: "20px" }}>{c.ordem}</span>
                    <span style={{ flex: 1, fontFamily: "'Lora', serif", fontSize: "0.95rem", color: "#f0eaff" }}>{c.titulo}</span>
                    <button
                      onClick={() => { setEditandoId(c.id); setEditandoTitulo(c.titulo); setEditandoConteudo(c.conteudo); }}
                      style={{ background: "none", border: "none", color: "#8b7fa8", cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "0.85rem" }}
                    >
                      Editar
                    </button>
                    <button onClick={() => deletar(c.id, c.titulo)} style={{ background: "none", border: "none", color: "#e07070", cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "0.85rem" }}>
                      Deletar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Separador */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
          <div style={{ flex: 1, height: "1px", background: "#2e2645" }} />
          <span style={{ color: "#c9a96e", fontSize: "0.75rem", opacity: 0.6 }}>novo capítulo</span>
          <div style={{ flex: 1, height: "1px", background: "#2e2645" }} />
        </div>

        {/* Formulário novo capítulo */}
        <form onSubmit={criar} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <input
            className="input-celestial"
            value={novoTitulo}
            onChange={(e) => setNovoTitulo(e.target.value)}
            placeholder="Título do capítulo"
            required
          />
          <textarea
            className="input-celestial"
            value={novoConteudo}
            onChange={(e) => setNovoConteudo(e.target.value)}
            placeholder="Conteúdo do capítulo..."
            required
            rows={14}
            style={{ resize: "vertical", lineHeight: 1.8 }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" disabled={criando} className="btn-primario" style={{ width: "auto", padding: "11px 28px" }}>
              {criando ? "Criando..." : `+ Adicionar capítulo ${capitulos.length + 1}`}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
