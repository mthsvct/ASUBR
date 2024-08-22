from datetime import datetime
from pydantic import BaseModel
from typing import Dict, ForwardRef, Optional, List, Union


class DisciplinaSimples(BaseModel):
    id : Optional[int]
    name : str
    horas : int
    nivel : int
    opcional : bool
    
    class Config: orm_mode = True



class Disciplina(BaseModel):
    
    id : Optional[int]
    name : str
    codigo : str
    horas : int
    nivel : int
    opcional : bool
    pre : Optional[Union[Dict, str]]
    prox : Optional[List[str]]
    descricao : Optional[str]
    cursoId : int

    class Config: orm_mode = True

