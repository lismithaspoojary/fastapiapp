import {useState} from "react";
import {login} from "../services/AuthService";
import type { LoginResponse } from "../types/user";

type Props = {
    onLogin: (response: LoginResponse) => void;
    onSwitchToRegister: () => void;
}

function Login({onLogin, onSwitchToRegister}: Props){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await login({email,password});
            onLogin(response);
        } catch (error) {
            console.error("Error during login:", error);
            alert("Login failed");
        }
    }   
    return(
        <div style={{ width: "100%", maxWidth: 420, borderRadius: 24, background: "#ffffff", padding: 36, boxShadow: "0 36px 80px rgba(15, 23, 42, 0.12)" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: "#0f172a" }}>TalentSpark Login</h1>
                <p style={{ margin: "10px 0 0", color: "#63748b", fontSize: 13, fontWeight: 500, letterSpacing: 0.3 }}>Username or Email</p>
            </div>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    required
                    style={{ width: "100%", marginBottom: 18, height: 52, padding: "0 18px", borderRadius: 16, border: "1px solid #cbd5e1", background: "#d1d5db", color: "#0f172a", fontSize: 15, outline: "none" }}
                />

                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 8 }}>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    style={{ width: "100%", marginBottom: 28, height: 52, padding: "0 18px", borderRadius: 16, border: "1px solid #cbd5e1", background: "#d1d5db", color: "#0f172a", fontSize: 15, outline: "none" }}
                />

                <button type="submit" style={{ width: "100%", height: 52, borderRadius: 16, border: "none", background: "linear-gradient(90deg, #4f46e5, #8b5cf6)", color: "#ffffff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Login</button>
            </form>

            <p style={{ marginTop: 18, color: "#64748b", fontSize: 13, textAlign: "center" }}>
                Don't have an account? <button type="button" onClick={onSwitchToRegister} style={{ border: "none", background: "transparent", color: "#4f46e5", cursor: "pointer", fontWeight: 700 }}>Sign up here</button>
            </p>
        </div>
    )
}

export default Login;