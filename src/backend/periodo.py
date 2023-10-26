from datetime import datetime
from oferta import Oferta

class Periodo:

    def __init__(
        self,
        id:int,
        ano:int,
        semestre:int,
        atual:bool,
        inicioMatriculas:datetime=None,
        fimMatriculas:datetime=None,
        inicioAjustes:datetime=None,
        ofertas:[Oferta]=None,
    ):
        self.id = id
        self.ano = ano
        self.semestre = semestre
        self.atual = atual
        self.inicioMatriculas = inicioMatriculas
        self.fimMatriculas = fimMatriculas
        self.inicioAjustes = inicioAjustes
        self.ofertas = ofertas

    def info(self): return f"({self.id} - {self.ano}.{self.semestre})"
    def __str__(self): return self.info()
    def __repr__(self): return self.info()
