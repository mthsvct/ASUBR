import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AuthContext } from "@/contexts/AuthContext";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import styles from './Combinacao.module.scss';
import { api } from "@/services/apiClient";
import { Montador } from "./montador";
import { Button } from "@/components/button";
import { toast } from "react-toastify";



function objetoVazio(n) {
    let i;
    const obj = {};
    for(i=1; i<=n; i++) {
        obj[i] = null;
    }
    return obj;
}

function vazio(selecionadas) {
    let i;
    for(i=1; i<=5; i++) {
        if(selecionadas[i] != null) {
            return false;
        }
    }
    return true;
}


function Conteudo({user}){

    const [ ofertas, setOfertas ] = useState([]);
    const [ carregando, setCarregando ] = useState(true);
    const [ selecionadas, setSelecionadas ] = useState(objetoVazio(5));

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


    async function salvar() {

        if(vazio(selecionadas)) {
            toast.error("Selecione pelo menos uma oferta");
        } else {
            
            let ofertas = [];
            for(let i=1; i<=5; i++) {
                if(selecionadas[i] != null) {
                    ofertas.push(selecionadas[i].id);
                }
            }
            api.post(
                `/combinacoes/add`,
                {
                    "alunoId": user.id,
                    "selecoes": ofertas
                }
            ).then(
                response => {
                    console.log(response);
                    toast.success("Combinação salva com sucesso");
                }
            ).catch(
                error => {
                    console.log(error);
                    toast.error("Erro ao salvar combinação");
                }
            )
        }

    }


    return (
        <div className={styles.conteudo}>
            <div className={styles.combinacao}>
                <div className={styles.cabecalho}>
                    <h1>Monte sua combinação:</h1>
                    <Button
                        onClick={salvar}
                        >Salvar</Button>
                </div>
                <Montador 
                    ofertas={ofertas} 
                    user={user} 
                    setOfertas={setOfertas} 
                    selecionadas={selecionadas}
                    setSelecionadas={setSelecionadas}
                />
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