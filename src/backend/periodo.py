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
        prismaInteresse=None,
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
        self.prismaInteresse = prismaInteresse
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
    
    def disponivel(self, aluno:Aluno, oferta:Oferta) -> bool:
        return aluno.podePagar(oferta.disciplina) and oferta.vagas > 0

    def disponiveis(self, aluno:Aluno):
        # Função que retorna todas as ofertas disponíveis para o aluno
        #   - aluno: objeto Aluno
        #   - retorna: lista de objetos Oferta
        return [ oferta for oferta in self.ofertas if self.disponivel(aluno, oferta) ]

    def getOfertas(self, aluno:Aluno):
        ofs = []
        for oferta in self.ofertas:
            aux = oferta.dicioResumido()
            aux['disponivel'] = self.disponivel(aluno, oferta)
            ofs.append(aux)
        return ofs



    # ------------------------------ Métodos de Interesses ------------------------------ # 

    # Função que retorna todas as ofertas que o aluno tem interesse
    def interessesAluno(self, aluno:Aluno) -> [Interesse]: 
        return [ i for i in self.interesses if i.alunoId == aluno.id ]

    def buscaInteresse(self, aluno:Aluno, oferta:Oferta) -> Interesse:
        for i in self.interesses:
            if i.alunoId == aluno.id and i.ofertaId == oferta.id:
                return i
        return None
    
    def interessesOfertas(self, oferta:Oferta) -> [Interesse]:
        return [ i for i in self.interesses if i.ofertaId == oferta.id ]
    
    def temInteresse(self, aluno:Aluno, oferta:Oferta) -> bool: 
        return self.buscaInteresse(aluno, oferta) != None
    
    def atualizarIraMin(self, oferta:Oferta) -> float:
        aux = self.interessesOfertas(oferta)
        aux2 = sorted(aux, key=lambda i: i.aluno.ira, reverse=True)
        if len(aux2) > 0:
            if len(aux2) > oferta.vagas:
                return aux2[oferta.vagas-1].aluno.ira
            else:
                return aux2[-1].aluno.ira
        return 0.0

    def buscaInteresseAlunoDisciplina(self, aluno:Aluno, disciplinaId:int):
        for i in self.interesses:
            if i.alunoId == aluno.id and i.oferta.disciplina.id == disciplinaId:
                return i
        return None


    # ------------------------------ Métodos de Classe ------------------------------ #