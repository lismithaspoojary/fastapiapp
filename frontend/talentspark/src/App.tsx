import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import CompanyCard from "./components/CompanyCard";
import JobCard from "./components/JobCard";
import Footer from "./components/Footer";
import ChatPage from "./pages/chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { getCompanies, updateCompany, deleteCompany, createCompany } from "./services/CompanyService";
import type { Company } from "./types/company";
import type { LoginResponse } from "./types/user";

function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "companies" | "chat" | "login" | "register">("home");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  function handleNavigate(page: "home" | "companies" | "chat" | "login" | "register") {
    setCurrentPage(page);
    setError(null);
  }

  useEffect(() => {
    if (currentPage === "companies" && token) {
      fetchCompanies();
    }
  }, [currentPage, token]);

  async function fetchCompanies() {
    setLoading(true);
    setError(null);
    try {
      const companies = await getCompanies();
      setCompanies(companies);
    } catch (error: any) {
      setError(error?.response?.data?.detail || error?.message || "Unable to load companies");
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(response: LoginResponse) {
    localStorage.setItem("token", response.access_token);
    setToken(response.access_token);
    setCurrentPage("home");
    setError(null);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setCompanies([]);
    setCurrentPage("home");
    setError(null);
  }

  async function handleEdit(company: Company) {
    try {
      const updatedCompany = await updateCompany(company.id, company);
      setCompanies(companies.map((item) => (item.id === updatedCompany.id ? updatedCompany : item)));
    } catch (error: any) {
      setError(error?.response?.data?.detail || error?.message || "Update failed");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteCompany(id);
      setCompanies(companies.filter((company) => company.id !== id));
    } catch (error: any) {
      setError(error?.response?.data?.detail || error?.message || "Delete failed");
    }
  }

  async function handleAdd(company: Company) {
    try {
      const newCompany = await createCompany(company);
      setCompanies([...companies, newCompany]);
    } catch (error: any) {
      setError(error?.response?.data?.detail || error?.message || "Add failed");
    }
  }

  function handleSwitchToLogin() {
    handleNavigate("login");
  }

  function handleSwitchToRegister() {
    handleNavigate("register");
  }

  if (currentPage === "login") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "linear-gradient(180deg, #5b6cf6 0%, #7469f9 45%, #8b5cf6 100%)" }}>
        <Login onLogin={handleLogin} onSwitchToRegister={handleSwitchToRegister} />
      </div>
    );
  }

  if (currentPage === "register") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "linear-gradient(180deg, #5b6cf6 0%, #7469f9 45%, #8b5cf6 100%)" }}>
        <Register onSwitchToLogin={handleSwitchToLogin} />
      </div>
    );
  }

  return (
    <div style={{ background: "#eff6ff", minHeight: "100vh" }}>
      <NavBar onNavigate={(page) => handleNavigate(page as "home" | "companies" | "chat" | "login" | "register")} />

      <div style={{ margin: "24px auto", maxWidth: 1024, padding: "24px 16px" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24, background: "#1d4ed8", padding: 16, borderRadius: 20, border: "1px solid #2563eb" }}>
          <button onClick={() => handleNavigate("home")} style={{ padding: "10px 16px", borderRadius: 999, border: "1px solid transparent", background: "#2563eb", color: "#ffffff", cursor: "pointer", fontWeight: 700 }}>Home</button>
          <button onClick={() => handleNavigate("chat")} style={{ padding: "10px 16px", borderRadius: 999, border: "1px solid transparent", background: "#2563eb", color: "#ffffff", cursor: "pointer", fontWeight: 700 }}>Career Chat</button>
          <button onClick={() => handleNavigate("companies")} style={{ padding: "10px 16px", borderRadius: 999, border: "1px solid transparent", background: "#2563eb", color: "#ffffff", cursor: "pointer", fontWeight: 700 }}>Companies</button>
          {token ? (
            <button onClick={handleLogout} style={{ padding: "10px 16px", borderRadius: 999, border: "1px solid transparent", background: "#2563eb", color: "#ffffff", cursor: "pointer", fontWeight: 700 }}>Logout</button>
          ) : (
            <button onClick={() => handleNavigate("login")} style={{ padding: "10px 16px", borderRadius: 999, border: "1px solid transparent", background: "#2563eb", color: "#ffffff", cursor: "pointer", fontWeight: 700 }}>Login / Register</button>
          )}
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: 16 }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {currentPage === "home" && (
          <div>
            <h1>Welcome to TalentSpark</h1>
            <p>Use the navigation above to chat, view companies, or log in.</p>
            <JobCard />
          </div>
        )}

        {currentPage === "chat" && <ChatPage />}

        {currentPage === "companies" && (
          <div>
            {token ? (
              <>
                {loading ? (
                  <div>Loading companies...</div>
                ) : (
                  <CompanyCard
                    companies={companies}
                    onedit={handleEdit}
                    ondelete={handleDelete}
                    onadd={handleAdd}
                  />
                )}
              </>
            ) : (
              <div>
                <p>You must be logged in to view companies.</p>
                <button onClick={() => handleNavigate("login")}>Login</button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;
