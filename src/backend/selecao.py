
from oferta import Oferta
from db import Db

class Selecao(Db):

    def __init__(
        self,
        id:int=None,
        aptidao:float=None,
        ofertaId:int=None,
        oferta:Oferta=None,
        prisma=None,
        combinacaoId:int=None
    ) -> None:
        self.id = id
        self.aptidao = aptidao
        self.ofertaId = ofertaId
        self.oferta = oferta
        self.combinacaoId = combinacaoId
        super().__init__(prisma)


    # ------------------------------ Métodos Especiais ------------------------------ #
    
    def info(self) -> str: return f"(Selecao: {self.aptidao} - t{self.oferta.turma} - {self.oferta.disciplina.name})"
    def __str__(self) -> str: return self.info()
    def __repr__(self) -> str: return self.info()

    # ------------------------------ INFOS ------------------------------ #

    def dicio(self):
        return {
            'id': self.id, 
            'aptidao': self.aptidao,
            'oferta': self.oferta.dicioResumido(),
        }

    # ------------------------------ DB ------------------------------ #

    async def preenche_dados(self, objeto=None):
        await super().preenche_dados(objeto)
        self.id = self.data.id
        self.aptidao = self.data.aptidao
        self.ofertaId = self.data.ofertaId

    async def save(self):
        return await self.create(
            {
                'aptidao': self.aptidao,
                'combinacaoId': self.combinacaoId,
                'ofertaId': self.ofertaId
            }
        )
    

    # ------------------------------ Métodos ------------------------------ #

    def choca(self, selecao):
        # Verifica se a seleção choca com outra
        return self.oferta.choca(selecao.oferta)