import os
from dotenv import load_dotenv
from services.qdrant_service import search_jobs
load_dotenv()

try:
    from langchain_groq import ChatGroq
    from langchain_core.prompts import ChatPromptTemplate

    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=os.getenv("GROQ_API_KEY"),
        temperature=0.3,
    )

    rag_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a job search assistant.
Use the following job listings retrieved from the database to answer.
If no relevant jobs are found, say so clearly.
Retrived Jobs:
     {context}"""),
        ("human", "{user_query}")
    ])

    rag_chain = rag_prompt | llm
except Exception:
    rag_chain = None

def rag_job_search(question: str) -> str:
    if rag_chain is None:
        return "RAG service is unavailable because the required LLM configuration is missing."

    results = search_jobs(question, top_k=5)

    if not results:
        return "No jobs found in the database. Please embed jobs first using the /rag/embed-jobs endpoint."

    context = "\n".join(
        f"- {r['title']}: {r['description']} (Salary: {r['salary']}, Match: {r['score']})"
        for r in results
    )