from pydantic import BaseModel

class QueryRequest(BaseModel):
    question : str  #Type hint

class QueryResponse(BaseModel):
    answer : str
    sources : list[str]