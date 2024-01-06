import { Logo } from "../logo"
import { FaUserCircle } from "react-icons/fa";
import styles from './Header.module.scss'
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

function Cabecalho({user}) {
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
                    {/* <p>{user.name}</p> */}
                </a>
            </div>
        </header>
    )
}



export function Header() {
    const { user, loading } = useContext(AuthContext);
    const [ carregando, setCarregando ] = useState(true);

    useEffect(
        () => {
            if (!loading) { setCarregando(false) } 
        }, [loading]
    );

    if (carregando) {
        return <p>Carregando...</p>
    } else {
        return (<Cabecalho user={user} />)
    }

}