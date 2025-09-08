import Navbar from "./admins/Navbar";

interface AdminProps {
  onLogout?: () => void;
}

function Admin({ onLogout }: AdminProps) {
  return <Navbar onLogout={onLogout} />;
}

export default Admin;
