from prisma import Prisma
from .repo import Repo


class Disciplinas(Repo):

    def __init__(self, db: Prisma) -> None:
        super().__init__(db, db.disciplina, 'Disciplina')

    async def periodo(self, nivel:int):
        return await self.entidade.find_many(where={"nivel": nivel})

