from db import Db
from matricula import Matricula
from disciplina import Disciplina

from cryptography.fernet import Fernet
from hashlib import sha256


class Aluno(Db):

    def __init__(
        self, 
        id:int=None,
        name:str=None,
        email:str=None,
        password:str=None,
        matricula:str=None,
        nivel:int=None,
        ira:float=None,
        matriculas:list=None,
        combinacoes:list=None,
        interesses:list=None,
        cursoId:int=None,
        prisma=None
    ) -> None:
        self.id = id
        self.name = name
        self.email = email
        self.___password = password
        self.matricula = matricula
        self.nivel = nivel
        self.ira = ira
        self.matriculas = matriculas
        self.combinacoes = combinacoes
        self.interesses = interesses
        self.cursoId = cursoId
        self.prisma = prisma
        super().__init__(prisma)

    # ------------------------------ Métodos Especiais ------------------------------ #

    def info(self) -> str: return f"({self.id} - {self.name} - {self.matricula} - {self.nivel}º)"
    def __str__(self) -> str: return self.info()    
    def __repr__(self) -> str: return self.info()

    # -------------------------------- DB ------------------------------ #

    async def preenche_dados(self, objeto=None):
        # Função que preenche os dados do aluno
        await super().preenche_dados(objeto)
        self.id = self.data.id
        self.name = self.data.name
        self.email = self.data.email
        self.password = self.data.password
        self.matricula = self.data.matricula
        self.nivel = self.data.nivel
        self.ira = self.data.ira
        self.cursoId = self.data.cursoId

    async def save(self):
        # Função que salva o aluno no banco de dados   
        return await self.create(
            {
                'name': self.name,
                'email': self.email,
                'matricula': self.matricula,
                'password': self.encripta(self.password), # 'password': 'senha encriptada
                'nivel': self.nivel,
                'ira': self.ira,
                "cursoId": self.cursoId
            }
        )

    async def get_matriculas(self):
        # função que retorna as matriculas do aluno
        pass

    async def get_interesses(self):
        # função que retorna os interesses do aluno
        pass

    async def get_combinacoes(self):
        # função que retorna as combinações do aluno
        pass

    # Função que retorna o aluno pelo email
    async def get_by_email(self, email): return await self.prisma.find_unique(where={'email': email})

    # ------------------------------ Propertys ------------------------------ #

    @property
    def password(self): 
        # Fazer uma verificação de senha
        return self.___password
    
    def encripta(self, p): 
        # Função que encripta a senha
        return sha256(p.encode()).hexdigest()

    @password.setter
    def password(self, password):
        self.___password = password

    # ------------------------------ Métodos ------------------------------ #

    async def login(self, email, senha):
        # Função que faz o login do aluno
        aluno = await self.get_by_email(email)
        if aluno:
            if aluno.password == self.encripta(senha):
                await self.preenche_dados(aluno)
                return self
            else:
                return {"error": "Senha incorreta"}
        else:
            return {"error": "Aluno não encontrado"} 
        
    def verificarPreRequisitos(self, pre):
        # Função que verifica se o aluno pode pagar uma disciplina
        # Deve verificar os pré-requisitos da disciplina
        if pre == None: return True
        if isinstance(pre, Disciplina): return self.pagou(pre)
        if isinstance(pre, list): return [self.verificarPreRequisitos(d) for d in pre]
        if isinstance(pre, dict):
            if pre['op'] == 'OU': return any(self.verificarPreRequisitos(pre['ds']))
            if pre['op'] == 'E':  return all(self.verificarPreRequisitos(pre['ds']))
    
    def podePagar(self, disciplina:Disciplina): 
        # Função que verifica se o aluno pode pagar uma disciplina
        return False if self.pagou(disciplina) else self.verificarPreRequisitos(disciplina.pre)

    def pagou(self, disciplina:Disciplina):
        # Função que verifica se o aluno pagou uma disciplina
        i, encontrado = 0, None # i: contador, encontrado: variável que armazena a disciplina
        while i < len(self.matriculas) and encontrado == None: # Enquanto não encontrar a disciplina
            if self.matriculas[i].disciplina.id == disciplina.id: # Se a disciplina for encontrada
                encontrado = self.matriculas[i] # Encontrado recebe a disciplina
            i += 1 # Incrementa o contador
        return encontrado != None # Se encontrado for diferente de None, retorna True, senão retorna False

    # ------------------------------ GERAR MATRICULAS SINTETICAS ------------------------------ #

    def gerarMatriculas(self, qnt, curso, limite=5):
        # As matriculas sinteticas são matriculas que são geradas aleatoriamente para testar o sistema
        #   - qnt: quantidade de matriculas sinteticas que serão geradas
        #   - curso: curso do aluno
        #   - limite: limite de matriculas que o aluno pode ter
        matriculas = []
        ano = 2021
        semestre = 1
        j = 0

        for i in range(qnt):
            matricula = Matricula(
                ano=ano,
                semestre=semestre,
                disciplina=curso.disciplinas[i]
            )
            matriculas.append(matricula)
            j += 1
            if j == limite:
                j = 0
                if semestre == 2:
                    ano += 1
                    semestre = 1
                else:
                    semestre = 2

        self.matriculas = matriculas



    
    # ------------------------------ MATRICULAS ------------------------------ #

    # Função que retorna todas as matriculas do aluno de um nível.
    def matNivel(self, n): return [ m for m in self.matriculas if m.disciplina.nivel == n ]

    # Função que retorna a quantidade matérias opcionais que o aluno já pagou.
    def pagouOps(self): return len([ m for m in self.matriculas if m.disciplina.opcional ])

    # Retorna true caso o aluno já tenha pago a quantidade requerida de disciplinas opcionais.
    def jaPagouTodasOps(self): return self.pagouOps() == 2
