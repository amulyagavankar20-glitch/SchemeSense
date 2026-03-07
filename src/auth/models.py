from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    user_id: str
    email: str
    role: str = "user"

class TokenData(BaseModel):
    user_id: str
    exp: Optional[int] = None
