from prisma import Prisma
from fastapi import HTTPException

class Repo:

    def __init__(self, db:Prisma, entidade, name='') -> None:
        self.db = db
        self.entidade = entidade
        self.name = name

    async def get(self, id, inc={}):
        if not (aux:=await self.entidade.find_first(where={'id': id}, include=inc)):
            raise HTTPException(404, self.msg(404))
        return aux

    async def create(self, data):
        return await self.entidade.create(data)
    
    async def update(self, id, data):
        return await self.entidade.update(where={'id': id}, data=data)
    
    async def delete(self, id):
        return await self.entidade.delete(where={'id': id})
    
    async def getAll(self):
        return await self.entidade.find_many()
    
    def msg(self, cod:int=404):
        if cod == 404: 
            r = f"{self.name} não encontrado."
        return r