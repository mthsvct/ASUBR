import uvicorn
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from prisma import Prisma
from dotenv import load_dotenv
from autenticacao import gerar_hash, SECRET_KEY, ALGORITHM
import jwt  # PyJWT library
# from fastapi.security import OAuth2PasswordBearer
from curso import Curso
from aluno import Aluno



# ----------------- Configurações do FastAPI ----------------- #

app = FastAPI()

# Configurar as origens permitidas (permitir solicitações do seu aplicativo React)
origins = [ '*', "http://127.0.0.1:3000/", "http://localhost:3000", "http://localhost", "http://localhost:8080" ]

# Adicionar o middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# ----------------- Configurações do Prisma --------------------- #

# Criar uma instância do Prisma
prisma = Prisma()

# Criar uma instância do Curso
curso = Curso()

@app.on_event("startup")
async def startup():
    load_dotenv()
    await prisma.connect()
    curso.atribuiPrisma(prisma)
    await curso.run()

@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()   


# --------------------------------- Rotas ------------------------------ #





# --------------- CURSOS ------------------ #
    
# Rota para obter um curso
@app.get("/curso")
async def cursoCompleto(): return curso.dicio()






# -------------- DISCIPLINAS -------------- #

@app.get("/disciplina/{id}")
async def disciplina(id:int):
    return curso[id-1].dicio() if curso[id-1] else {"message": "Disciplina não encontrada!"}

@app.get("/disciplinas")
async def disciplinas(): 
    return [ disciplina.dicio() for disciplina in curso.disciplinas ]

@app.get("/disciplinas/nivel/{nivel}")
async def disciplinasNivel(nivel:int): 
    return [ disciplina.dicio() for disciplina in curso.nivel(nivel) ]

@app.get('/disciplinas/resumidas')
async def disciplinasResumidas():
    return [ disciplina.dicioResumido() for disciplina in curso.disciplinas ]

@app.get('/disciplina/{discId}/aluno/{alunoId}')
async def disciplinaAluno(discId:int, alunoId:int):
    aluno = curso.buscaAlunoId(alunoId)
    disciplina = curso[discId-1]
    return disciplina.dicioPagas(aluno)

@app.get('/disciplina/{discId}/aluno/{alunoId}/resumida')
async def disciplinaAluno(discId:int, alunoId:int):
    aluno = curso.buscaAlunoId(alunoId)
    disciplina = curso[discId-1]
    return disciplina.dicioResumido(aluno)

@app.get('/disciplinas/aluno/{alunoId}')
async def disciplinasAluno(alunoId:int):
    aluno = curso.buscaAlunoId(alunoId)
    return [ 
        [
            d.dicioResumido(aluno) for d in curso.nivel(i)
        ] for i in range(1, curso.qntPeriodos+1)
    ]

@app.get('/disciplinas/resumidas/niveis')
async def disciplinasResumidasNiveis():
    return [ [ d.dicioResumido() for d in curso.nivel(nivel) ] for nivel in range(1, curso.qntPeriodos+1) ]

@app.get('/disciplinas/ultraresumidas/aluno/{alunoId}')
async def disciplinasUltraResumidas(alunoId:int):
    aluno = curso.buscaAlunoId(alunoId)
    return [[d.dicioUltraResumido(aluno) for d in curso.nivel(i)] for i in range(1, curso.qntPeriodos+1)]






# -------------- PERIODO -------------- #

# Rota para obter o período atual
@app.get("/periodo")
async def periodo(): return curso.atual.dicio()

# Rota para obter um período
@app.get("/periodo/{ano}/{semestre}")
async def periodo(ano:int, semestre:int): 
    return b.dicio() if (b:=curso.buscaPeriodo(ano, semestre)) else {"message": "Período não encontrado!"}





# -------------- ALUNO -------------- #

class AlunoModel(BaseModel):
    email: str
    password: str # A senha e confirmação de senha já devem vir prontas do frontend
    name: str
    matricula: str
    nivel: int = 1
    ira: float = 0.0

class AlunoLogin(BaseModel):
    email: str
    password: str

@app.post("/aluno/cadastrar")
async def cadastrar(aluno: AlunoModel): 
    return await Aluno(prisma=prisma.aluno).cadastrar(aluno, curso, gerar_hash(aluno.password))

@app.post("/aluno/login")
async def login(aluno: AlunoLogin): 
    return await Aluno(prisma=prisma.aluno).login(aluno.email, aluno.password)

class Me(BaseModel):
    token: str

async def autenticado(authorization: str = Header(...)):
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Esquema de autenticação inválido")
        # Sua lógica de validação do token aqui
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = decoded_token.get('sub')
        if email is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        else:
            return email
    except ValueError:
        raise HTTPException(status_code=401, detail="Token inválido")

@app.get("/aluno/me")
async def me(token: str = Depends(autenticado)):
    aluno = await Aluno(prisma=prisma.aluno).preenche_dados_email(token)
    if aluno is None:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return aluno.dicio()

def verifica(eu):
    try:
        decoded_token = jwt.decode(eu.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = decoded_token.get('sub')
        if email is None:
            return 401, 'Token inválido'
        else: 
            return 200, email
    except ValueError:
        return 401, ValueError

@app.delete("/aluno/{id}")
async def delete_aluno(id:int, eu: Me):
    message, aluno = await Aluno(prisma=prisma.aluno).preenche_dados_id(id)
    if message['status'] != 200:
        raise HTTPException(status_code=message['status'], detail=message['message'])
    status, emailOrMessage = verifica(eu)
    if status != 200:
        raise HTTPException(status_code=status, detail=emailOrMessage)
    if aluno.email == emailOrMessage:
        await aluno.delete_this()
        return {"message": "Aluno deletado com sucesso!"}
    else:
        raise HTTPException(status_code=401, detail="Token inválido")

class AlunoCompleto(BaseModel):
    id: int
    email: str
    password: str
    name: str
    matricula: str
    nivel: int
    ira: float
    cursoId: int
    token: str
    mudouSenha: bool = False

@app.put('/aluno/atualizar')
async def update_aluno(dados: AlunoCompleto):
    status, emailOrMessage = verifica(dados)
    if status != 200:
        raise HTTPException(status_code=status, detail=emailOrMessage)
    buscado = await Aluno(prisma=prisma.aluno).preenche_dados_email(dados.email)
    if buscado is None:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    if dados.mudouSenha:
        dados.password = gerar_hash(dados.password)

    await buscado.atribuiAtualiza(dados)
    return {"message": "Aluno atualizado com sucesso!", "aluno": buscado.dicio()}






# -------------- MATRICULA -------------- #

class MatriculaModelo(BaseModel):
    alunoId: int
    disciplinaId: int
    ano: int = 2021
    semestre: int = 1

@app.post('/matricular', )
async def matricular(matricula: MatriculaModelo):
    retorno = await curso.matricular(matricula.alunoId, matricula.disciplinaId, matricula.ano, matricula.semestre)
    if retorno['status'] == 200:
        return {"disciplina": retorno['message'], "pagou": True}
    else:
        raise HTTPException(status_code=retorno['status'], detail=retorno['message'])

class MatriculasModelo(BaseModel):
    alunoId: int
    matriculas: List[MatriculaModelo]

@app.post('/matricular/varias')
async def matricularVarias(matriculas: MatriculasModelo):
    retorno = await curso.matricularVarias(matriculas.alunoId, matriculas.matriculas)
    if retorno['status'] == 200:
        return retorno
    else:
        raise HTTPException(status_code=retorno['status'], detail=retorno['message'])

@app.get('/matriculas/aluno/{alunoId}')
async def matriculasAluno(alunoId:int):
    aluno = curso.buscaAlunoId(alunoId)
    return [ matricula.dicio() for matricula in aluno.matriculas ]

@app.delete('/matricula/delete/{alunoId}/{disciplinaId}')
async def delete_matricula(alunoId:int, disciplinaId:int):
    return await curso.deleteMatricula(alunoId, disciplinaId)


# ------------------------------ Main ---------------------------------- #

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
