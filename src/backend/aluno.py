

class Aluno:

    def __init__(
        self, 
        id:int,
        name:str,
        email:str,
        matricula:str,
        nivel:int,
        ira:float,
        matriculas:list=None,
        combinacoes:list=None,
        interesses:list=None,
    ) -> None:
        self.id = id
        self.name = name
        self.email = email
        self.matricula = matricula
        self.nivel = nivel
        self.ira = ira
        self.matriculas = matriculas
        self.combinacoes = combinacoes
        self.interesses = interesses
    
    def info(self) -> str: return f"({self.id} - {self.name} - {self.matricula})"
    def __str__(self) -> str: return self.info()    
    def __repr__(self) -> str: return self.info()
