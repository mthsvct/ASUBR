from dotenv import load_dotenv
from prisma import Prisma
from fastapi import HTTPException

load_dotenv()

prisma = Prisma()

async def inicializar():
    await prisma.connect()

async def finalizar():
    await prisma.disconnect()

def getDb() -> Prisma:
    if prisma is None:
        raise HTTPException(status_code=500, detail="Erro ao conectar com o banco de dados")
    return prisma
