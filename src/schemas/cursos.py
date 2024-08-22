from datetime import datetime
from pydantic import BaseModel
from typing import ForwardRef, Optional, List

import src.schemas.disciplinas as dcs



class CursoSimples(BaseModel):
    id : Optional[int]
    name : str
    qntPeriodos : int
    class Config: orm_mode = True


class Curso(BaseModel):
    
    id : Optional[int]
    name : str
    qntPeriodos : int
    disciplinas : Optional[List[dcs.DisciplinaSimples]]
    class Config: orm_mode = True

    
