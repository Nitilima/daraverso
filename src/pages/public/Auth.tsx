import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../services/api";

type Modo = "login" | "cadastro";

export default function Auth() {
  const [modo, setModo] = useState<Modo>("login");
  const navigate = useNavigate();

  // Campos do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function alternarModo() {
    setModo(modo === "login" ? "cadastro" : "login");
    setErro("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const endpoint = modo === "login" ? "auth/login.php" : "auth/cadastro.php";
    const corpo = modo === "login" ? { email, senha } : { nome, email, senha };

    try {
      const dados = await post(endpoint, corpo);

      if (modo === "login") {
        localStorage.setItem("token", dados.token);
        localStorage.setItem("usuario", JSON.stringify(dados.usuario));
        navigate("/");
      } else {
        alert("Conta criada! Faça login.");
        setModo("login");
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro de conexão");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Card principal */}
      <div
        className="animar-entrada"
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(26, 21, 48, 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid #2e2645",
          borderRadius: "24px",
          padding: "40px 36px",
          boxShadow:
            "0 0 0 1px rgba(201, 169, 110, 0.08), 0 24px 64px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(201, 169, 110, 0.12)",
        }}
      >
        {/* Logo e título */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          {/* Ornamento decorativo */}
          <div style={{ marginBottom: "16px" }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              style={{ margin: "0 auto", display: "block" }}
            >
              <circle cx="24" cy="24" r="23" stroke="#2e2645" strokeWidth="1" />
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="#c9a96e"
                strokeWidth="0.5"
                opacity="0.4"
              />
              {/* Estrela central */}
              <path
                d="M24 10 L25.5 19 L34 18 L27 24 L30 33 L24 28 L18 33 L21 24 L14 18 L22.5 19 Z"
                fill="#c9a96e"
                opacity="0.85"
              />
              {/* Pontos nos cantos */}
              <circle cx="24" cy="6" r="1.2" fill="#c9a96e" opacity="0.5" />
              <circle cx="24" cy="42" r="1.2" fill="#c9a96e" opacity="0.5" />
              <circle cx="6" cy="24" r="1.2" fill="#c9a96e" opacity="0.5" />
              <circle cx="42" cy="24" r="1.2" fill="#c9a96e" opacity="0.5" />
            </svg>
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "2rem",
              fontWeight: 700,
              color: "#f0eaff",
              letterSpacing: "0.02em",
              marginBottom: "6px",
              lineHeight: 1.2,
            }}
          >
            Daraverso
          </h1>

          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "0.875rem",
              color: "#8b7fa8",
              fontStyle: "italic",
            }}
          >
            {modo === "login" ? "Entre na sua conta" : "Crie sua conta"}
          </p>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="animar-entrada-lenta"
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {modo === "cadastro" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label
                style={{
                  fontSize: "0.8rem",
                  color: "#8b7fa8",
                  fontFamily: "'Lora', serif",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Nome
              </label>
              <input
                className="input-celestial"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                required
              />
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                fontSize: "0.8rem",
                color: "#8b7fa8",
                fontFamily: "'Lora', serif",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Email
            </label>
            <input
              className="input-celestial"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                fontSize: "0.8rem",
                color: "#8b7fa8",
                fontFamily: "'Lora', serif",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Senha
            </label>
            <input
              className="input-celestial"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <p
              style={{
                color: "#e07070",
                fontSize: "0.875rem",
                textAlign: "center",
                fontFamily: "'Lora', serif",
                fontStyle: "italic",
              }}
            >
              {erro}
            </p>
          )}

          {/* Separador decorativo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              margin: "4px 0",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#2e2645" }} />
            <span
              style={{ color: "#c9a96e", fontSize: "0.75rem", opacity: 0.6 }}
            >
              ✦
            </span>
            <div style={{ flex: 1, height: "1px", background: "#2e2645" }} />
          </div>

          <button className="btn-primario" type="submit" disabled={carregando}>
            {carregando
              ? "Aguarde..."
              : modo === "login"
                ? "Entrar no universo"
                : "Criar minha conta"}
          </button>
        </form>

        {/* Alternar modo */}
        <p
          style={{
            textAlign: "center",
            color: "#8b7fa8",
            fontSize: "0.875rem",
            marginTop: "24px",
            fontFamily: "'Lora', serif",
          }}
        >
          {modo === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
          <button
            onClick={alternarModo}
            style={{
              background: "none",
              border: "none",
              color: "#c9a96e",
              cursor: "pointer",
              fontFamily: "'Lora', serif",
              fontSize: "0.875rem",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              padding: 0,
            }}
          >
            {modo === "login" ? "Cadastre-se" : "Faça login"}
          </button>
        </p>
      </div>
    </div>
  );
}
