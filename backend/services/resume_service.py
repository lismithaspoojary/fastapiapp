import os
from dotenv import load_dotenv

load_dotenv()

try:
    from langchain_groq import ChatGroq
    from langchain_core.prompts import ChatPromptTemplate

    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=os.getenv("GROQ_API_KEY"),
        temperature=0.3,
    )

    resume_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a professional resume analyser.

Analyse the given resume text and provide:

1. Key Skills found
2. Experience Level (Junior/Mid/Senior)
3. Strengths
4. Areas to Improve
5. Suggested Job Roles

Keep the analysis short and structured."""),
        ("human", "{resume_text}")
    ])
    resume_chain = resume_prompt | llm
except Exception:
    resume_chain = None


def analyse_resume(resume_text: str) -> str:
    if resume_chain is None:
        # Fallback lightweight analyzer when LLM is not available
        return _fallback_analyse_resume(resume_text)

    response = resume_chain.invoke({"resume_text": resume_text})
    # langchain_groq ChatGroq response compatibility
    try:
        return getattr(response, "content", str(response))
    except Exception:
        return str(response)


def _fallback_analyse_resume(text: str) -> str:
    """Simple rule-based resume analysis used when LLM is unavailable.

    Produces a short structured analysis with: Key Skills, Experience Level,
    Strengths, Areas to Improve, Suggested Job Roles.
    """
    import re

    lower = text.lower()

    # Basic skill keywords to look for
    skill_keywords = [
        "python", "django", "flask", "fastapi", "node", "express", "react",
        "vue", "angular", "typescript", "javascript", "sql", "postgres", "mysql",
        "aws", "gcp", "azure", "docker", "kubernetes", "rest", "graphql",
        "aws", "ml", "machine learning", "nlp", "pandas", "numpy"
    ]

    found_skills = []
    for kw in skill_keywords:
        if kw in lower and kw not in found_skills:
            found_skills.append(kw)

    # Estimate years of experience from patterns like 'X years' or 'since 2020'
    years = None
    m = re.search(r"(\d+)\+?\s+years", lower)
    if m:
        years = int(m.group(1))
    else:
        # look for date ranges like 2019 - 2023 or 2019–2023
        m2 = re.search(r"(19|20)\d{2}\s*[–-]\s*(19|20)\d{2}", text)
        if m2:
            try:
                start = int(m2.group(0).split("-")[0].strip())
                end = int(m2.group(0).split("-")[-1].strip())
                years = max(0, end - start)
            except Exception:
                years = None

    if years is None:
        # fallback: junior if <2 years of keywords like 'intern' or 'junior'
        if re.search(r"\b(intern|junior)\b", lower):
            level = "Junior"
        else:
            level = "Mid"
    else:
        if years < 2:
            level = "Junior"
        elif years < 5:
            level = "Mid"
        else:
            level = "Senior"

    # Strengths: presence of action verbs and quantifiable results
    strengths = []
    if re.search(r"\b(design|designing|architect)\b", lower):
        strengths.append("Design/Architecture")
    if re.search(r"\b(optimi[zs]e|improv|performance)\b", lower):
        strengths.append("Performance optimization")
    if re.search(r"\b(lead|led|manager|managed)\b", lower):
        strengths.append("Leadership")
    if re.search(r"\b(test|unit test|integration test|ci/cd)\b", lower):
        strengths.append("Testing/CI/CD")
    if re.search(r"\b(collaborat|team)\b", lower):
        strengths.append("Collaboration")

    if not strengths:
        strengths = ["Relevant technical experience"]

    # Areas to improve: missing skills or buzzwords
    improvements = []
    if "cloud" not in lower and not any(x in lower for x in ("aws", "gcp", "azure")):
        improvements.append("Cloud platform experience (AWS/GCP/Azure)")
    if "docker" not in lower and "kubernetes" not in lower:
        improvements.append("Containerization / Kubernetes experience")
    if "testing" not in lower and "unit test" not in lower:
        improvements.append("Automated testing (unit/integration)")

    if not improvements:
        improvements = ["Consider adding measurable achievements and cloud/container skills"]

    # Suggested roles based on skills
    suggested = []
    if any(k in found_skills for k in ("react", "vue", "angular", "typescript", "javascript")):
        suggested.append("Front-end Developer")
    if any(k in found_skills for k in ("node", "express", "python", "django", "flask", "fastapi")):
        suggested.append("Backend Developer")
    if any(k in found_skills for k in ("aws", "docker", "kubernetes")):
        suggested.append("DevOps / Cloud Engineer")
    if not suggested:
        suggested.append("Software Engineer")

    # Build output
    parts = [
        "Key Skills: " + (", ".join(found_skills) if found_skills else "Not detected"),
        f"Experience Level: {level}" + (f" ({years} years)" if years is not None else ""),
        "Strengths: " + ", ".join(strengths),
        "Areas to Improve: " + ", ".join(improvements),
        "Suggested Job Roles: " + ", ".join(suggested),
    ]

    return "\n\n".join(parts)