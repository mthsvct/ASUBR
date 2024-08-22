from pydantic import BaseModel
from typing import Optional


class Horario(BaseModel):
    id : Optional[int]
    dia : int
    hora : int
    ocupado : Optional[bool] = False
    ofertaId : int

    class Config: orm_mode = True