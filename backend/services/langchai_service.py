import os
from typing import Any

try:
    from dotenv import load_dotenv
    from langchain_groq import ChatGroq
    from langchain.core.prompts import ChatPromptTemplate
    from langchain_core.runnable import RunnableWithMessageHistory
    from langchain_community.chat_message_histories import ChatMessageHistory

    load_dotenv()
    llm = ChatGroq(
        model=os.getenv("LLAMA_MODEL", "llama-3.3-70b-versatile"),
        groq_api_key=os.getenv("GROQ_API_KEY"),
        temperature=0.5,
    )
    prompt_with_memory = ChatPromptTemplate.from_messages([
        ("system", "you are a helpful career guidance assistant"),
        ("placeholder", "{chat_history}"),
        ("human", "{user_query}"),
    ])
    chain_with_memory = prompt_with_memory | llm
    store: dict[str, ChatMessageHistory] = {}

    def get_history(session_id: str) -> ChatMessageHistory:
        if session_id not in store:
            store[session_id] = ChatMessageHistory()
        return store[session_id]

    chat_with_memory = RunnableWithMessageHistory(
        runnable=chain_with_memory,
        get_message_history=get_history,
        input_messages_key="user_query",
        history_messages_key="chat_history",
    )

    def ask_career_chatbot_response(question: str, session_id: str = "default") -> str:
        response = chat_with_memory.invoke(
            {"user_query": question}, {"configurable": {"session_id": session_id}}
        )
        return getattr(response, "content", str(response))

except ModuleNotFoundError:
    def _simple_career_bot(question: str) -> str:
        q = question.lower().strip()
        # Basic FAQ-style responses for common career questions
        if "what is ai" in q or q.strip() == "what is ai":
            return (
                "AI (Artificial Intelligence) is the field of computer science that focuses on "
                "building systems that can perform tasks that normally require human intelligence, "
                "such as understanding language, recognizing images, and making decisions."
            )
        if "what is machine learning" in q or "machine learning" == q:
            return (
                "Machine Learning is a subset of AI that uses algorithms and statistical models "
                "to enable computers to improve at tasks with experience (data)."
            )
        if "how to become" in q or "how do i become" in q:
            return (
                "Start by learning programming (Python/JavaScript), study data structures and algorithms, "
                "build projects, and practice interviews; specialize in areas like web, data, or cloud depending on your goals."
            )
        if "interview" in q:
            return (
                "Practice coding problems, system design basics, and behavioral questions. Use mock interviews and review common patterns."
            )
        # fallback friendly reply
        return (
            "I don't have the full career assistant available right now, but here's a quick tip: "
            + question
        )

    def ask_career_chatbot_response(question: str, session_id: str = "default") -> str:
        return _simple_career_bot(question)

except Exception as exc:
    def ask_career_chatbot_response(question: str, session_id: str = "default") -> str:
        return f"[career service unavailable] {exc}"
