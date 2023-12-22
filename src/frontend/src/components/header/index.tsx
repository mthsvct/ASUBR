import { Logo } from "../logo"
import { FaUserCircle } from "react-icons/fa";
import styles from './Header.module.scss'

export function Header() {
    return (
        <header className={styles.cabecalho}>
            <Logo justName={true} />
            <nav>
                <a href="#"><h4>Seleções</h4></a>
                <a href="#"><h4>Disciplinas</h4></a>
                <a href="#"><h4>Ofertas</h4></a>
                <a href="#"><h4>Interesses</h4></a>
            </nav>
            <FaUserCircle />
        </header>
    )
}