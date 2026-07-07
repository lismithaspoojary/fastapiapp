import NavBar from "./components/NavBar";
import CompanyCard from "./components/CompanyCard";
import JobList from "./components/JobList";
import ChatBox from "./components/chatbot";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import { useEffect, useState } from "react";
import { getCompanies, updateCompany, deleteCompany, createCompany } from "./services/CompanyService";
import type { Company, CompanyCreatePayload } from "./types/company";
import type { LoginResponse } from "./types/user";
import "./App.css";

function App() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [authenticated, setAuthenticated] = useState(Boolean(localStorage.getItem("token")));
    const [showRegister, setShowRegister] = useState(false);

    async function fetchCompanies() {
        setLoading(true);
        setError(null);
        try {
            const company = await getCompanies();
            setCompanies(company);
        } catch (err: any) {
            if (err?.response?.status === 401) {
                setAuthenticated(false);
                setCompanies([]);
                return;
            }
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    async function handleEdit(company: Company) {
        try {
            const updatedCompany = await updateCompany(company.id, company);
            setCompanies((prevCompanies) => prevCompanies.map((c) => c.id === updatedCompany.id ? updatedCompany : c));
        } catch (err) {
            setError(err as Error);
        }
    }

    async function handleDelete(id: number) {
        try {
            await deleteCompany(id);
            setCompanies((prevCompanies) => prevCompanies.filter((c) => c.id !== id));
        } catch (err) {
            setError(err as Error);
        }
    }

    async function handleAdd(company: CompanyCreatePayload) {
        try {
            const newCompany = await createCompany(company);
            setCompanies((prevCompanies) => [...prevCompanies, newCompany]);
            await fetchCompanies();
        } catch (err) {
            setError(err as Error);
        }
    }

    const handleLogin = (response: LoginResponse) => {
        localStorage.setItem("token", response.access_token);
        setAuthenticated(true);
        setShowRegister(false);
        fetchCompanies();
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        setAuthenticated(false);
        setCompanies([]);
        setError(null);
    }

    const handleRegisterSuccess = () => {
        setShowRegister(false);
    };

    useEffect(() => {
        if (authenticated) {
            fetchCompanies();
        }
    }, [authenticated]);

    // Show login/register page if not authenticated
    if (!authenticated) {
        return (
            <div className="auth-wrapper">
                {showRegister ? (
                    <Register onRegister={handleRegisterSuccess} onSwitchToLogin={() => setShowRegister(false)} />
                ) : (
                    <Login onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />
                )}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="loading-state">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-state">
                Error: {error.message}
            </div>
        );
    }

    return (
        <div className="app-layout">
            <NavBar onLogout={handleLogout} />
            <main className="main-container">
                <CompanyCard
                    companies={companies}
                    onedit={handleEdit}
                    ondelete={handleDelete}
                    onadd={handleAdd}
                />
                <ResumeAnalyzer />
                <JobList />
                <ChatBox />
            </main>
            <Footer />
        </div>
    );
}

export default App;