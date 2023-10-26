

class Dias:

    def __init__(self) -> None:
        self.dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
    

    def __getitem__(self, i): return self.getDia(i) if isinstance(i, int) else self.getIndex(i.title())
    def __iter__(self): return iter(self.semana)
    def __len__(self): return len(self.semana)

    @property
    def semana(self): return self.dias[1:6]
    
    @property
    def fim(self): return [self.dias[0], self.dias[6]]

    def getDia(self, i): return self.dias[i-1] if i > 0 and i < 8 else None
    def getIndex(self, dia): return self.dias.index(dia) + 1 if dia in self.dias else None
    def estrutura(self): return {dia:[] for dia in self.semana}


DIAS = Dias()