import json
from prisma import Prisma
from dotenv import load_dotenv
load_dotenv();

from curso import Curso
from disciplina import Disciplina

import asyncio


async def main():
    prisma = Prisma()
    await prisma.connect()

    aux = await prisma.curso.find_first()
    curso = Curso(aux.id, prisma=prisma.curso)
    await curso.preenche_dados()
    

    _ = await prisma.disciplina.find_many()

    await curso.getDisciplinaDb(prisma.disciplina)
    curso.runPre()
    curso.runProx()

    print(curso.disciplinas[27])
    print(curso.disciplinas[27].pre)
    print(curso.disciplinas[27].pre.prox)

    await prisma.disconnect()

asyncio.run(main())