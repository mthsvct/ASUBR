import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AuthContext } from "@/contexts/AuthContext";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import styles from './Combinacoes.module.scss';
import { Button } from "@/components/button";
import { api } from "@/services/apiClient";
import { CombinacoesLists } from "./combinacao";



function Conteudo({user}){

    const [ combinacoes, setCombinacoes ] = useState([]);
    const [ carregando, setCarregando ] = useState(true);

    useEffect(
        () => {
            
            api.get(
                `/combinacoes/aluno/${user.id}`
            ).then(
                response => {
                    setCombinacoes(response.data);
                    setCarregando(false);
                    console.log(response.data);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }, [user]
    );


    return carregando ? <h1>Carregando...</h1> : (

        <div className={styles.conteudo}>
            <div className={styles.combinacoes}>
                <div className={styles.cabecalho}>
                    <h1>Combinações</h1>
                    <Button>Criar nova seleção manual</Button>
                </div>
                <CombinacoesLists combinacoes={combinacoes} user={user}/>
            </div>
        </div>
        
    )
}


export default function Combinacoes() {

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