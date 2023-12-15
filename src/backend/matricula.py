from disciplina import Disciplina
from db import Db

class Matricula(Db):

    def __init__(
        self,
        id:int=None,
        ano:int=None,
        semestre:int=None,
        disciplina:Disciplina=None,
        prisma=None
    ):
        self.id = id
        self.ano = ano
        self.semestre = semestre
        self.disciplina = disciplina
        super().__init__(prisma)


    def info(self): return f"({self.disciplina.name} - {self.ano}.{self.semestre})"
    def __str__(self): return self.info()
    def __repr__(self): return self.info()

    def dicio(self):
        return {
            "id": self.id,
            "ano": self.ano,
            "semestre": self.semestre,
            "disciplina": self.disciplina.dicio()
        }

    # ------------------------------ DB ------------------------------ #
    async def preenche_dados(self, objeto=None):
        await super().preenche_dados(objeto)
        self.ano = self.data.ano
        self.semestre = self.data.semestre
        self.disciplina = self.data.disciplina

