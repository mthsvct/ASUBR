from datetime import datetime
from pydantic import BaseModel
from typing import ForwardRef, Optional, List

from .alunos import AlunoSemSenha, AlunoSimples
from .disciplinas import DisciplinaSimples


class Matricula(BaseModel):    
    id : Optional[int]
    ano : int
    semestre : int
    alunoId : int
    aluno : Optional[AlunoSimples]
    disciplinaId : int
    disciplina : Optional[DisciplinaSimples]

    class Config: orm_mode = True


class MatriculaSimples(BaseModel):
    id : Optional[int]
    ano : int
    semestre : int
    alunoId : int
    disciplinaId : int

    class Config: orm_mode = True


class MatriculaSemAluno(BaseModel):
    id : Optional[int]
    ano : int
    semestre : int
    disciplina : Optional[DisciplinaSimples]

    class Config: orm_mode = True


class MatriculasAluno(BaseModel):
    aluno : AlunoSemSenha
    matriculas : List[MatriculaSemAluno]

    class Config: orm_mode = True
