from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from prisma import Prisma

# Preciso importar o negocio do async
import asyncio

from curso import Curso


# ----------------- Configurações do FastAPI ----------------- #


app = FastAPI()

# Configurar as origens permitidas (permitir solicitações do seu aplicativo React)
origins = [
    "http://localhost:3000",  # Substitua pela origem real do seu aplicativo React
]

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
# await curso.run()

# --------------------------------- Rotas ------------------------------ #


# -------------- DISCIPLINA -------------- #

@app.get("/disciplina/{id}")
async def disciplina(id:int):
    disciplina = curso[id]
    if disciplina:
        return {"message": disciplina.name}
    else:
        return {"message": "Disciplina não encontrada!"}


# ------------------------------ Main ---------------------------------- #

async def main():
    await prisma.connect()
    curso.atribuiPrisma(prisma)
    await curso.run()
    

if __name__ == "__main__":
    import uvicorn
    asyncio.run(main())
    uvicorn.run(app, host="0.0.0.0", port=8080)
