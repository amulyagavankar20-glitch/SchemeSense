from crewai import Agent, LLM
import os
from config import AWS_REGION, BEDROCK_MODEL_ID
from src.chatbot.tools import scheme_retrieval_tool

# Initialize Amazon Bedrock (Claude 4 Sonnet) using CrewAI's native LLM class
# This avoids the "OPENAI_API_KEY is required" error in CrewAI 1.10+
llm = LLM(
    model=f"bedrock/{BEDROCK_MODEL_ID}",
    temperature=0.5
)

# 1. Scholar Agent: Expert in retrieving and understanding government scheme documents
scholar_agent = Agent(
    role='Government Scheme Scholar',
    goal='Retrieve and interpret the most relevant government schemes for a user query using the search tool.',
    backstory="""You are an expert in Indian government policies and schemes across Healthcare, Education, 
    Agriculture, and Women empowerment. Your job is to find the most accurate scheme details to help users.""",
    llm=llm,
    verbose=True,
    allow_delegation=False,
    tools=[scheme_retrieval_tool]  # Add the tool here
)

# 2. Support Agent: Friendly advisor who provides personalized recommendations
support_agent = Agent(
    role='Citizens Support Advisor',
    goal='Provide clear, concise, and grounded scheme recommendations to users based on scholar findings.',
    backstory="""You are a compassionate advisor helping citizens navigate complex government systems. 
    You ensure all advice is grounded in verified sources and easy to understand.""",
    llm=llm,
    verbose=True,
    allow_delegation=False
)
