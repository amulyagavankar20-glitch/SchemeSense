from crewai import Task
from src.chatbot.agents import scholar_agent, support_agent

def create_recommendation_task(user_query):
    search_task = Task(
        description=f"""Analyze the user's query: '{user_query}'. 
        Use the available search tool to find the most relevant government schemes and their details.
        Extract the scheme name, objective, eligibility, and source URL.""",
        expected_output="A detailed summary of relevant schemes found using the search tool.",
        agent=scholar_agent
    )
    
    response_task = Task(
        description=f"""Based on the Scholar's summary, provide a friendly recommendation to the user.
        If no relevant scheme is found, politely inform the user that no verified data is available for this specific query.
        DO NOT hallucinate schemes not present in the research findings.""",
        expected_output="A personalized and grounded recommendation for the user.",
        agent=support_agent,
        context=[search_task]
    )
    
    return [search_task, response_task]
