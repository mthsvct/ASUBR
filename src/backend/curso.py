



class Curso:

    def __init__(
        self,
        id:int,
        name:str,
        qntPeriodos:int,
        disciplinas:list=None,
        alunos:list=None,
        periodos:list=None
    ) -> None:
        self.id = id
        self.name = name
        self.qntPeriodos = qntPeriodos
        self.disciplinas = disciplinas
        self.alunos = alunos
        self.periodos = periodos

    def info(self) -> str: return f"({self.id} - {self.name} - {self.qntPeriodos})"
    def __str__(self) -> str: return self.info()
    def __repr__(self) -> str: return self.info()