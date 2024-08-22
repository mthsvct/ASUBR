from pydantic import BaseModel
from typing import Optional, List
from .horarios import Horario
from .disciplinas import Disciplina


class Oferta(BaseModel):
    id : Optional[int]
    codHorario : str
    turma : int
    professor : str
    vagas : int
    iraMin : float
    disciplinaId : int
    disciplina : Optional[Disciplina]
    periodoId : int
    horarios : List[Horario]

    class Config: orm_mode = True