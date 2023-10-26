-- CreateTable
CREATE TABLE "alunos" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL DEFAULT 1,
    "ira" DOUBLE PRECISION NOT NULL DEFAULT -1.0,
    "cursoId" INTEGER NOT NULL,

    CONSTRAINT "alunos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "qntPeriodos" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disciplinas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "horas" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL,
    "opcional" BOOLEAN NOT NULL DEFAULT false,
    "pre" JSONB NOT NULL,
    "prox" JSONB NOT NULL,
    "iraMin" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "descricao" TEXT NOT NULL DEFAULT '',
    "cursoId" INTEGER NOT NULL,

    CONSTRAINT "disciplinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matriculas" (
    "id" SERIAL NOT NULL,
    "ano" INTEGER NOT NULL DEFAULT -1,
    "semestre" INTEGER NOT NULL DEFAULT -1,
    "alunoId" INTEGER NOT NULL,
    "disciplinaId" INTEGER NOT NULL,

    CONSTRAINT "matriculas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "periodos" (
    "id" SERIAL NOT NULL,
    "ano" INTEGER NOT NULL,
    "semestre" INTEGER NOT NULL,
    "inicioMatriculas" TIMESTAMP(3) NOT NULL,
    "fimMatriculas" TIMESTAMP(3) NOT NULL,
    "processamento" TIMESTAMP(3) NOT NULL,
    "atual" BOOLEAN NOT NULL DEFAULT false,
    "cursoId" INTEGER NOT NULL,

    CONSTRAINT "periodos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ofertas" (
    "id" SERIAL NOT NULL,
    "codHorario" TEXT NOT NULL,
    "turma" INTEGER NOT NULL DEFAULT 1,
    "professor" TEXT NOT NULL DEFAULT '',
    "vagas" INTEGER NOT NULL,
    "disciplinaId" INTEGER NOT NULL,
    "periodoId" INTEGER NOT NULL,

    CONSTRAINT "ofertas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horarios" (
    "id" SERIAL NOT NULL,
    "dia" INTEGER NOT NULL,
    "hora" INTEGER NOT NULL,
    "ofertaId" INTEGER NOT NULL,

    CONSTRAINT "horarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combinacoes" (
    "id" SERIAL NOT NULL,
    "aptidao" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "alunoId" INTEGER NOT NULL,

    CONSTRAINT "combinacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "selecoes" (
    "id" SERIAL NOT NULL,
    "aptidao" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "combinacaoId" INTEGER NOT NULL,
    "ofertaId" INTEGER NOT NULL,

    CONSTRAINT "selecoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interesses" (
    "id" SERIAL NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "disciplinaId" INTEGER NOT NULL,
    "periodoId" INTEGER NOT NULL,

    CONSTRAINT "interesses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "alunos_email_key" ON "alunos"("email");

-- AddForeignKey
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disciplinas" ADD CONSTRAINT "disciplinas_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periodos" ADD CONSTRAINT "periodos_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ofertas" ADD CONSTRAINT "ofertas_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ofertas" ADD CONSTRAINT "ofertas_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "periodos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horarios" ADD CONSTRAINT "horarios_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "ofertas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combinacoes" ADD CONSTRAINT "combinacoes_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selecoes" ADD CONSTRAINT "selecoes_combinacaoId_fkey" FOREIGN KEY ("combinacaoId") REFERENCES "combinacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selecoes" ADD CONSTRAINT "selecoes_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "ofertas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interesses" ADD CONSTRAINT "interesses_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interesses" ADD CONSTRAINT "interesses_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interesses" ADD CONSTRAINT "interesses_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "periodos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
