import Navbar from "./mini-admins/Navbar";

interface MiniAdminProps {
  onLogout?: () => void;
}

function MiniAdmin({ onLogout }: MiniAdminProps) {
  return <Navbar onLogout={onLogout} />;
}

export default MiniAdmin;
