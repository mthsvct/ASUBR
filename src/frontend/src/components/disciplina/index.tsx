import { DisciplinaPropsResumida } from "@/interfaces/disciplina";
import { ehOpcional } from "@/utils/utilitarios";
import styles from './Disciplina.module.scss'

interface DiscV1Props {
    disciplina: DisciplinaPropsResumida;
    index?: number | undefined;
}

export function DisciplinaV1({disciplina}:DiscV1Props){
    return (
        <div className={styles.disciplinaV1}>
            <a href={`/disciplina/${disciplina.id}`}>
                <div className={styles.name}><h3>{disciplina.name}</h3></div>
                <div className={styles.horas}><p>{disciplina.horas}h</p></div>
                <div className={styles.opcional}><p>{ehOpcional(disciplina.opcional)}</p></div>
                <div className={styles.nivel}><p>{disciplina.nivel}º Periodo</p></div>
                <div className={styles.paga}><p>Não paga!</p></div>
            </a>
        </div>
    )
}