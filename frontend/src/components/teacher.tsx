import Navbar from "./teachers/Navbar";

interface TeacherProps {
  onLogout?: () => void;
}

function Teacher({ onLogout }: TeacherProps) {
  return <Navbar onLogout={onLogout} />;
}

export default Teacher;