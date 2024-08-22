from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from src.config.database import finalizar, inicializar
import src.routers as rt


app = FastAPI()

# Configurar as origens permitidas (permitir solicitações do seu aplicativo React)
origins = ['*']

# Adicionar o middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------- PRISMA ---------------------------- #

# Ao iniciar:
@app.on_event("startup")
async def startup():
    load_dotenv()
    await inicializar()


# Ao finalizar:
@app.on_event("shutdown")
async def shutdown():
    await finalizar()


# ---------------------------- ROTAS ---------------------------- #

app.include_router(rt.alunos, prefix="/alunos")
app.include_router(rt.cursos, prefix="/cursos")
app.include_router(rt.disciplinas, prefix="/disciplinas")
app.include_router(rt.horarios, prefix="/horarios")
app.include_router(rt.matriculas, prefix="/matriculas")



