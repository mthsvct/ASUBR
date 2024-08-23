from jose import JWTError, jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os


load_dotenv()


SECRET_KEY = os.getenv("SECRET_KEY_HASH")
ALGORITHM = os.getenv("ALGORITHM")


# Deixar uns 3 dias para expirar
EXPIRES_IN_MINUTE = 60 * 24 * 3


def criar_access_token(data:dict):
    dados = data.copy()
    expiracao = datetime.now() + timedelta(minutes=EXPIRES_IN_MINUTE)
    dados.update({"exp": expiracao})
    token_jwt = jwt.encode(dados, SECRET_KEY, algorithm=ALGORITHM)
    return token_jwt 


def verificar_access_token(token: str):
    carga = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return carga.get('sub')