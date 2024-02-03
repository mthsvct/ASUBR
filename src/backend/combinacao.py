from selecao import Selecao
from db import Db

class Combinacao(Db):

    def __init__(
        self,
        id:int=None,
        aptidao:float=0.0,
        alunoId:int=None,
        selecoes:[Selecao] = [],
        manual:bool=False,
        prisma=None
    ):
        self.id = id
        self.aptidao = aptidao
        self.alunoId = alunoId
        self.selecoes = selecoes
        self.cores = [
            '#FFDBA2',
            '#B7E1DE',
            '#FF9494',
            '#CBC2F7',
            '#D4FF8D'
        ]
        self.manual = manual
        super().__init__(prisma)

    # ------------------------------ Métodos Especiais ------------------------------ #
    def info(self):
        return f"(Combinacao: {self.id} - {self.manual})"
    
    def __str__(self): return self.info()
    def __repr__(self): return self.info()
    def __len__(self): return len(self.selecoes)
    def __getitem__(self, i): return self.selecoes[i]
    def __iter__(self): return iter(self.selecoes)


    # ------------------------------ INFOS ------------------------------ #

    def dicio(self, aluno=None):
        selecoes = []
        for index, s in enumerate(self.selecoes):
            aux = s.dicio()
            aux['cor'] = self.cores[index]
            selecoes.append(aux)

        return {
            'id': self.id, 
            'aptidao': self.aptidao,
            'manual': self.manual,
            'selecoes': selecoes
        }



    # ------------------------------ DB ------------------------------ #

    async def preenche_dados(self, objeto=None):
        await super().preenche_dados(objeto)
        self.id = self.data.id
        self.alunoId = self.data.alunoId
        self.aptidao = self.data.aptidao
    

    async def save(self):

        aux = await self.create(
            {
                "alunoId": self.alunoId,
                "aptidao": self.aptidao,
            }
        )
        self.id = aux.id
        
        for i in self.selecoes:
            i.combinacaoId = self.id
            await i.save()
        
        return aux

    # ------------------------------ Métodos ------------------------------ #

    def busca(self, codigo:str):
        # Busca o código da disciplina na combinação
        r, i = None, 0
        while r == None and i < len(self.selecoes):
            if self.selecoes[i].oferta.disciplina.codigo == codigo:
                r = self.selecoes[i]
            i += 1
        return r 


    def add(self, selecao:Selecao):
        # Adiciona uma seleção na combinação    
        if self.podeAdd(selecao):
            self.selecoes.append(selecao)
            self.aptidao = self.calculaAptidao()
            self.selecoes = sorted(self.selecoes, key=lambda x: x.aptidao, reverse=True)
            return True
        return False

    def podeAdd(self, selecao:Selecao):
        # Verifica se a seleção pode ser adicionada na combinação
        return not self.chocaGeral(selecao) and len([s for s in self if s.oferta.disciplina.opcional]) < 2

    def calculaAptidao(self): 
        # Calcula a aptidão da combinação
        return sum([s.aptidao for s in self.selecoes])

    def chocaGeral(self, selecao:Selecao):
        # Verifica se a seleção choca com alguma outra da combinação
        for s in self.selecoes:
            if s.choca(selecao):
                return True
        return False