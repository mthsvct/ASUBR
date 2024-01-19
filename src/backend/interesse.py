
from db import Db

class Interesse(Db):

    def __init__(self, 
        id:int=None,
        alunoId:int=None,
        periodoId:int=None,
        ofertaId:int=None,
        aluno=None,
        oferta=None,
        prisma=None
    ):
        self.id = id
        self.alunoId = alunoId
        self.periodoId = periodoId
        self.ofertaId = ofertaId
        self.aluno = aluno
        self.oferta = oferta
        super().__init__(prisma)

    # ------------------------------ Métodos Especiais ------------------------------ #
    
    def infor(self): return f"({self.id} - {self.aluno.name if self.aluno else self.alunoId} - {self.ofertaId})"
    def __str__(self): return self.infor()
    def __repr__(self): return self.infor()

    # ------------------------------ DB ------------------------------ #

    async def save(self):
        return await self.create(
            {
                "alunoId": self.alunoId,
                "periodoId": self.periodoId,
                "ofertaId": self.ofertaId,
            }
        )
    
    async def preenche_dados(self, objeto=None):
        await super().preenche_dados(objeto)
        self.id = self.data.id
        self.alunoId = self.data.alunoId
        self.periodoId = self.data.periodoId
        self.ofertaId = self.data.ofertaId
        
    def dicio(self):
        aux = self.dicioResumido()
        if self.aluno:
            aux['aluno'] = self.aluno.dicio()
        if self.oferta:
            aux['oferta'] = self.oferta.dicioResumido()
        return aux
    
    def dicioResumido(self):
        return {
            'id': self.id,
            "alunoId": self.alunoId,
            "periodoId": self.periodoId,
            "ofertaId": self.ofertaId,
        }
    
    # ------------------------------ Métodos de Classe ------------------------------ #

