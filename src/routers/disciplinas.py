from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from prisma import Prisma
from src.config.database import getDb

import src.repositories as rp
import src.schemas as sc

router = APIRouter()


# -------------- Rota para obter um curso -------------- #

@router.get("/", response_model=List[sc.DisciplinaSimples])
async def disciplinas(db:Prisma=Depends(getDb)):
    return await rp.Disciplinas(db).getAll()


@router.get("/{id}", response_model=sc.Disciplina)
async def disciplina(id:int, db:Prisma=Depends(getDb)):
    return await rp.Disciplinas(db).get(id)


@router.get('/nivel/{nivel}', response_model=List[sc.DisciplinaSimples])
async def periodo(nivel:int, db:Prisma=Depends(getDb)):
    return await rp.Disciplinas(db).periodo(nivel)


