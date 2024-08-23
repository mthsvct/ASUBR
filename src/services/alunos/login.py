from fastapi import HTTPException
from prisma import Prisma
from src.providers.hash_provider import verificar_hash
from src.providers.token_provider import criar_access_token
import src.schemas as sc
import src.repositories as rp


async def login(ld: sc.AlunoLogin, db:Prisma) -> sc.Logado:
    aluno = await rp.Alunos(db).findByEmail(ld.email) # Buscar o aluno pelo o email;
    if not verificar_hash(ld.password, aluno.password): # Verificar se a senha está correta;
        raise HTTPException(status_code=401, detail="Credenciais incorretos.") # Se não, retornar um erro 401;
    token = criar_access_token({"sub": aluno.email}) # Se sim, criar um token de acesso;
    return sc.Logado(token=token, aluno=aluno)