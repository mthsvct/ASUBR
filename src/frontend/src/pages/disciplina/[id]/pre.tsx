import { DisciplinaProps } from "@/interfaces/disciplina";
import styles from './Disciplina.module.scss';
import { IoHelpCircleSharp } from "react-icons/io5";
import { DisciplinaV1 } from "@/components/disciplina";
import { type } from "os";

function MontaPre({pre}: {pre: any}) {

    const key = Math.random() * 100000;

    if(pre === undefined || pre === '-') {
        return <div key={key}>
            <h3>Esta Disciplina não possui pré-requisitos.</h3>
        </div>
    }

    if (pre.ds !== undefined) {
        
        return (
            <details className={styles.op} key={key}>
                <summary>{pre.op}</summary>
                <MontaPre pre={pre.ds} />
            </details>
        )

    } else if(pre.id !== undefined) {
        
        return (
            <div className={styles.disciplinaUnica} key={key+1}>
                <DisciplinaV1 disciplina={pre} pagou={pre.pagou} />
            </div>
        )
    } else {
        return (
            <div className={styles.disciplinas} key={key}>
                {   
                    pre.map((disciplina) => {
                        return MontaPre({pre:disciplina})
                    })
                }

            </div>
        )
    }
}

export function Pre({disciplina}: {disciplina: DisciplinaProps}) {
    return (
        <div className={styles.pre}>
            <div className={styles.titulo}>
                <div><h1>Pré-Requisitos</h1></div>
                <div><IoHelpCircleSharp /></div>
            </div>

            <div className={styles.disciplinas}>
                <MontaPre pre={disciplina.pre} />
            </div>

        </div>
    )
}