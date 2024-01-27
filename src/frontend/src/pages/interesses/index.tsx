import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AuthContext } from "@/contexts/AuthContext";
import { AlunoProps } from "@/interfaces/aluno";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import styles from './Interesses.module.scss';
import { api } from "@/services/apiClient";
import { OfertaOf } from "@/components/oferta";


function InteressesOfs({user, interesses}){
    return (
        <div className={styles.listagem}>
            {
                interesses.map(
                    (interesse, index) => {
                        return <OfertaOf key={index} oferta={interesse.oferta} />
                    }
                )
            }
        </div>
    )
}

function Conteudo({user}){

    const [ interesses, setInteresses ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    

    useEffect(
        () => {
            api.get(`/interesses/aluno/${user.id}/detalhada`).then(
                response => {
                    setInteresses(response.data);
                    setLoading(false);
                }
            ).catch(
                err => {
                    console.log(err);
                }
            )
        }, [user]
    );

    return (
        <div className={styles.conteudo}>
            <div className={styles.interesses}>
                
                {
                    loading ? <h2>Carregando</h2> : (
                        <>
                            <div className={styles.cabecalho}>
                                <h1>Seus Interesses ({interesses.length}/5)</h1>
                            </div>
                            <InteressesOfs user={user} interesses={interesses} />
                        </>
                    ) 
                }
            </div>
        </div>
    )
}

export default function Interesses() {

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
            <Head><title>Interesses</title></Head>
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