from disciplina import Disciplina

class Matricula:

    def __init__(
        self,
        id:int=None,
        ano:int=None,
        semestre:int=None,
        disciplina:Disciplina=None,
    ):
        self.id = id
        self.ano = ano
        self.semestre = semestre
        self.disciplina = disciplina


    def info(self): return f"({self.disciplina.name} - {self.ano}.{self.semestre})"
    def __str__(self): return self.info()
    def __repr__(self): return self.info()