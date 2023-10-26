


class Disciplina:

    def __init__(
        self,
        id:int,
        name:str,
        codigo:str,
        horas:int,
        nivel:int,
        opcional:bool,
        pre:dict=None,
        prox:dict=None,
        iraMin:float=None,
        descricao:str=None,
        ofertas:list=None
    ):
        self.id = id
        self.name = name
        self.codigo = codigo
        self.horas = horas
        self.nivel = nivel
        self.opcional = opcional
        self.pre = pre
        self.prox = prox
        self.iraMin = iraMin
        self.descricao = descricao
        self.ofertas = ofertas
    
    def info(self) -> str: return f"({self.id} - {self.name} - {self.codigo} - {self.horas} - {self.nivel})"
    def __str__(self) -> str: return self.info()
    def __repr__(self) -> str: return self.info()

