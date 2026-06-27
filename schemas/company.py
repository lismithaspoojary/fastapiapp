from pydantic import BaseModel
from typing import Optional

class CompanyCreate(BaseModel):
    name:str
    email:str
    Phone:str
class CompanyCeate(CompanyBase):
    pass

   
class CompanyUpdate(BaseModel):

    name:Optional[str] = None
    phone:Optional[str] = None
    phone:Optional[str] = None