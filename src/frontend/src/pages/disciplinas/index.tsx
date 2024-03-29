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
import { AuthContext } from "@/contexts/AuthContext";

function verHoras(filtros: any, disciplina: any) {
    return filtros.horas.includes(disciplina.horas);
}

function filtrado(filtros: any) {
    return (
        !filtros.opcionais && 
        !filtros.obrigatorias && 
        !filtros.semPre && 
        !filtros.naoPagos &&
        !filtros.pagos 
    )
}


function verificacoes(disciplina: any, filtros: any, pagou: boolean ) {

    let retorno = false;

    if(filtrado(filtros) && filtros.horas.length == 0) {
        // Se não possui filtro nenhum e não possui filtro de horas
        // Então retorna true, pois essa disciplina pode aparecer.
        return true;

    } else if(filtrado(filtros) && filtros.horas.length > 0){
        // Se não possui filtro nenhum, mas possui filtro de horas
        // Então retorna true somente a disciplina tem a quantidade de horas que está incluida no filtro de horas.
        return verHoras(filtros, disciplina);
    } else {
        // Se possui algum filtro
        // Então retorna true somente se a disciplina passar por todos os filtros.
        if(filtros.opcionais && disciplina.opcional) {
            retorno = true;
        } else if(filtros.obrigatorias && !disciplina.opcional) {
            retorno = true;
        } else if(filtros.semPre && !disciplina.pre) {
            retorno = true;
        } else if(filtros.naoPagos && !pagou) {
            retorno = true;
        } else if(filtros.pagos && pagou) {
            retorno = true;
        } else {
            retorno = false;
        }

        if(retorno && filtros.horas.length > 0) {
            retorno = verHoras(filtros, disciplina);
        }
    }


    return retorno;  
}



function Periodo({disciplinas, periodo, filtros}:{disciplinas: Array<any>, periodo: number, filtros: any}){
    
    let selecionados = [];

    for(let i = 0; i < disciplinas.length; i++) {
        if( verificacoes(disciplinas[i], filtros, disciplinas[i].pagou) ) {
            selecionados.push(
                <div className={styles.disciplina} key={`Disciplina-${i}`}>
                    <DisciplinaV1 
                        key={`${disciplinas[i].id}`} 
                        disciplina={disciplinas[i]} 
                        pagou={disciplinas[i].pagou} 
                    />
                </div>
            );
        }
    }
    
    return (
        <div key={`${periodo}`} className={styles.periodo}>
            <div className={styles.titulo}><h2>{periodo}º Periodo</h2></div>
            <div className={styles.disciplinas}>
            { 
                selecionados.length == 0 ? <h4>Não há disciplinas nesse período</h4> : selecionados
            }
            </div>
        </div>
    )
}


function Periodos({periodos}:{periodos: Array<any>}){

    const [ selecionado, setSelecionado ] = useState(-1);
    const [ filtros, setFiltros ] = useState({
        opcionais: false,
        obrigatorias: false,
        semPre: false,
        naoPagos: false,
        pagos: false,
        horas: []
    })

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

function DisciplinasInfos({user}){

    const [ disciplinas, setDisciplinas ] = useState([]);
    const [ carregando, setCarregando ] = useState(true);

    useEffect(
        () => {
            api.get(`/disciplinas/aluno/${user.id}`).then(
                response => {
                    setDisciplinas(response.data);
                    setCarregando(false);
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
            {carregando ? <h1>Carregando...</h1> : <Periodos periodos={disciplinas} />}
        </>
    )

}


export default function Disciplinas() {

    const { user, loading } = useContext(AuthContext);
    const [ carregando, setCarregando ] = useState(true);

    useEffect(
        () => {
            if (!loading) {
                setCarregando(false);
            } 
        }, [loading]
    );

    return (
        <>
            <Head><title>Disciplinas</title></Head>
            <Header />
            { carregando ? <h1>Carregando...</h1> : <DisciplinasInfos user={user} /> }
            <Footer />
        </>
    )    
}