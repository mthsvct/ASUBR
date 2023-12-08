import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from prisma import Prisma
import asyncio

from curso import Curso


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


# --------------------------------- Rotas ------------------------------ #

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


# ------------------------------ Main ---------------------------------- #

async def main():
    print("Conectando ao banco de dados...")
    await prisma.connect()
    curso.atribuiPrisma(prisma)
    await curso.run()
    

if __name__ == "__main__":
    asyncio.run(main())
    uvicorn.run(app, host="0.0.0.0", port=8080)
