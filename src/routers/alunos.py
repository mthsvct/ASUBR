from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from prisma import Prisma

from src.config.database import getDb
import src.repositories as rp
import src.schemas as sc
import src.services as ss


router = APIRouter()


# ---------------- Rota de alunos ---------------- #

@router.get("/one/{id}", response_model=sc.AlunoSemSenha)
async def aluno(id: int, db: Prisma = Depends(getDb)):
    return await rp.Alunos(db).get(id)


@router.get('/all', response_model=List[sc.AlunoSimples])
async def alunos(db: Prisma = Depends(getDb)):
    return await rp.Alunos(db).getAll()

@router.post('/login', response_model=sc.Logado)
async def login(loginData: sc.AlunoLogin, db:Prisma=Depends(getDb)):
    print(f'\n\n{loginData}\n\n')
    return await ss.login(loginData, db)