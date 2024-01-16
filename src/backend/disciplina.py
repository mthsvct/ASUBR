from db import Db
from utilitarios import Uteis
import json

class Disciplina(Db, Uteis):

    def __init__(
        self,
        id:int=None,
        name:str=None,
        codigo:str=None,
        horas:int=None,
        nivel:int=1,
        opcional:bool=None,
        pre=None,
        preJSON=None,
        prox:list=[],
        descricao:str="",
        ofertas:list=[],
        prisma=None,
        id_curso:int=None,
        proxJSON=None,
        d_json=None
    ):
        self.id = id
        self.name = name
        self.codigo = codigo
        self.horas = horas
        self.nivel = nivel
        self.opcional = opcional
        self.pre = pre
        self.prox = prox
        self.descricao = descricao
        self.ofertas = ofertas
        self.preJSON = preJSON
        self.proxJSON = proxJSON
        self.id_curso = id_curso
        self.d_json = d_json
        super().__init__(prisma)

    @property
    def temPre(self): return self.pre != None

    # ------------------------------ Métodos Especiais ------------------------------ #

    def __str__(self) -> str: return self.info(self.id, self.name, self.codigo, self.horas, self.nivel)
    def __repr__(self) -> str: return self.info(self.id, self.name, self.codigo)
    def __dict__(self, aluno=None):
        return {
            "id": self.id,
            "name": self.name,
            "codigo": self.codigo,
            "horas": self.horas,
            "nivel": self.nivel,
            "opcional": self.opcional,
            "pre": self.pegaPre(self.pre, aluno),
            "prox": self.pegaProx(aluno),
            "descricao": self.descricao,
            "id_curso": self.id_curso
        }

    def dicio(self, aluno=None): return self.__dict__(aluno)
    
    def dicioResumido(self, aluno=None):
        aux = {
            'id': self.id,
            "name": self.name,
            "horas": self.horas,
            "opcional": self.opcional,
            "nivel": self.nivel if self.nivel else 1,
            'pre': self.temPre,
        }
        
        if aluno != None: 
            aux['pagou'] = aluno.pagou(self)
            aux['podePagar'] = aluno.podePagar(self)
        return aux
    
    def dicioPagas(self, aluno):
        
        aux = self.dicio(aluno)
        aux['pagou'] = aluno.pagou(self)
        aux['podePagar'] = aluno.podePagar(self)
        return aux
    
    def dicioUltraResumido(self, aluno=None):
        aux = {'id': self.id, 'name': self.name.title(), 'nivel': self.nivel}
        if aluno: aux['pagou'] = aluno.pagou(self)
        return aux


    # ------------------------------------- DB -------------------------------------- #
    
    async def preenche_dados(self, objeto=None):
        await super().preenche_dados(objeto)
        self.id = self.data.id
        self.name = self.data.name
        self.codigo = self.data.codigo
        self.horas = self.data.horas
        self.nivel = self.data.nivel
        self.opcional = self.data.opcional
        self.preJSON = self.data.pre
        self.proxJSON = self.data.prox
        self.descricao = self.data.descricao
        self.id_curso = self.data.cursoId

    def preenche_dados_json(self):
        self.name = self.d_json['name']
        self.codigo = self.d_json['cod']
        self.horas = self.d_json['horas']
        self.nivel = self.d_json['nivel']
        self.opcional = self.ehOpcional(self.d_json)
        self.preJSON = self.d_json['pre']
        self.proxJSON = self.d_json['prox']
    
    async def save(self):
        return await self.create(
            {
                "name": self.name,
                "codigo": self.codigo,
                "horas": self.horas,
                "nivel": self.nivel,
                "opcional": self.opcional,
                "pre": json.dumps(self.preJSON),
                "prox": json.dumps(self.proxJSON),
                "iraMin": self.iraMin,
                "descricao": self.descricao,
                "curso": {
                    "connect": {
                        "id": self.id_curso
                    }
                }
            }
        )

    # ------------------------------ Métodos de Classe ------------------------------ #

    # Função que adiciona uma disciplina d como proxima de self, em seguida ordena a lista de proximas pelo o n
    def addProx(self, d):
        if d not in self.prox and d != self:
            self.prox.append(d)
            self.prox = sorted(list(set(self.prox)), key=lambda x: x.nivel)

    # Função que retorna se d é pré-requisito de self
    def ehPre(self, d, p=None):
        if self.pre == None: 
            return False
        if d == self.pre: 
            return True
        if p == None: 
            p = self.pre
        if isinstance(p, list):
            for i in p:
                if self.ehPre(d, i): return True
        if isinstance(p, dict): return self.ehPre(d, p["ds"])
        return False
    
    # Função que converte o proximo em lista de códigos
    def converteProx(self):
        return [d.codigo for d in self.prox]

    # Função que converte o pré-requisito em lista de códigos
    def pegaPre(self, pre, aluno=None):
        if pre == None: return '-'
        if isinstance(pre, Disciplina): 
            print('\n'*3, aluno, '\n', pre, '\n'*3, )
            aux = pre.dicioResumido(aluno)
            # if aluno != None:
            #     aux['pagou'] = aluno.pagou(pre)
            return aux
        if isinstance(pre, list): return [self.pegaPre(i, aluno) for i in pre]
        if isinstance(pre, dict): return {'op': pre['op'], 'ds': self.pegaPre(pre['ds'], aluno)}

    def pegaProx(self, aluno=None):
        lista = []
        for d in self.prox:
            aux = d.dicioResumido()
            if aluno:
                aux['pagou'] = aluno.pagou(d)
            lista.append(aux)
        return lista
    