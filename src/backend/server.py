import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from prisma import Prisma
from dotenv import load_dotenv
from autenticacao import gerar_hash, SECRET_KEY, ALGORITHM

import jwt  # PyJWT library

# from fastapi.security import OAuth2PasswordBearer

from curso import Curso
from aluno import Aluno


# ----------------- Configurações do FastAPI ----------------- #

app = FastAPI()

# Configurar as origens permitidas (permitir solicitações do seu aplicativo React)
origins = ["http://localhost:3000"]

# Adicionar o middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------- Configurações do Prisma --------------------- #

# Criar uma instância do Prisma
prisma = Prisma()

# Criar uma instância do Curso
curso = Curso()

@app.on_event("startup")
async def startup():
    load_dotenv()
    await prisma.connect()
    curso.atribuiPrisma(prisma)
    await curso.run()

@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()   


# --------------------------------- Rotas ------------------------------ #

# --------------- CURSOS ------------------ #

# Rota para obter um curso
@app.get("/curso")
async def cursoCompleto(): return curso.dicio()


# -------------- DISCIPLINAS -------------- #

@app.get("/disciplina/{id}")
async def disciplina(id:int):
    return curso[id].dicio() if curso[id] else {"message": "Disciplina não encontrada!"}

@app.get("/disciplinas")
async def disciplinas():
    return [ disciplina.dicio() for disciplina in curso.disciplinas ]

@app.get("/disciplinas/{nivel}")
async def disciplinasNivel(nivel:int): 
    return [ disciplina.dicio() for disciplina in curso.nivel(nivel) ]

# -------------- PERIODO -------------- #

# Rota para obter o período atual
@app.get("/periodo")
async def periodo(): return curso.atual.dicio()

# Rota para obter um período
@app.get("/periodo/{ano}/{semestre}")
async def periodo(ano:int, semestre:int): 
    return b.dicio() if (b:=curso.buscaPeriodo(ano, semestre)) else {"message": "Período não encontrado!"}

# -------------- ALUNO -------------- #

class AlunoModel(BaseModel):
    email: str
    password: str # A senha e confirmação de senha já devem vir prontas do frontend
    name: str
    matricula: str
    nivel: int = 1
    ira: float = 0.0

class AlunoLogin(BaseModel):
    email: str
    password: str

@app.post("/aluno/cadastrar")
async def cadastrar(aluno: AlunoModel):
    return await Aluno(prisma=prisma.aluno).cadastrar(aluno, curso, gerar_hash(aluno.password))

@app.post("/aluno/login")
async def login(aluno: AlunoLogin):
    return await Aluno(prisma=prisma.aluno).login(aluno.email, aluno.password)

class Me(BaseModel):
    token: str

@app.get("/aluno/me")
async def me(eu: Me):
    # Decodificar o token, pegar o telefone, buscar o usuário no bd e retornar.
    try:
        # Decodificando o token para obter o telefone
        decoded_token = jwt.decode(eu.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = decoded_token.get('sub')
        # Verifica se o telefone existe no token
        if email is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        # Consulta no banco de dados pelo telefone
        aluno = await Aluno(prisma=prisma.aluno).preenche_dados_email(email)
        if aluno is None:
            raise HTTPException(status_code=404, detail="Aluno não encontrado")
        return aluno.dicio()
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")






# ------------------------------ Main ---------------------------------- #

async def main():
    print("Conectando ao banco de dados...")
    await prisma.connect()
    curso.atribuiPrisma(prisma)
    await curso.run()
    

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
