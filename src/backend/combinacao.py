from selecao import Selecao


class Combinacao:

    def __init__(
        self,
        id:int,
        aptidao:float,
        selecoes:[Selecao]=None
    ):
        self.id = id
        self.aptidao = aptidao
        self.selecoes = selecoes

    def info(self): return f"({self.id} - {self.aptidao})"
    def __str__(self): return self.info()
    def __repr__(self): return self.info()



