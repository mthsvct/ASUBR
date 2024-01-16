from utilitarios import DIAS, Uteis
from db import Db

class Horario(Uteis, Db):

    def __init__(
        self,
        id:int=None,
        dia:int=None,
        hora:int=None,
        ocupado:bool=False,
        ofertaId:int=None,
        prisma=None,
    ):
        self.id = id
        self.dia = dia
        self.hora = hora
        self.ocupado:bool = ocupado
        self.ofertaId = ofertaId
        super().__init__(prisma)

    # ------------------------------ Métodos Especiais ------------------------------ #
    
    def infor(self): return f"({DIAS[self.dia]} - {self.hora}h - {self.status})"
    def __str__(self): return self.infor()
    def __repr__(self): return self.infor()
    def __eq__(self, o: object): return self.choca(o)
    def __dict__(self): return self.dicio()

    # ------------------------------ DB ------------------------------ #

    def save(self):
        return self.create(
            {
                "dia": self.dia,
                "hora": self.hora,
                "ofertaId": self.ofertaId,
                "ocupado": self.ocupado,
            }
        )

    async def preenche_dados(self, objeto=None):
        await super().preenche_dados(objeto)
        self.id = self.data.id
        self.dia = self.data.dia
        self.hora = self.data.hora
        self.ofertaId = self.data.ofertaId
        self.ocupado = self.data.ocupado

    def dicio(self):
        return {
            "id": self.id,
            "dia": self.dia,
            'diaStr': DIAS[self.dia],
            "hora": self.hora,
            "ofertaId": self.ofertaId,
            "ocupado": self.ocupado,
        }
    
    def dicioResumido(self):
        return {
            'id': self.id,
            "dia": self.dia,
            'diaStr': DIAS[self.dia],
            "hora": self.hora
        }


    # ------------------------------ PROPERTYS ------------------------------ #
    @property
    def status(self): return "Ocupado" if self.ocupado else "Livre"

    @property
    def turno(self): return 1 if self.hora < 13 else 2 if self.hora < 17 else 3

    @property
    def turnoStr(self): return "Manhã" if self.turno == 1 else "Tarde" if self.turno == 2 else "Noite"

    # ------------------------------ DB ------------------------------ #

    # ------------------------------ Métodos ------------------------------ #

    # Função que verifica se um outro horário choca com este
    def choca(self, horario): 
        return self.dia == horario.dia and self.hora == horario.hora
