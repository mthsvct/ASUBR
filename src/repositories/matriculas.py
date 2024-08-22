from fastapi import HTTPException
from prisma import Prisma

from src.schemas.matriculas import MatriculasAluno
from .repo import Repo

class Matriculas(Repo):


    def __init__(self, db: Prisma) -> None:
        super().__init__(db, db.matricula, 'Matricula')


    async def get(self, id):
        return await super().get(id, inc={'aluno': True, 'disciplina': True})
    

    async def getByAluno(self, alunoId:int):
        aluno = await self.db.aluno.find_first(where={'id': alunoId})
        if not aluno: raise HTTPException(404, self.msg(404))
        matriculas = await self.db.matricula.find_many(where={'alunoId': alunoId}, include={'disciplina': True})
        return MatriculasAluno(aluno=aluno, matriculas=matriculas)
    

    
    