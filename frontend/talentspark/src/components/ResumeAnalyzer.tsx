import { useState } from "react";
import { analyseResume } from "../services/RagService";
import type { ResumeAnalysis } from "../types/rag";
import "./ResumeAnalyzer.css";

function ResumeAnalyzer() {
    const [resumeText, setResumeText] = useState("");
    const [analysis, setAnalysis] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const handleAnalyze = async () => {
        if (!resumeText.trim()) {
            setError("Please paste resume text before analyzing.");
            return;
        }

        setLoading(true);
        setError("");
        setAnalysis("");

        try {
            const response: ResumeAnalysis = await analyseResume(resumeText);
            setAnalysis(response.analysis);
        } catch (err: any) {
            setError(err?.response?.data?.detail || err?.message || "Resume analysis failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="resume-analyzer">
            <div className="resume-analyzer-header">
                <h2>Resume Analyzer</h2>
                <p>Paste your resume text below and click Analyze to get feedback.</p>
            </div>

            <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste resume text here..."
                rows={12}
                className="resume-textarea"
            />

            <div className="resume-analyzer-actions">
                <button onClick={handleAnalyze} className="btn btn-primary" disabled={loading}>
                    {loading ? "Analyzing..." : "Analyze Resume"}
                </button>
            </div>

            {error && <div className="resume-error">{error}</div>}
            {analysis && (
                <div className="resume-analysis-result">
                    <h3>Analysis Result</h3>
                    <pre>{analysis}</pre>
                </div>
            )}
        </section>
    );
}

export default ResumeAnalyzer;
