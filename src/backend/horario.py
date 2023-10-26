from utilitarios import DIAS


class Horario:

    def __init__(
        self,
        id:int,
        dia:int,
        hora:int
    ):
        self.id = id
        self.dia = dia
        self.hora = hora

    def info(self): return f"({DIAS[self.dia]} - {self.hora}h)"
    def __str__(self): return self.info()
    def __repr__(self): return self.info()
        