from prisma import Prisma
from .repo import Repo


class Horarios(Repo):

    def __init__(self, db: Prisma) -> None:
        super().__init__(db, db.horario, 'Horario')