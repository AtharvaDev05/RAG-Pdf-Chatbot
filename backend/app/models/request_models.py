from pydantic import BaseModel, EmailStr

class QueryRequest(BaseModel):
    question : str  #Type hint

class QueryResponse(BaseModel):
    answer : str
    sources : list[str]

class RegisterRequest(BaseModel):
    email : str
    username : str
    password : str

class LoginRequest(BaseModel):
    email : EmailStr
    password : str