import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/public/Auth";
import Home from "./pages/public/Home";
import Story from "./pages/public/Story";
import Detail from "./pages/public/Detail";
import Chapter from "./pages/public/Chapter";
import Reads from "./pages/private/Reads";
import Admin from "./pages/admin/Admin";
import ListHistory from "./pages/admin/ListHistory";
import AdminHistory from "./pages/admin/AdminHistory";
import CreateHistory from "./pages/admin/CreateHistory";
import AdminCapitulos from "./pages/admin/AdminCapitulos";

function getUsuario() {
  const raw = localStorage.getItem("usuario");
  return raw ? JSON.parse(raw) : null;
}

function RotaPrivada({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/auth" replace />;
}

function RotaAdmin({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  const usuario = getUsuario();
  if (!token) return <Navigate to="/auth" replace />;
  if (!usuario?.is_admin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/historia/:slug" element={<Story />} />
        <Route path="/historia/:slug/ler" element={<Detail />} />
        <Route path="/historia/:slug/capitulo/:ordem" element={<Chapter />} />

        {/* Privada */}
        <Route path="/leituras" element={<RotaPrivada><Reads /></RotaPrivada>} />

        {/* Admin */}
        <Route path="/admin" element={<RotaAdmin><Admin /></RotaAdmin>} />
        <Route path="/admin/historias" element={<RotaAdmin><ListHistory /></RotaAdmin>} />
        <Route path="/admin/historias/nova" element={<RotaAdmin><CreateHistory /></RotaAdmin>} />
        <Route path="/admin/historias/:id/editar" element={<RotaAdmin><CreateHistory /></RotaAdmin>} />
        <Route path="/admin/historias/:id/capitulos" element={<RotaAdmin><AdminCapitulos /></RotaAdmin>} />
        <Route path="/admin/categorias" element={<RotaAdmin><AdminHistory /></RotaAdmin>} />

        {/* Rota não encontrada */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
