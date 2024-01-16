import { DisciplinaPropsResumida } from "@/interfaces/disciplina";
import { ehOpcional } from "@/utils/utilitarios";
import styles from './Disciplina.module.scss'

interface DiscV1Props {
    disciplina: DisciplinaPropsResumida;
    pagou?: boolean;
}

function jaPagou(pagou: boolean ) { return pagou ? "Paga!" : "Não paga!" }

function Paga({pagou}: {pagou: boolean | undefined}) {
    if(pagou == undefined) {
        pagou = false;
    }

    if(pagou) {
        return <div className={styles.pagou}><p>{jaPagou(pagou)}</p></div>
    } else {
        return <div className={styles.naoPagou}><p>{jaPagou(pagou)}</p></div>
    }
}


export function DisciplinaV1({disciplina, pagou}:DiscV1Props){
    // console.log(disciplina)
    return (
        <div className={styles.disciplinaV1}>
            <a href={`/disciplina/${disciplina.id}`}>
                <div className={styles.name}><h3>{disciplina.name}</h3></div>
                <div className={styles.horas}><p>{disciplina.horas}h</p></div>
                <div className={styles.opcional}><p>{ehOpcional(disciplina.opcional)}</p></div>
                <div className={styles.nivel}><p>{disciplina.nivel}º Periodo</p></div>
                <Paga pagou={pagou} />
            </a>
        </div>
    )
}