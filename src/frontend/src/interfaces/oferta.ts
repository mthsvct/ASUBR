// {
//     "id": self.id,
//     "codHorario": self.textoHor(),
//     "turma": self.turma,
//     "professor": self.professor,
//     "vagas": self.vagas,
//     "disciplinaId": self.disciplina.id if self.disciplina else self.disciplinaId,
//     "periodoId": self.periodoId,
//     "iraMin": self.iraMin,
//     'disciplina': self.disciplina.dicioUltraResumido() if self.disciplina else None,
// }

import { DisciplinaPropsResumida } from "./disciplina";

export interface OfertaCompleta {
    id: number;
    codHorario: string;
    turma: number;
    professor: string;
    vagas: number;
    disciplinaId: number;
    periodoId: number;
    iraMin: number;
    disciplina: DisciplinaPropsResumida;
    qntInteressados: number;
    pagou: boolean;
    podePagar: boolean;
}