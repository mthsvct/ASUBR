from db import Db
from matricula import Matricula
from disciplina import Disciplina
from interesse import Interesse
from cryptography.fernet import Fernet
from hashlib import sha256
from autenticacao import verificar_access_token, gerar_hash, criar_acess_token, verificar_hash

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
        matriculas:[Matricula]=[],
        combinacoes:list=[],
        cursoId:int=None,
        prisma=None,
        prisma_matricula=None
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
        # self.interesses = interesses
        self.cursoId = cursoId
        self.prisma = prisma
        self.prisma_matricula = prisma_matricula
        super().__init__(prisma)

    # ------------------------------ Métodos Especiais ------------------------------ #

    def info(self) -> str: return f"({self.id} - {self.name} - {self.matricula} - {self.nivel}º)"
    def __str__(self) -> str: return self.info()    
    def __repr__(self) -> str: return self.info()

    def dicio(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "matricula": self.matricula,
            'nivel': self.nivel,
            'ira': self.ira,
            "cursoId": self.cursoId
        }

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
        # self.matriculas = await self.get_matriculas()
        # self.interesses = await self.get_interesses()

    async def save(self):
        # Função que salva o aluno no banco de dados
        return await self.create(
            {
                'name': self.name,
                'email': self.email,
                'matricula': self.matricula,
                'password': self.password, # 'password': 'senha encriptada
                'nivel': self.nivel,
                'ira': self.ira,
                "cursoId": self.cursoId
            }
        )

    
    # -------------------------------- DB ------------------------------ #

    async def get_interesses(self):
        # função que retorna os interesses do aluno
        pass

    async def get_combinacoes(self):
        # função que retorna as combinações do aluno
        pass

    # Função que retorna o aluno pelo email
    async def get_by_email(self, email): 
        return await self.prisma.find_unique(where={'email': email})
    
    async def preenche_dados_email(self, email):
        # Função que preenche os dados do aluno pelo email
        objeto = await self.get_by_email(email)
        if objeto is None:
            return None
        else:
            await self.preenche_dados(await self.get_by_email(email))
            return self

    async def preenche_dados_id(self, id):
        busca = await self.get_id(id)
        if busca is None:
            retorno = {"status": 404, "message": "Aluno não encontrado"}
        else:
            await self.preenche_dados(busca)
            retorno = {"status": 200, "message": "Aluno encontrado", 'aluno': self.dicio()}
        return retorno, self

    async def atualizar(self):
        # Função que atualiza o aluno no banco de dados
        dicio = self.dicio()
        dicio['password'] = self.password
        return await self.update(self.id, dicio)
    
    def atribuir(self, objeto):
        # Função que atribui os dados do objeto ao aluno
        self.name = objeto.name
        self.email = objeto.email
        self.password = objeto.password
        self.matricula = objeto.matricula
        self.nivel = objeto.nivel
        self.ira = objeto.ira
        self.cursoId = objeto.cursoId

    async def atribuiAtualiza(self, objeto):
        # Função que atribui os dados do objeto ao aluno e atualiza no banco de dados
        self.atribuir(objeto)
        await self.atualizar()

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
        aluno = await self.get_by_email(email) # Busca o aluno pelo email


        print('\n', aluno, '\n')

        if aluno != None: # Se o aluno for encontrado
            if verificar_hash(senha, aluno.password): 
                await self.preenche_dados(aluno)
                token = criar_acess_token({"sub": self.email})
                return {
                    "status": 200,
                    "message": "Login realizado com sucesso!", 
                    "aluno": self.dicio(), 
                    'token': token
                }
            else:
                return {
                    "status": 401,
                    "error": "Senha incorreta"
                }
        else:
            return {
                "status": 404,
                "error": "Aluno não encontrado"
            }

    async def cadastrar(self, aluno, curso, password):
        # Função que cadastra o aluno no banco de dados
        buscado = curso.buscaAluno(aluno.email)
        if buscado:
            return {
                "status": 401,    
                "message": "Email já cadastrado!"
            }
        else:
            novo = Aluno(
                name=aluno.name,
                email=aluno.email,
                password=password,
                matricula=aluno.matricula,
                nivel=aluno.nivel,
                ira=aluno.ira,
                cursoId=curso.id,
                prisma=self.prisma
            )
            await novo.save()
            await curso.atualizarAlunos()
            token = criar_acess_token({"sub": aluno.email})
            return {
                "status": 200,
                "message": "Aluno cadastrado com sucesso!", 
                "aluno": curso.alunos[-1].dicio(),
                "token": token
            }

    def verificarPreRequisitos(self, pre):
        # Função que verifica se o aluno pode pagar uma disciplina
        # Deve verificar os pré-requisitos da disciplina
        if pre == None: return True
        if isinstance(pre, Disciplina): return self.pagou(pre)
        if isinstance(pre, list): return [self.verificarPreRequisitos(d) for d in pre]
        if isinstance(pre, dict):
            if pre['op'] == 'OU': return any(self.verificarPreRequisitos(pre['ds']))
            if pre['op'] == 'E':  return all(self.verificarPreRequisitos(pre['ds']))
    
    def podePagar(self, disciplina:Disciplina) -> bool: 
        # Função que verifica se o aluno pode pagar uma disciplina
        return False if self.pagou(disciplina) else self.verificarPreRequisitos(disciplina.pre)

    def pagou(self, disciplina:Disciplina) -> bool:
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

    # Função que cria e adiciona uma nova matricula ao aluno.
    async def matricular(self, disciplina, prisma, ano=2021, semestre=1, salvando:bool=False) -> Matricula:
        nova = Matricula(ano=ano,semestre=semestre,disciplina=disciplina,prisma=prisma, alunoId=self.id)
        self.matriculas.append(nova)
        self.matriculas.sort(key=lambda m: m.disciplina.nivel)
        if salvando:
            await nova.save()
        return nova
    
    # Função que busca uma matricula do aluno
    def buscaMatricula(self, disciplina) -> Matricula:
        i, encontrado = 0, None
        while i < len(self.matriculas) and encontrado == None:
            if self.matriculas[i].disciplina.id == disciplina.id:
                encontrado = self.matriculas[i]
            i += 1
        return encontrado
    
    async def deleteMatricula(self, disciplina:Disciplina):
        # Função que deleta uma matricula do aluno
        matricula = self.buscaMatricula(disciplina)
        if matricula:
            await matricula.delete_this()
            self.matriculas.remove(matricula)
            return {"message": "Matricula deletada com sucesso!"}         
        else:
            raise Exception("Matricula não encontrada")
        

    # ------------------------------ INTERESSES ------------------------------ #
        
    # # Função que retorna todos os interesses do aluno
    # def temInteresse(self, oferta): 
    #     for interesse in self.interesses:
    #         if interesse.oferta.id == oferta.id:
    #             return True
    #     return False
