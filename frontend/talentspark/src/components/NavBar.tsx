type Props = {
  onNavigate?: (page: string) => void;
};

function NavBar({ onNavigate }: Props) {
  return (
    <nav style={{ padding: 16, background: "#111", color: "#fff" }}>
      <ul style={{ display: "flex", gap: 16, listStyle: "none", margin: 0, padding: 0 }}>
        <li>
          <button type="button" onClick={() => onNavigate?.("home")} style={{ color: "inherit", background: "transparent", border: "none", cursor: "pointer" }}>
            Home
          </button>
        </li>
        <li>
          <button type="button" onClick={() => onNavigate?.("chat")} style={{ color: "inherit", background: "transparent", border: "none", cursor: "pointer" }}>
            Career Chat
          </button>
        </li>
        <li>
          <button type="button" onClick={() => onNavigate?.("companies")} style={{ color: "inherit", background: "transparent", border: "none", cursor: "pointer" }}>
            Companies
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
