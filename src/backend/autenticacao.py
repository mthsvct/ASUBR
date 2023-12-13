from jose import jwt
from datetime import datetime, timedelta
import os

from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()



# ----------------- Configurações do passlib ----------------- #

pwd_context = CryptContext(schemes=["bcrypt"])

def gerar_hash(texto):
    return pwd_context.hash(texto)

def verificar_hash(texto, hash) -> bool:
    return pwd_context.verify(texto, hash)


# ----------------- Configurações do JWT ----------------- #

# CONFIGS:
SECRET_KEY = os.environ.get("SECRET_KEY_HASH")
ALGORITHM = "HS256"
EXPIRES_IN_MIN = 3000 # 3000 minutos


def criar_acess_token(data: dict):
    dados = data.copy()
    expiracao = datetime.utcnow() + timedelta(minutes=EXPIRES_IN_MIN)
    dados.update({"exp": expiracao})
    return jwt.encode(dados, SECRET_KEY, algorithm=ALGORITHM)

def verificar_access_token(token: str):
    carga = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return carga.get('sub')