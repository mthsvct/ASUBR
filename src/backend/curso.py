from periodo import Periodo
from disciplina import Disciplina
from db import Db
from utilitarios import Uteis
from prisma import Prisma

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
        super().__init__(prisma.curso)

    # ------------------------------ Métodos Especiais ------------------------------ #

    def __str__(self) -> str: return self.info(self.id, self.name, self.qntPeriodos)
    def __repr__(self) -> str: return self.info(self.id, self.name, self.qntPeriodos)

    # ------------------------------ DB ------------------------------ #

    async def preenche_dados(self):
        await super().preenche_dados()
        self.id = self.data.id
        self.name = self.data.name
        self.qntPeriodos = self.data.qntPeriodos
        await self.runs()
        self.atual = await self.buscaAtual()
    
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
    
    # ------------------------------ DISCIPLINAS: OFERTAS ------------------------------ #
    