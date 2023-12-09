from random import choice
from prisma import Prisma

from aluno import Aluno
from oferta import Oferta
from periodo import Periodo
from disciplina import Disciplina
from selecao import Selecao
from combinacao import Combinacao
from db import Db
from utilitarios import Uteis


class Curso(Db, Uteis):

    def __init__(
        self,
        id:int=None,
        name:str=None,
        qntPeriodos:int=None,
        disciplinas:list=[],
        alunos:list=[],
        periodos:list=[],
        prisma:Prisma=None, # Lembrar que esse é o prisma Geral
    ) -> None:
        self.id = id
        self.name = name
        self.qntPeriodos = qntPeriodos
        self.disciplinas = disciplinas
        self.alunos = alunos
        self.periodos = periodos
        self.atual = None
        self.db : Prisma = prisma
        if prisma:
            super().__init__(prisma.curso)

    # ------------------------------ Métodos Especiais ------------------------------ #

    def __str__(self) -> str: return self.info(self.id, self.name, self.qntPeriodos)
    def __repr__(self) -> str: return self.info(self.id, self.name, self.qntPeriodos)
    def __getitem__(self, i): return self.disciplinas[i] if i < len(self.disciplinas) else None

    def dicio(self):
        return {
            "id": self.id,
            "name": self.name,
            "qntPeriodos": self.qntPeriodos
        }

    # ------------------------------ DB ------------------------------ #

    async def run(self):
        aux = await self.prisma.find_first()
        await self.preenche_dados(aux)


    async def preenche_dados(self, objeto=None):
        await super().preenche_dados(objeto)
        self.id = self.data.id
        self.name = self.data.name
        self.qntPeriodos = self.data.qntPeriodos
        await self.runs() # Roda as funções de pré-requisitos e proximos
        self.atual = await self.buscaAtual()
        self.periodos = await self.preenchePeriodos()
    
    async def save(self):
        return await self.create(
            {
                "name": self.name,
                "qntPeriodos": self.qntPeriodos,
            }
        )

    # ------------------------------ LEITURA DO ARQUIVO JSON ------------------------------ #

    def montaDisciplinasArq(self, disciplinas:list):
        for d in disciplinas:
            self.disciplinas.append(
                Disciplina(
                    id=d["id"],
                    name=d["name"],
                    codigo=d["cod"],
                    horas=d["horas"],
                    nivel=d["nivel"],
                    opcional=self.ehOpcional(d),
                    preJSON=d["pre"],
                    id_curso=self.id,
                    prisma=self.db.disciplina
                )
            )

    # ------------------------------ DISCIPLINAS: BD ------------------------------ #

    async def salvarDisciplinas(self):
        for d in self.disciplinas: 
            await d.save()
            print(f"Disciplina {d.name.title()} salva com sucesso!")

    async def getDisciplinaDb(self):
        discs = await self.db.disciplina.find_many()
        for d in discs:
            novo = Disciplina()
            await novo.preenche_dados(d)
            self.disciplinas.append(novo)
        self.disciplinas = sorted(self.disciplinas, key=lambda x: x.id)
        
    # ------------------------------ DISCIPLINAS: BÁSICO ------------------------------ #

    # Função que busca uma disciplina pelo código.
    def busca(self, cod):
        retorno, i = None, 0
        while retorno == None and i < len(self.disciplinas):
            retorno = self.disciplinas[i] if self.disciplinas[i].codigo == cod else None
            i += 1
        return retorno
    
    # Função que busca uma disciplina pelo o nome.
    def buscaName(self, name):
        retorno, i = None, 0
        while retorno == None and i < len(self.disciplinas):
            retorno = self.disciplinas[i] if self.disciplinas[i].name.lower() == name.lower() else None
            i += 1
        return retorno

    # Função que busca uma disciplina pelo o id.
    def buscaId(self, id):
        retorno, i = None, 0
        while retorno == None and i < len(self.disciplinas):
            retorno = self.disciplinas[i] if self.disciplinas[i].id == id else None
            i += 1
        return retorno

    # Função que retorna todas as disciplinas de um determinado nível do curso. 
    def nivel(self, nivel:int=1): return [ i for i in self.disciplinas if i.nivel == nivel ]

    # Função que retorna todas as disciplinas obrigatórias do curso.
    @property
    def obrigatorias(self): return [ i for i in self.disciplinas if not i.opcional ]

    # Função que retorna todas as disciplinas optativas do curso.
    @property
    def opcionais(self): return [ i for i in self.disciplinas if i.opcional ]

    # Função que retorna todas as disciplinas obrigatórias do curso de um determinado nível.
    def obriNivel(self, nivel=1): return [ i for i in self.nivel(nivel) if not i.opcional ]

    # Função que retorna todas as disciplinas optativas do curso de um determinado nível.
    def optaNivel(self, nivel=1): return [ i for i in self.nivel(nivel) if i.opcional ]

    def atribuiPrisma(self, prisma:Prisma):
        self.db = prisma
        self.prisma = prisma.curso

    # ------------------------------ DISCIPLINAS: PRÉ-REQUISITO ------------------------------ #

    # Função que chama 
    async def runs(self):
        if len(self.disciplinas) == 0:
            await self.getDisciplinaDb()
        self.runPre()
        self.runProx()

    # Função que passa todas as disciplinas para a função.
    def runPre(self): 
        for index in range(len(self.disciplinas)): 
            self.disciplinas[index].pre = self.montaPre(self.disciplinas[index].preJSON)

    # Função que monta a estrutura que organiza objetos Disciplina no dicionário.
    def montaPre(self, pre):
        if isinstance(pre, str):  
            return self.busca(pre) if pre != "-" else None
        elif isinstance(pre, dict): 
            return {"op": pre['op'], "ds": self.montaPre(pre['ds'])}
        elif isinstance(pre, list): 
            return [self.montaPre(x) for x in pre]

    # Função que passa todas as disciplinas para a função
    def runProx(self):
        for d in self.disciplinas[::-1]:
            if len(d.proxJSON) > 0:
                d.prox = [ self.busca(x) for x in d.proxJSON ]


    # -------------------------------------- PERIODO ----------------------------------- #

    # Função que retorna o período atual do curso.
    async def buscaAtual(self): 
        p = await self.db.periodo.find_first(where={"atual": True})
        periodo = Periodo()
        await periodo.preenche_dados(p)
        return periodo
    
    # Função que retorna todos os períodos do curso.
    async def preenchePeriodos(self):
        periodos = []
        for p in await self.db.periodo.find_many():
            periodo = Periodo()
            await periodo.preenche_dados(p)
            periodos.append(periodo)
        return periodos
    
    def buscaPeriodo(self, ano:int, semestre:int):
        retorno = None
        for p in self.periodos:
            if p.ano == ano and p.semestre == semestre:
                retorno = p
                break
        return retorno
    
    # ------------------------------ DISCIPLINAS: OFERTAS ------------------------------ #
    


    # ------------------------------ ALUNO ------------------------------ # 
    
    async def ajustaNivel(self, aluno:Aluno):
        # Função que ajusta o nível do aluno conforme as matérias pagas.
        antigo = aluno.nivel
        r = 1
        for i in range(1, self.qntPeriodos):
            nivel = self.obriNivel(i)
            alunoNivel = aluno.matNivel(i)
            if len(alunoNivel) > len(nivel) // 2: r = i
        aluno.nivel = r

        if antigo != aluno.nivel:
            await aluno.update(aluno.id, {"nivel": aluno.nivel})
        
        return aluno.nivel
            
    def aptidao(self, oferta:Oferta, aluno:Aluno) -> int:
        # Função que retorna a aptidão do aluno para uma determinada oferta.
        r = 0
        if oferta.disciplina.opcional and aluno.jaPagouTodasOps():
            r = 1
        else:
            if oferta.disciplina.nivel == aluno.nivel:  
                r += 15
            elif oferta.disciplina.nivel < aluno.nivel: 
                r += 10 + (aluno.nivel - oferta.disciplina.nivel)
            elif oferta.disciplina.nivel > aluno.nivel: 
                r += 10 - (oferta.disciplina.nivel - aluno.nivel)
            qnt = len(oferta.disciplina.prox)
            if qnt > 0: r += qnt
            else: r -= 2
            if oferta.disciplina.opcional: r -= 1

        return r


    # ------------------------------ COMBINACOES ------------------------------ #

    def calculaSelecoes(self, aluno:Aluno, lista:[Oferta]):
        # Esta função retorna uma lista de Selecoes. Selecao com cada aptidão calculada para o aluno.
        aux = [ Selecao(oferta=x, aptidao=self.aptidao(x, aluno), prisma=self.db.selecao) for x in lista ]
        return sorted(aux, key=lambda x: x.aptidao, reverse=True)

    
    async def runCombinacoes(self, aluno:Aluno):
        listaDisponiveis = self.atual.disponiveis(aluno) # Gera lista de ofertas disponíveis ao aluno
        await self.ajustaNivel(aluno) # Antes de gerar as combinações, ajusta o nível do aluno
        listaSelecoes = self.calculaSelecoes(aluno, listaDisponiveis) # Calcula as seleções
        return self.geraCombinacoes(aluno, lista=listaSelecoes) # Gera as combinações


    def geraCombinacoes(self, aluno:Aluno, qnt:int=5, lista:[Selecao]=[]):
        # Função que gera combinações de horários para o aluno.
        #   - aluno: aluno que terá as combinações geradas.
        #   - qnt: quantidade de combinações que serão geradas.
        #   - retorna uma lista de combinações.
        aluno.combinacoes = [ Combinacao(selecoes=[]) for i in range(qnt)  ]
        for index, combinacao in enumerate(aluno.combinacoes):
            if index > 0: 
                self.combina(combinacao, lista)  
            else: 
                self.combinaMaior(combinacao, lista)
        aluno.combinacoes = sorted(aluno.combinacoes, key=lambda x: x.aptidao, reverse=True)
        return aluno.combinacoes    
            

    def combina(self, combinacao:Combinacao, lista:[Selecao]):
        # Realiza a combinacao de selecoes a partir do sorteio Choice.
        i = 1
        while len(combinacao) < 5 and i < len(lista):
            combinacao.add(choice(lista))
            i += 1
    

    def combinaMaior(self, combinacao:Combinacao, lista:[Selecao]):
        # Realiza a combinacao de selecoes a partir do maior.
        i = 1
        while len(combinacao) < 5 and i < len(lista):
            combinacao.add(lista[i])
            i += 1
