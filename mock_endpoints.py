from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional
# Use a simple mock database for now
mock_schemes = [
    {
        "id": "1",
        "name": "Pradhan Mantri Awas Yojana",
        "category": "Housing",
        "description": "Affordable housing for all citizens with financial assistance for building or purchasing homes.",
        "relevance": 95,
        "benefits": "₹2.5 Lakhs subsidy",
        "eligibility": "Annual income < ₹18 Lakhs",
    },
    {
        "id": "2",
        "name": "National Scholarship Portal",
        "category": "Education",
        "description": "Scholarships for students from various backgrounds pursuing higher education.",
        "relevance": 88,
        "benefits": "Up to ₹50,000/year",
        "eligibility": "Merit-based, income criteria",
    },
    {
        "id": "3",
        "name": "PM Kisan Samman Nidhi",
        "category": "Agriculture",
        "description": "Direct income support to small and marginal farmers across India.",
        "relevance": 82,
        "benefits": "₹6,000 per year",
        "eligibility": "Small & marginal farmers",
    },
    {
        "id": "4",
        "name": "Ayushman Bharat - PMJAY",
        "category": "Healthcare",
        "description": "Free health insurance coverage for economically vulnerable families.",
        "relevance": 78,
        "benefits": "₹5 Lakhs health cover",
        "eligibility": "BPL families",
    },
    {
        "id": "5",
        "name": "Stand Up India Scheme",
        "category": "Entrepreneurship",
        "description": "Loans for SC/ST and women entrepreneurs to set up greenfield enterprises.",
        "relevance": 75,
        "benefits": "₹10L - ₹1Cr loan",
        "eligibility": "SC/ST/Women entrepreneurs",
    },
    {
        "id": "6",
        "name": "Sukanya Samriddhi Yojana",
        "category": "Financial",
        "description": "Savings scheme for girl child education and marriage expenses.",
        "relevance": 70,
        "benefits": "7.6% interest rate",
        "eligibility": "Girls below 10 years",
    },
]

mock_applications = [
  {
    "id": "PMAY-2024-987654",
    "scheme": "Pradhan Mantri Awas Yojana",
    "category": "Housing",
    "submittedDate": "2024-02-28",
    "status": "processing",
    "stage": "Document Verification",
    "progress": 40,
  },
  {
    "id": "NSP-2024-123456",
    "scheme": "National Scholarship Portal",
    "category": "Education",
    "submittedDate": "2024-02-15",
    "status": "approved",
    "stage": "Completed",
    "progress": 100,
  },
]

router = APIRouter()

@router.get("/schemes")
async def get_schemes():
    return mock_schemes

@router.get("/schemes/{scheme_id}")
async def get_scheme(scheme_id: str):
    scheme = next((s for s in mock_schemes if s["id"] == scheme_id), None)
    if scheme:
        return scheme
    return {"error": "Scheme not found"}

@router.get("/applications")
async def get_applications():
    return mock_applications

@router.get("/applications/{app_id}")
async def get_application(app_id: str):
    application = next((a for a in mock_applications if a["id"] == app_id), None)
    if application:
        return application
    return {"error": "Application not found"}

@router.post("/applications")
async def create_application(app_data: dict):
    new_app = {
        "id": f"APP-{len(mock_applications)+1}",
        "status": "submitted",
        "stage": "Under Review",
        "progress": 20,
        **app_data
    }
    mock_applications.append(new_app)
    return new_app
