from datetime import datetime
from pydantic import BaseModel
from typing import ForwardRef, Optional, List

# import src.schemas.disciplinas as dcs

class AlunoLogin(BaseModel):
    email : str
    password : str
    
    class Config:
        orm_mode = True


class AlunoSimples(BaseModel):

    id : Optional[int]
    email : str
    name : str
    matricula : str

    class Config:
        orm_mode = True




class AlunoSemSenha(BaseModel):
    id : Optional[int]
    email : str
    name : str
    matricula : str
    nivel : Optional[int]
    ira : Optional[float]
    cursoId : Optional[int] = 1

    class Config:
        orm_mode = True



class Aluno(BaseModel):

    id : Optional[int]
    email : str
    password : str
    name : str
    matricula : str
    nivel : Optional[int]
    ira : Optional[float]
    cursoId : Optional[int] = 1

    class Config:
        orm_mode = True


class Logado(BaseModel):
    token : str
    aluno : AlunoSemSenha

    class Config: 
        orm_mode = True
