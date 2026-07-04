import { ReactNode } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

type Props = {
  children: ReactNode;
};

function AppLayout({ children }: Props) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar />
      <main style={{ flex: 1, padding: "24px", maxWidth: 1024, margin: "0 auto" }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
