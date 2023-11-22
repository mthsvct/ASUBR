from utilitarios import DIAS, Uteis


class Horario(Uteis):

    def __init__(
        self,
        id:int=None,
        dia:int=None,
        hora:int=None,
        ocupado:bool=False,
    ):
        self.id = id
        self.dia = dia
        self.hora = hora
        self.ocupado:bool = ocupado
    
    # ------------------------------ Métodos Especiais ------------------------------ #
    def infor(self): return f"({DIAS[self.dia]} - {self.hora}h - {self.status})"
    def __str__(self): return self.infor()
    def __repr__(self): return self.infor()
    
    # ------------------------------ PROPERTYS ------------------------------ #
    @property
    def status(self): return "Ocupado" if self.ocupado else "Livre"

    @property
    def turno(self): return 1 if self.hora < 13 else 2 if self.hora < 17 else 3

    @property
    def turnoStr(self): return "Manhã" if self.turno == 1 else "Tarde" if self.turno == 2 else "Noite"

    # ------------------------------ DB ------------------------------ #