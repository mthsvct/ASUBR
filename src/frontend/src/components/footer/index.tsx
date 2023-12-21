import { Logo } from "../logo";

import { MdEmail } from "react-icons/md";
import { FaGithub } from "react-icons/fa6";
import { IoIosInformationCircle } from "react-icons/io";

import styles from './Footer.module.scss'

export function Footer() {
    return (
        <footer className={styles.rodape}>
            <div className={styles.descricao}>
                <Logo justName={true} />
                <p>Para realizar as matrículas em cada semestre, os alunos dos curso de Sistema de Informação da UFPI devem considerar diversos fatores para a escolha, o que pode tornar a etapa de seleção um processo complexo. Considerando esse contexto, o recomendador de disciplinas acadêmicas propõe uma nova forma realizar uma análise dos fatores de seleção de ofertas de disciplinas do período gerando combinações possíveis ao usuário.</p>
            </div>
            <div className={styles.icones}>
                <MdEmail />
                <FaGithub />
                <IoIosInformationCircle />
            </div>
        </footer>
    )
}