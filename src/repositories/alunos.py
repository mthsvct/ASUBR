from fastapi import HTTPException
from prisma import Prisma
from .repo import Repo
import src.schemas as sc

class Alunos(Repo):

    def __init__(self, db:Prisma) -> None:
        super().__init__(db, db.aluno, 'Aluno')


    async def findByEmail(self, email:str) -> sc.Aluno:
        aluno = await self.entidade.find_unique(where={'email': email})
        if aluno is None:
            raise HTTPException(status_code=404, detail=self.msg(404))
        return aluno
    