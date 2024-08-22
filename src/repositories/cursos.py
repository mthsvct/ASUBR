from prisma import Prisma
from .repo import Repo

class Cursos(Repo):

    def __init__(self, db: Prisma) -> None:
        super().__init__(db, db.curso, 'Curso')

    async def get_with_Disciplinas(self, id:int):
        return await self.entidade.find_first(where={"id":id}, include={"disciplinas":True})

    