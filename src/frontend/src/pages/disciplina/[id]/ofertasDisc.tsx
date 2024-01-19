import { DisciplinaProps } from "@/interfaces/disciplina";
import styles from './Disciplina.module.scss'
import { IoHelpCircleSharp } from "react-icons/io5";
import { OfertaOf } from "@/components/oferta";

function Ofs({disciplina}:{disciplina: DisciplinaProps}){
    
    if (disciplina.ofertas.length > 0) {
        return (
            <div className={styles.disciplinas}>
                {
                    disciplina.ofertas.map(
                        (oferta, index) => {
                            return (
                                <div key={index}>
                                    <OfertaOf oferta={oferta} />
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
                <h3>Esta Disciplina não possui ofertas.</h3>
            </div>
        )
    }
}


export function OfertasDisc({disciplina}: {disciplina: DisciplinaProps}) { 
    return (
        <div className={styles.ofertas}>
            <div className={styles.titulo}>
                <div><h1>Ofertas</h1></div>
                <div><IoHelpCircleSharp /></div>
            </div>
            <Ofs disciplina={disciplina} />
        </div>
    )
}
