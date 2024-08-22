from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from prisma import Prisma
from src.config.database import getDb

import src.repositories as rp
import src.schemas as sc


router = APIRouter()


# Rota para obter um horário
@router.get("/", response_model=List[sc.Horario])
async def horarios(db: Prisma = Depends(getDb)):
    return await rp.Horarios(db).getAll()


@router.get('/one/{id}', response_model=sc.Horario)
async def horario(id: int, db: Prisma = Depends(getDb), ):
    return await rp.Horarios(db).get(id)