
from oferta import Oferta
from db import Db

class Selecao(Db):

    def __init__(
        self,
        id:int=None,
        aptidao:float=None,
        oferta:Oferta=None,
        prisma=None
    ) -> None:
        self.id = id
        self.aptidao = aptidao
        self.oferta = oferta
        super().__init__(prisma)


    # ------------------------------ Métodos Especiais ------------------------------ #
    def info(self) -> str: return f"(Selecao: {self.aptidao} - t{self.oferta.turma} - {self.oferta.disciplina.name})"
    def __str__(self) -> str: return self.info()
    def __repr__(self) -> str: return self.info()

    # ------------------------------ DB ------------------------------ #

    async def preenche_dados(self, objeto=None):
        await super().preenche_dados(objeto)
        self.id = self.data.id
        self.aptidao = self.data.aptidao
        self.oferta = self.data.oferta

    async def save(self):
        return await self.create(
            {
                'aptidao': self.aptidao,
                'ofertaId': self.oferta.id
            }
        )
    

    # ------------------------------ Métodos ------------------------------ #

    def choca(self, selecao):
        # Verifica se a seleção choca com outra
        return self.oferta.choca(selecao.oferta)