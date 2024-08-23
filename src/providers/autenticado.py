from fastapi import Depends, HTTPException, Header, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
import jwt
from prisma import Prisma

from src.config.database import getDb
from src.providers.token_provider import ALGORITHM, SECRET_KEY, verificar_access_token
    

oauth2_schema = OAuth2PasswordBearer(tokenUrl="token")


async def autenticado(token:str=Depends(oauth2_schema), db:Prisma=Depends(getDb)):

    exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido"
    )

    try:
        email = verificar_access_token(token)
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Erro no verificar access token"
        )
    
    if not email:
        raise exception
    
    print(f'\n\nemail: {email}\n\n')

    aluno = await db.aluno.find_first(where={'email': email})

    if not aluno:
        raise exception
    
    return aluno