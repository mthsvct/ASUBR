from disciplina import Disciplina
from horario import Horario
from utilitarios import DIAS
from db import Db

class Oferta(Db):

    def __init__(
        self,
        id:int=None,
        codHorario:str="",
        turma:int=None,
        professor:str=None,
        vagas:int=40,
        disciplina:Disciplina=None,
        horarios:[Horario]=None,
        prisma=None
    ) -> None:
        self.id = id
        self.codHorario = codHorario
        self.turma = turma
        self.professor = professor
        self.vagas = vagas
        self.disciplina = disciplina
        self.horarios = horarios
        self.prisma = prisma
        super().__init__(prisma)

    # ------------------------------ Métodos Especiais ------------------------------ #
    def info(self): return f"(Oferta: {self.disciplina.name} - {self.cod} - {self.vagas}vs)"
    def __str__(self): return self.info()
    def __repr__(self): return self.info()

    # ------------------------------ PROPERTYS ------------------------------ #


    # ------------------------------ DB ------------------------------ #

    async def preenche_dados(self, objeto=None):
        super().preenche_dados(objeto)
        self.id = self.data.id
        self.codHorario = self.data.codHorario
        self.turma = self.data.turma
        self.professor = self.data.professor
        self.vagas = self.data.vagas
        self.disciplina = self.data.disciplina
        self.horarios = self.data.horarios


    async def save(self):
        return await self.create(
            {
                "codHorario": self.codHorario,
                "turma": self.turma,
                "professor": self.professor,
                "vagas": self.vagas,
                "disciplina": self.disciplina.id
            }
        )


    # ------------------------------ Métodos ------------------------------ #

    def hrTurno(self, h):
        if   (h in [6, 12, 18]): return "12"
        elif (h in [8, 14, 20]): return "34"
        elif (h in [10, 16,22]): return "56"

    def montaCod(self, h:Horario): 
        return f"{h.turnoStr[0]}{self.hrTurno(h.hora)}"

    def geraCodHor(self): 
        cod, r = [], []
        for h in self.horarios: 
            cod.append((self.montaCod(h), h))
        d = self.buscaCodIguais(cod)
        for c in d:
            aux = ''
            for h in d[c]: aux+=str( h.dia )
            r.append(aux+c)
        return r
    
    # Montar dicionários com os códigos iguais
        #   chave: código
        #   valor: lista de horários
    def buscaCodIguais(self, cod:[(str, Horario)]):
        cods = {}
        for c in cod:
            if (c[0] in cods): 
                cods[c[0]].append(c[1])
            else: 
                cods[c[0]] = [c[1]]
        return cods

    @property
    def cod(self): return self.geraCodHor() if (self.horarios != []) else None

