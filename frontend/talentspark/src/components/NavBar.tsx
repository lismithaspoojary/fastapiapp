type Props = {
  onNavigate?: (page: string) => void;
};

function NavBar({ onNavigate }: Props) {
  return (
    <nav style={{ padding: 16, background: "#0f172a", color: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
      <ul style={{ display: "flex", gap: 16, listStyle: "none", margin: 0, padding: 0, alignItems: "center" }}>
        <li style={{ fontWeight: 700, marginRight: 8 }}>TalentSpark</li>
        <li>
          <button type="button" onClick={() => onNavigate?.("home")} style={{ color: "inherit", background: "transparent", border: "none", cursor: "pointer", fontSize: 15 }}>
            Home
          </button>
        </li>
        <li>
          <button type="button" onClick={() => onNavigate?.("chat")} style={{ color: "inherit", background: "transparent", border: "none", cursor: "pointer", fontSize: 15 }}>
            Career Chat
          </button>
        </li>
        <li>
          <button type="button" onClick={() => onNavigate?.("companies")} style={{ color: "inherit", background: "transparent", border: "none", cursor: "pointer", fontSize: 15 }}>
            Companies
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
