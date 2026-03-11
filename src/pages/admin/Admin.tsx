import { Link, useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/auth");
  }

  const cards = [
    {
      titulo: "Histórias",
      descricao: "Criar, editar e publicar histórias",
      icone: "✦",
      link: "/admin/historias",
    },
    {
      titulo: "Categorias",
      descricao: "Gerenciar categorias das histórias",
      icone: "◈",
      link: "/admin/categorias",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      {/* Navbar admin */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(15, 12, 26, 0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #2e2645",
        padding: "0 24px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link to="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", color: "#c9a96e", textDecoration: "none", fontWeight: 700 }}>
            Daraverso
          </Link>
          <span style={{ color: "#2e2645", fontSize: "1rem" }}>|</span>
          <span style={{ fontFamily: "'Lora', serif", fontSize: "0.85rem", color: "#8b7fa8" }}>Painel admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontFamily: "'Lora', serif", fontSize: "0.85rem", color: "#8b7fa8" }}>
            {usuario?.nome}
          </span>
          <Link to="/" style={{ color: "#8b7fa8", fontFamily: "'Lora', serif", fontSize: "0.85rem", textDecoration: "none" }}>Ver site</Link>
          <button onClick={sair} style={{
            background: "none", border: "1px solid #2e2645", borderRadius: "8px",
            color: "#8b7fa8", cursor: "pointer", fontFamily: "'Lora', serif",
            fontSize: "0.85rem", padding: "6px 14px",
          }}>
            Sair
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "56px 24px" }}>
        {/* Cabeçalho */}
        <div style={{ marginBottom: "48px" }}>
          <p style={{ fontFamily: "'Lora', serif", fontSize: "0.8rem", color: "#c9a96e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
            ✦ painel de controle
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", color: "#f0eaff", fontWeight: 700 }}>
            O que deseja gerenciar?
          </h1>
        </div>

        {/* Cards de navegação */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {cards.map((card) => (
            <Link key={card.link} to={card.link} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "rgba(26, 21, 48, 0.8)", border: "1px solid #2e2645",
                  borderRadius: "20px", padding: "32px",
                  transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "translateY(-4px)";
                  el.style.borderColor = "#c9a96e44";
                  el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "translateY(0)";
                  el.style.borderColor = "#2e2645";
                  el.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "2rem", color: "#c9a96e", marginBottom: "16px" }}>
                  {card.icone}
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#f0eaff", fontWeight: 600, marginBottom: "8px" }}>
                  {card.titulo}
                </h2>
                <p style={{ fontFamily: "'Lora', serif", fontSize: "0.9rem", color: "#8b7fa8", lineHeight: 1.5 }}>
                  {card.descricao}
                </p>
                <div style={{ marginTop: "24px", color: "#c9a96e", fontFamily: "'Lora', serif", fontSize: "0.85rem" }}>
                  Acessar →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
