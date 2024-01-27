import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import Head from "next/head";
import styles from './Ofertas.module.scss';
import { FiltroPeriodos } from "@/components/filtro";
import { useContext, useEffect, useState } from "react";
import { api } from "@/services/apiClient";
import { PeriodosOfs } from "./periodosOfs";
import { AuthContext } from "@/contexts/AuthContext";
import { AlunoProps } from "@/interfaces/aluno";
import { Input } from "@/components/input";



function Cabecalho(
    {
        selecionado, 
        setSelecionado,
        disponiveis,
        setDisponiveis
    }:{
        selecionado: number, 
        setSelecionado: Function,
        disponiveis: boolean,
        setDisponiveis: Function
    }) {
    
    return (
        <div className={styles.cabecalho}>
            <h1>Ofertas</h1>

            <FiltroPeriodos 
                qnt={8}
                selecionado={selecionado}
                setSelecionado={setSelecionado}
                />

            <form>
                <Input 
                    type="checkbox" 
                    id="soDisponivel"
                    onChange={
                        (e) => {
                            setDisponiveis(e.target.checked)
                        }
                    }
                    />
                <label htmlFor="soDisponivel">
                    Apenas ofertas que você pode se matricular
                </label>
            </form>
            
        </div>
    )
}


function OfertasCont({
        selecionado, 
        setSelecionado,
        user,
        disponiveis,
        setDisponiveis
    }:{
        selecionado: number, 
        setSelecionado: Function,
        user:AlunoProps,
        disponiveis: boolean,
        setDisponiveis: Function
    }) {

    const [ofertas, setOfertas] = useState([]);
    const [ carregando, setCarregando ] = useState(true);

    useEffect(
        () => {
            api.get(`/ofertas/${user.id}`)
            .then(response => {
                setOfertas(response.data);
                setCarregando(false);
                console.log(response.data); 
            }
            ).catch(error => {console.log(error)})
        }, []
    )

    if(carregando) {
        return <h1>Carregando...</h1>
    } else {
        return (
            <PeriodosOfs 
                selecionado={selecionado} 
                ofertas={ofertas} 
                disponiveis={disponiveis}
            />
        )
    }



    // return carregando ? <h1>Carregando...</h1> : <PeriodosOfs selecionado={selecionado} ofertas={ofertas} />
}


function Conteudo({user}) {
    const [selecionado, setSelecionado] = useState(-1);
    const [disponiveis, setDisponiveis] = useState(false);

    return (
        <div className={styles.conteudo}>
            <div className={styles.ofertas}>
                <Cabecalho 
                    selecionado={selecionado} 
                    setSelecionado={setSelecionado} 
                    disponiveis={disponiveis}
                    setDisponiveis={setDisponiveis}
                    />
                <OfertasCont 
                    user={user} 
                    selecionado={selecionado} 
                    setSelecionado={setSelecionado} 
                    disponiveis={disponiveis}
                    setDisponiveis={setDisponiveis}
                    />
            </div>
        </div>
    )
}

export default function Ofertas() {

    const { user, loading } = useContext(AuthContext);
    const [ carregando, setCarregando ] = useState(true);

    console.log(loading)

    useEffect(
        () => {
            if (loading == false) {
                setCarregando(false);
            } 
        }, [loading]
    );
    

    return (
        <>
            <Head><title>Ofertas</title></Head>
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