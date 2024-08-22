from fastapi import APIRouter, HTTPException, status, Depends
from prisma import Prisma
from src.config.database import getDb

import src.repositories as rp
import src.schemas as sc

router = APIRouter()


# Rota para obter um curso
@router.get("/", response_model=sc.Curso)
async def cursoCompleto(db:Prisma=Depends(getDb)):
    return await rp.Cursos(db).get_with_Disciplinas(1)
