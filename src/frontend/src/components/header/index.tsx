import { Logo } from "../logo"
import { FaUserCircle } from "react-icons/fa";
import styles from './Header.module.scss'
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Button } from "../button";
import { MdClose } from 'react-icons/md';

function Cabecalho({user}) {

    function aparecerMenuPerfil(e) {
        const menuPerfil = document.getElementById('menuPerfil') as HTMLDivElement;
        if (menuPerfil.style.display === 'none') {
            menuPerfil.style.display = 'flex';
        } else {
            menuPerfil.style.display = 'none';
        }
    }



    return (
        <header className={styles.cabecalho}>
            <div className={styles.logo}>
                <a href="/dashboard">
                    <Logo justName={true} />
                </a>
            </div>
            <nav>
                <div>
                    <a href="/combinacoes"><p>Combinações</p></a>
                    <a href="/disciplinas"><p>Disciplinas</p></a>
                    <a href="/ofertas"><p>Ofertas</p></a>
                    <a href="/interesses"><p>Interesses</p></a>
                </div>
            </nav>
            <div className={styles.perfil} onClick={aparecerMenuPerfil}>
                <a href="#">
                    <FaUserCircle />
                    {/* <p>{user.name}</p> */}
                </a>
            </div>

            <div 
                className={styles.menuPerfil} 
                style={{display:'none'}}
                id="menuPerfil">

                <div className={styles.tituloMenu}>
                    <div className={styles.botoesMenu}>
                        <h2>Menu</h2>
                        <MdClose onClick={aparecerMenuPerfil} />
                    </div>
                    <p>Bem vindo, {user.name}!</p>
                </div>
                
                <div className={styles.botoes}>
                    <Button linkagem='/check' >Check</Button>
                    <Button linkagem='/dashboard' >Dashboard</Button>
                    <Button linkagem='/perfil' >Perfil</Button>
                    <Button linkagem='/sobre' >Sobre</Button>
                    <Button linkagem='/sair' >Sair</Button>
                </div>

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