import { DisciplinaProps } from "@/interfaces/disciplina";
import styles from './Disciplina.module.scss'
import { IoHelpCircleSharp } from "react-icons/io5";
import { DisciplinaV1 } from "@/components/disciplina";


function DisciplinasProximas({disciplina}:{disciplina: DisciplinaProps}) {
    if (disciplina.prox.length > 0) {
        console.log(disciplina.prox[0])
        return (
            <div className={styles.disciplinas}>
                {
                    disciplina.prox.map(
                        (disciplina, index) => {
                            return (
                                <div key={index} className={styles.disciplinaUnique}>
                                    <DisciplinaV1 
                                        disciplina={disciplina} 
                                        pagou={disciplina.pagou}
                                        />
                                </div>
                            )
                        }
                    )
                }
            </div>
        )
    } else {
        return (
            <div className={styles.disciplinas}>
                <h3>Esta Disciplina não possui disciplinas seguintes.</h3>
            </div>
        )
    }
}


export function Prox({disciplina}: {disciplina: DisciplinaProps}) {
    
    return (
        <div className={styles.prox}>
            <div className={styles.titulo}>
                <div><h1>Próximas Disciplinas</h1></div>
                <div><IoHelpCircleSharp /></div>
            </div>
            <DisciplinasProximas disciplina={disciplina} />
        </div>
    )
}