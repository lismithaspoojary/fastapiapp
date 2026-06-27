from pydantic import BaseModel
from typing import Optional

class JobCreate(BaseModel):
    title: str
    salary: int
    description:Optional[str]=None
    company_id:int

class Jobcreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title:Optional[str] = None
    salary:Optional[int] = None
    description:Optional[str]=None
    company_id:[int]=None