import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { AuthContext } from "@/contexts/AuthContext";
import Head from "next/head"
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import styles from './Oferta.module.scss';
import { OfertaCompleta } from "@/interfaces/oferta";
import { api } from "@/services/apiClient";
import { OfertaMain } from "./ofertaMain";


function Conteudo({ id, user }) {

    const [ oferta, setOferta ] = useState<OfertaCompleta | null>(null);
    const [ carregando, setCarregando ] = useState(true);

    useEffect(
        () => {
            api.get(`/oferta/${id}/aluno/${user.id}`)
            .then(
                response => {
                    setOferta(response.data);
                    setCarregando(false);
                    console.log(response.data);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }, [id]
    )

    return (
        <div className={styles.conteudo}>
            {
                carregando ? 
                    <h1>Carregando</h1> :
                    <OfertaMain 
                        oferta={oferta} 
                        setOferta={setOferta} 
                        user={user} /> 
            }
        </div>
    )
}




export default function Oferta() {
    
    const router = useRouter();
    const { id } = router.query;
    const { user, loading } = useContext(AuthContext);
    const [ carregando, setCarregando ] = useState(true);

    useEffect(
        () => {
            if (!loading && id != undefined) {
                setCarregando(false);
            } 
        }, [loading, id]
    );
    
    
    return (
        <>  
            <Head><title>Oferta</title></Head>
            <Header />
            {
                carregando ? 
                    <h1>Carregando</h1> : 
                    <Conteudo id={id} user={user} />
            }
            <Footer />
        </>
    )
}