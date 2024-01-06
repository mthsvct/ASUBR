

export interface DisciplinaProps {
    id: number;
    name: string;
    codigo: string;
    nivel: number;
    horas: number;
    opcional: boolean;
    descricao: string;
    pre: any;
    prox: Array<any>;
    pagou?: boolean;
}

export interface DisciplinaPropsResumida {
    id: number;
    name: string;
    nivel: number;
    horas: number;
    opcional: boolean;
}