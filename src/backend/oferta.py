from disciplina import Disciplina
from horario import Horario

class Oferta:

    def __init__(
        self,
        id:int,
        codHorario:str,
        turma:int,
        professor:str,
        vagas:int,
        disciplina:Disciplina=None,
        horarios:[Horario]=None,
    ) -> None:
        self.id = id
        self.codHorario = codHorario
        self.turma = turma
        self.professor = professor
        self.vagas = vagas
        self.disciplina = disciplina
        self.horarios = horarios

    def info(self): return f"({self.id} - {self.disciplina.name} - {self.codHorario})"
    def __str__(self): return self.info()
    def __repr__(self): return self.info()