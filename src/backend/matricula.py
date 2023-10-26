from aluno import Aluno
from disciplina import Disciplina

class Matricula:

    def __init__(
        self,
        id:int,
        ano:int,
        semestre:int,
        aluno:Aluno=None,
        disciplina:Disciplina=None,
    ):
        self.id = id
        self.ano = ano
        self.semestre = semestre
        self.aluno = aluno
        self.disciplina = disciplina


    def info(self): return f"({self.id} - {self.ano}.{self.semestre})"
    def __str__(self): return self.info()
    def __repr__(self): return self.info()