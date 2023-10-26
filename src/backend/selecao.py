
from oferta import Oferta

class Selecao:

    def __init__(
        self,
        id:int,
        aptidao:float,
        oferta:Oferta=None
    ) -> None:
        self.id = id
        self.aptidao = aptidao
        self.oferta = oferta

    def info(self) -> str: return f"({self.id} - {self.aptidao})"
    def __str__(self) -> str: return self.info()
    def __repr__(self) -> str: return self.info()