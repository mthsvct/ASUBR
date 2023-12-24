import { Logo } from "../logo"
import { FaUserCircle } from "react-icons/fa";
import styles from './Header.module.scss'

export function Header() {
    return (
        <header className={styles.cabecalho}>
            <div className={styles.logo}>
                <a href="/dashboard">
                    <Logo justName={true} />
                </a>
            </div>
            <nav>
                <div>

                    <a href="#"><p>Combinações</p></a>
                    <a href="/disciplinas"><p>Disciplinas</p></a>
                    <a href="#"><p>Ofertas</p></a>
                    <a href="#"><p>Interesses</p></a>
                </div>
            </nav>
            <div className={styles.perfil}>
                <a href="#">
                    <FaUserCircle />
                </a>
            </div>
        </header>
    )
}