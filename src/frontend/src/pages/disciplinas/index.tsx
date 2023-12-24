import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import { Footer } from "@/components/footer";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { Header } from "@/components/header";
import styles from './Disciplinas.module.scss'
import { DisciplinaV1 } from "@/components/disciplina";
import { FiltroPeriodos } from "@/components/filtro";
import { MdFilterListAlt } from "react-icons/md";
import { ehOpcional } from "@/utils/utilitarios";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Filtro } from "./filtro";


function verificacoes(disciplina: any, filtros: any) {

    if(!filtros.opcionais && !filtros.semPre && filtros.horas.length == 0) {
        console.log("Nao tem filtro!");
        return true;
    }

    console.log(disciplina)
    
    if(filtros.opcionais && disciplina.opcional) {
        // console.log("Eh Opcional!");
        return true;
    } else if(filtros.semPre && !disciplina.pre) {
        // console.log("Nao tem pre!");
        return true;
    } else if(filtros.horas.length > 0 && filtros.horas.includes(disciplina.horas)) {
        // console.log("Tem as horas!");
        return true;
    }
    return false;
}



function Periodo({disciplinas, periodo, filtros}:{disciplinas: Array<any>, periodo: number, filtros: any}){
    
    let selecionados = [];


    for(let i = 0; i < disciplinas.length; i++) {
        if( verificacoes(disciplinas[i], filtros) ) {
            selecionados.push(
                <div className={styles.disciplina} key={`Disciplina-${i}`}>
                    <DisciplinaV1 key={`${disciplinas[i].id}`} disciplina={disciplinas[i]} />
                </div>
            );
        }
    }

    if (selecionados.length == 0) {
        return <></>
    } 
    
    return (
        <div key={`${periodo}`} className={styles.periodo}>
            <div className={styles.titulo}><h2>{periodo}º Periodo</h2></div>
            <div className={styles.disciplinas}>
            { 
                selecionados
            }
            </div>
        </div>
    )
}


function Periodos({periodos}:{periodos: Array<any>}){

    const [ selecionado, setSelecionado ] = useState(-1);
    const [ filtros, setFiltros ] = useState({
        opcionais: false,
        semPre: false,
        naoPagos: false,
        pagos: false,
        horas: []
    })

    useEffect(
        () => {
            console.log(filtros);
        }, [filtros]
    )

    return (
        <div className={styles.periodos}>

            <div className={styles.titulo}>
                <h1>Disciplinas</h1>
                <FiltroPeriodos qnt={periodos.length} selecionado={selecionado} setSelecionado={setSelecionado} />
                <MdFilterListAlt style={{cursor:'pointer'}} onClick={
                    () => {
                        const menu = document.querySelector(`.${styles.menuFiltro}`) as HTMLElement;
                        if (menu && menu.style.display === 'none') menu.style.display = 'flex';
                        else menu.style.display = 'none';
                    }
                } />
                <Filtro filtros={filtros} setFiltros={setFiltros} />
            </div>

            <div className={styles.periodos}>
            { 
                periodos.map(
                    (periodo, index) => {
                        if(selecionado != -1 && selecionado != index+1) {
                            return
                        } else {
                            return (
                                <Periodo key={`Periodo-${index}`} disciplinas={periodo} periodo={index+1} filtros={filtros} />
                            ) 
                        } 
                    }
                )
            }
            </div>
        </div>
    )
}

export default function Disciplinas() {

    const [ disciplinas, setDisciplinas ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(
        () => {
            api.get('/disciplinas/resumidas/niveis').then(
                response => {
                    setDisciplinas(response.data);
                    setLoading(false);
                }
            ).catch(
                error => {
                    console.log(error);
                    toast.error("Erro ao carregar disciplinas");
                }
            )
        }, [] // toda vez que o tamanho do array de disciplinas mudar, ele vai executar o useEffect.
    )

    return (
        <>
            <Head><title>Disciplinas</title></Head>
            <Header />
            {loading ? <h1>Carregando...</h1> : <Periodos periodos={disciplinas} />}
            <Footer />
        </>
    )    
}