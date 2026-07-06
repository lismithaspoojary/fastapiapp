import {useState} from "react";
import {register} from "../services/AuthService";

type Props = {
    onSwitchToLogin: () => void;
}

function Register({onSwitchToLogin}: Props){
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [role,setRole] = useState("");

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        try {
            await register({name,email,password,role});
            alert("Registration successful! Please login.");
            onSwitchToLogin();
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Registration failed");
        }
    }   
    return(
        <div style={{ width: "100%", maxWidth: 420, borderRadius: 24, background: "#ffffff", padding: 32, boxShadow: "0 40px 80px rgba(15, 23, 42, 0.15)" }}>
            <div style={{ textAlign: "center", marginBottom: 26 }}>
                <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, color: "#0f172a" }}>TalentSpark Register</h1>
                <p style={{ margin: "12px 0 0", color: "#64748b", fontSize: 14 }}>Create your TalentSpark account</p>
            </div>

            <form onSubmit={handleSubmit}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 8 }}>Name</label>
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full name" required style={{ width: "100%", marginBottom: 16, height: 50, padding: "0 18px", borderRadius: 16, border: "1px solid #cbd5e1", background: "#e2e8f0", color: "#0f172a" }} />

                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 8 }}>Email</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="john.doe@example.com" required style={{ width: "100%", marginBottom: 16, height: 50, padding: "0 18px", borderRadius: 16, border: "1px solid #cbd5e1", background: "#e2e8f0", color: "#0f172a" }} />

                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 8 }}>Password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Create a password" required style={{ width: "100%", marginBottom: 16, height: 50, padding: "0 18px", borderRadius: 16, border: "1px solid #cbd5e1", background: "#e2e8f0", color: "#0f172a" }} />

                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 8 }}>Role</label>
                <input type="text" value={role} onChange={(e)=>setRole(e.target.value)} placeholder="Your role" required style={{ width: "100%", marginBottom: 24, height: 50, padding: "0 18px", borderRadius: 16, border: "1px solid #cbd5e1", background: "#e2e8f0", color: "#0f172a" }} />

                <button type="submit" style={{ width: "100%", height: 52, borderRadius: 16, border: "none", background: "linear-gradient(90deg, #6366f1, #8b5cf6)", color: "#ffffff", fontWeight: 700, cursor: "pointer" }}>Register</button>
            </form>

            <p style={{ marginTop: 18, color: "#64748b", fontSize: 14, textAlign: "center" }}>
                Already have an account? <button type="button" onClick={onSwitchToLogin} style={{ border: "none", background: "transparent", color: "#6366f1", cursor: "pointer", fontWeight: 700 }}>Login</button>
            </p>
        </div>
    )
}

export default Register;