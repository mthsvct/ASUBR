import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import Head from "next/head";
import styles from './Ofertas.module.scss';
import { FiltroPeriodos } from "@/components/filtro";
import { useEffect, useState } from "react";
import { api } from "@/services/apiClient";
import { PeriodosOfs } from "./periodosOfs";


function Cabecalho(
    {
        selecionado, 
        setSelecionado
    }:{
        selecionado: number, 
        setSelecionado: Function
    }) {
    
    return (
        <div className={styles.cabecalho}>
            <h1>Ofertas</h1>
            <FiltroPeriodos 
                qnt={8}
                selecionado={selecionado}
                setSelecionado={setSelecionado}
                />
        </div>
    )
}


function OfertasCont({
        selecionado, 
        setSelecionado
    }:{
        selecionado: number, 
        setSelecionado: Function
    }) {

    const [ofertas, setOfertas] = useState([]);
    const [ carregando, setCarregando ] = useState(true);

    useEffect(
        () => {
            api.get('/ofertas')
            .then(response => {
                setOfertas(response.data);
                setCarregando(false);
            }
            ).catch(error => {console.log(error)})
        }, []
    )

    return carregando ? <h1>Carregando...</h1> : <PeriodosOfs selecionado={selecionado} ofertas={ofertas} />
}


function Conteudo() {
    const [selecionado, setSelecionado] = useState(-1);
    return (
        <div className={styles.conteudo}>
            <div className={styles.ofertas}>
                <Cabecalho selecionado={selecionado} setSelecionado={setSelecionado} />
                <OfertasCont selecionado={selecionado} setSelecionado={setSelecionado} />
            </div>
        </div>
    )
}

export default function Ofertas() {
    return (
        <>
            <Head><title>Ofertas</title></Head>
            <Header />
            <Conteudo />
            <Footer />
        </>
    )
}