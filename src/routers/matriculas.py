from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from prisma import Prisma

from src.config.database import getDb
import src.repositories as rp
import src.schemas as sc


router = APIRouter()


# ---------------- Rota de matriculas ---------------- #

@router.get("/one/{id}", response_model=sc.Matricula)
async def matricula(id: int, db:Prisma=Depends(getDb)):
    return await rp.Matriculas(db).get(id)


@router.get("/aluno/{alunoId}", response_model=sc.MatriculasAluno)
async def matriculasAluno(alunoId: int, db:Prisma=Depends(getDb)):
    return await rp.Matriculas(db).getByAluno(alunoId)
