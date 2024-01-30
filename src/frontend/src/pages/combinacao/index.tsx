import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AuthContext } from "@/contexts/AuthContext";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import styles from './Combinacao.module.scss';
import { api } from "@/services/apiClient";
import { Montador } from "./montador";
import { Button } from "@/components/button";







function Conteudo({user}){

    const [ ofertas, setOfertas ] = useState([]);
    const [ carregando, setCarregando ] = useState(true);

    useEffect(
        () => {
            api.get(
                `/ofertas/disponiveis/${user.id}`
            ).then(
                response => {
                    setOfertas(response.data);
                    setCarregando(false);
                    // console.log(response.data);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }, [user]
    )


    return (
        <div className={styles.conteudo}>
            <div className={styles.combinacao}>
                <div className={styles.cabecalho}>
                    <h1>Monte sua combinação:</h1>
                    <Button>Salvar</Button>
                </div>
                <Montador ofertas={ofertas} user={user} setOfertas={setOfertas} />
            </div>
        </div>
    )
}




export default function Combinacao() {

    const { user, loading } = useContext(AuthContext);
    const [ carregando, setCarregando ] = useState(true);

    useEffect(
        () => {
            if (loading == false) {
                setCarregando(false);
            } 
        }, [loading]
    );
    
    return (
        <>
            <Head><title>Combinações</title></Head>
            <Header />
            {
                carregando ? 
                    <h1>Carregando</h1> : 
                    <Conteudo user={user} />
            }
            <Footer />
        </>
    )
}