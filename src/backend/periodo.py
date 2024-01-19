from datetime import datetime
from random import choice
from interesse import Interesse

from oferta import Oferta
from db import Db
from horario import Horario
from utilitarios import DIAS
from aluno import Aluno

class Periodo(Db):

    def __init__(
        self,
        id:int=None,
        ano:int=None,
        semestre:int=None,
        atual:bool=None,
        inicioMatriculas:datetime=None,
        fimMatriculas:datetime=None,
        processamento:datetime=None,
        prisma=None,
        ofertas:[Oferta]=[],
        cursoId:int=None,
        prismaOferta=None,
        prismaHorario=None,
        interesses:[Interesse]=[],
    ):
        self.id = id
        self.ano = ano
        self.semestre = semestre
        self.atual = atual
        self.inicioMatriculas = inicioMatriculas
        self.fimMatriculas = fimMatriculas
        self.processamento = processamento
        self.ofertas = ofertas
        self.cursoId = cursoId
        self.prismaOferta = prismaOferta
        self.prismaHorario = prismaHorario
        self.interesses = interesses
        super().__init__(prisma)

    # ------------------------------ Métodos Especiais ------------------------------ #

    def info(self): return f"(Periodo: {self.ano}.{self.semestre})"
    def __str__(self): return self.info()
    def __repr__(self): return self.info()

    def dicio(self):
        return {
            "id": self.id,
            "ano": self.ano,
            "semestre": self.semestre,
            "atual": self.atual,
            "inicioMatriculas": self.inicioMatriculas,
            "fimMatriculas": self.fimMatriculas,
            "processamento": self.processamento,
            "cursoId": self.cursoId,
        }
    
    def dicioResumido(self):
        return {
            "id": self.id,
            "ano": self.ano,
            "semestre": self.semestre,
            "atual": self.atual
        }

    # ------------------------------ DB ------------------------------ #

    async def save(self):
        return await self.create(
            {
                "ano": self.ano,
                "semestre": self.semestre,
                "atual": self.atual,
                "inicioMatriculas": self.inicioMatriculas,
                "fimMatriculas": self.fimMatriculas,
                "processamento": self.processamento,
                "cursoId": self.cursoId,
            }
        )
    
    async def preenche_dados(self, objeto=None):
        await super().preenche_dados(objeto)
        self.id = self.data.id
        self.ano = self.data.ano
        self.semestre = self.data.semestre
        self.atual = self.data.atual
        self.inicioMatriculas = self.data.inicioMatriculas
        self.fimMatriculas = self.data.fimMatriculas
        self.processamento = self.data.processamento
        self.cursoId = self.data.cursoId
        self.ofertas = await self.get_ofertas()

    async def get_ofertas(self):
        ofertas = []
        busca = await self.prismaOferta.find_many(where={"periodoId": self.id})
        for i in busca:
            o = Oferta(prisma=self.prismaOferta, prismaHorario=self.prismaHorario)
            await o.preenche_dados(i)
            ofertas.append(o)
            o = None
        return ofertas
        

    # ------------------------------ OFERTAS SINTÉTICAS ------------------------------ #

    # Função que gera horários artificiais apenas para testes, todos livres.
    def geraHorarios(self, prismaHorario): 
        return { 
            dia: [ 
                Horario(
                    dia=DIAS[dia], 
                    hora=hora, 
                    prisma=prismaHorario,
                ) for hora in range(8, 22, 2) 
            ] for dia in DIAS 
        }
    
    def escolheHorarios(self, disciplina, horarios):
        n = disciplina.horas // 30
        hs = []
        while n > 0:
            novo = choice(horarios[choice(list(horarios.keys()))])
            if novo.ocupado == False and novo.turno < 3:
                novo.ocupado = True; hs.append(novo); n -= 1
        # Retornar ordenado pelo o dia. Se os dois forem iguais, ordena pelo a hora
        return sorted(hs, key=lambda h: (h.dia, h.hora))

    def escolheDisciplina(self, curso, i:int):
        disciplina = None
        while ((disciplina == None) or (disciplina.horas == 15)):
            disciplina = choice(curso.nivel(i))
        return disciplina

    # Função que gera ofertas artificiais apenas para testes
    def gerarOfertas(self, curso):
        ofs = { i: self.geraHorarios(curso.db.horario) for i in range(1, curso.qntPeriodos+1) }
        ofertas = []
        for i in range(1, curso.qntPeriodos+1):
            for d in curso.nivel(i): # 6 ofertas por período
                if d.horas > 15:
                    busca = self.busca(d.id)
                    ofertas.append(
                        Oferta(
                            disciplina = d,
                            turma = busca[0] if busca != [] else 1,
                            horarios = self.escolheHorarios(d, ofs[i]),
                            professor= "Fulano de Tal",
                            prisma=curso.db.oferta,
                            periodoId=self.id
                        )
                    )
        return ofertas

    # ------------------------------ OFERTAS ------------------------------ #

    # Função que retorna todas as ofertas de uma disciplina, buscando pelo o id da disciplina
    def busca(self, dsId:int) -> [Oferta]: 
        ofs = []
        for i in self.ofertas:
            if i.disciplina.id == dsId:
                ofs.append(i)
        return ofs

    def buscaId(self, id:int) -> Oferta: 
        # Função que busca a oferta pelo o id da oferta
        for i in self.ofertas:
            if i.id == id:
                return i
        return None

    def disponiveis(self, aluno:Aluno):
        # Função que retorna todas as ofertas disponíveis para o aluno
        #   - aluno: objeto Aluno
        #   - retorna: lista de objetos Oferta
        return [ o for o in self.ofertas if aluno.podePagar(o.disciplina) and o.vagas > 0 ]



    # ------------------------------ Métodos de Interesses ------------------------------ # 

    # Função que retorna todas as ofertas que o aluno tem interesse
    def interessesAluno(self, aluno:Aluno): 
        return [ o for o in self.ofertas if aluno.temInteresse(o) ]


    # ------------------------------ Métodos de Classe ------------------------------ #