from interesse import Interesse
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
        disciplinaId:int=None,
        disciplina:Disciplina=None,
        horarios:[Horario]=[],
        interesses:[Interesse]=[],
        prisma=None,
        iraMin:float=0.0,
        periodoId:int=None,
        prismaHorario=None,
    ) -> None:
        self.id = id
        self.codHorario = codHorario
        self.turma = turma
        self.professor = professor
        self.vagas = vagas
        self.disciplinaId = disciplinaId
        self.disciplina = disciplina
        self.horarios = horarios
        self.prisma = prisma
        self.iraMin = iraMin
        self.periodoId = periodoId
        self.prismaHorario = prismaHorario
        self.interesses = interesses
        super().__init__(prisma)

    # ------------------------------ Métodos Especiais ------------------------------ #
    
    def info(self): return f"(Oferta: {self.disciplina.name} - {self.cod} - {self.vagas}vs)"
    def __str__(self): return self.info()
    def __repr__(self): return self.info()

    # ------------------------------ PROPERTYS ------------------------------ #


    # ------------------------------ DB ------------------------------ #

    async def preenche_dados(self, objeto=None):
        await super().preenche_dados(objeto)
        self.id = self.data.id
        self.codHorario = self.data.codHorario
        self.turma = self.data.turma
        self.professor = self.data.professor
        self.vagas = self.data.vagas
        self.iraMin = self.data.iraMin
        self.disciplinaId = self.data.disciplinaId
        self.horarios = await self.get_horarios()
        self.periodoId = self.data.periodoId

    async def save(self):
        print(self)
        aux = await self.create(
            {
                "codHorario": self.textoHor(),
                "turma": self.turma,
                "professor": self.professor,
                "vagas": self.vagas,
                "disciplinaId": self.disciplina.id,
                "periodoId": self.periodoId,
                "iraMin": self.iraMin,
            }
        )
        self.id = aux.id
        await self.saveHorarios()
        return aux

    async def saveHorarios(self):
        for h in self.horarios:
            h.ofertaId = self.id
            await h.save()

    def dicio(self):
        return {
            "id": self.id,
            "codHorario": self.textoHor(),
            "turma": self.turma,
            "professor": self.professor,
            "vagas": self.vagas,
            "disciplinaId": self.disciplina.id if self.disciplina else self.disciplinaId,
            "periodoId": self.periodoId,
            "iraMin": self.iraMin,
            'qntInteressados': len(self.interesses),
            'disciplina': self.disciplina.dicioResumido() if self.disciplina else None,
        }
    
    def dicioResumido(self):
        return {
            'id': self.id,
            'disciplina': self.disciplina.dicioUltraResumido() if self.disciplina else {'id':self.disciplinaId},
            'horarios': [ h.dicioResumido() for h in self.horarios ],
            'professor': self.professor,
            'turma': self.turma,
            'qntInteressados': len(self.interesses)
        }

    async def get_horarios(self):
        horarios = []
        busca = await self.prismaHorario.find_many(where={"ofertaId": self.id})
        for h in busca:
            horario = Horario(prisma=self.prismaHorario)
            await horario.preenche_dados(h)
            horarios.append(horario)
        return horarios


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

    # Verifica se uma oferta choca os horários de outra
    def choca(self, oferta):
        for h in self.horarios:
            for h2 in oferta.horarios:
                if h == h2: return True
        return False
    
    def textoHor(self):
        t = ''
        for h in self.cod:
            t += f"{h} "
        t = t.strip()
        return t