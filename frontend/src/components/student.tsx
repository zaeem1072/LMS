import Navbar from "./studetns/Navbar";

interface StudentProps {
  onLogout?: () => void;
}

function Student({ onLogout }: StudentProps) {
  return <Navbar onLogout={onLogout} />;
}

export default Student;
