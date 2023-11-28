
class Db:

    def __init__(self, prisma=None):
        self.prisma = prisma
        self.data = None
    
    async def get(self): return await self.prisma.find_first()
    async def get_id(self, id:int): return await self.prisma.find_first(where={'id': id})
    async def get_all(self): return await self.prisma.find_many()
    async def delete(self, id:int): return await self.prisma.delete(where={'id': id})
    async def create(self, data): return await self.prisma.create(data=data)
    async def update(self, id:int, data): return await self.prisma.update(where={'id': id}, data=data)
    
    async def preenche_dados(self, objeto=None):
        if objeto == None: 
            if self.prisma: 
                self.data = await self.get_id(self.id)
        else:
            self.data = objeto

