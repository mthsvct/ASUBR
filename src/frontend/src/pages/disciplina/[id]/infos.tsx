import { DisciplinaProps } from "@/interfaces/disciplina";
import styles from './Disciplina.module.scss';
import { Descricao } from "@/components/descricao";
import { Button2 } from "@/components/button/button2";
import { CiHeart } from "react-icons/ci";
import { CiCircleCheck } from "react-icons/ci";
import { ehOpcional } from "@/utils/utilitarios";

export function Infos({disciplina}: {disciplina: DisciplinaProps}) {
    return (
        <div className={styles.infos}>
            <div className={styles.coluna1}>
                <div className={styles.name}><h1>{disciplina.name}</h1></div>
                <div className={styles.codigo}><p>{disciplina.codigo}</p></div>
                <div className={styles.opcional}><p>{ehOpcional(disciplina.opcional)}</p></div>
                <div className={styles.nivel}><p>{disciplina.nivel}º periodo</p></div>
                <div className={styles.horas}><p>{disciplina.horas}h</p></div>
                <div className={styles.podePagar}><p>Você pode pagar esta matéria</p></div>
            </div>

            <div className={styles.coluna2}>

                <div className={styles.botoes}>
                    <Button2>
                        <CiCircleCheck />
                        <p>Já pagou?</p>
                    </Button2>
                    <Button2>
                        <CiHeart />
                        <p>Registrar Interesse</p>
                    </Button2>
                </div>

                <div className={styles.descricao}>
                    <Descricao texto={disciplina.descricao} />
                </div>
                
            </div>

        </div>
    )
}