import { Button } from "@/components/button";
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Input } from "@/components/input";
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient";
import Head from "next/head"
import { useContext, useEffect, useState } from "react";
import styles from './Check.module.scss';
import { FiltroPeriodos } from "@/components/filtro";
import { FiExternalLink } from "react-icons/fi";

function DisciplinaCheck(
    { 
        indice, 
        disciplina, 
        user, 
        setPeriodos, 
        periodos,
        qntPagas,
        setQntPagas 
    }) 
{
    
    const [ pagou, setPagou ] = useState(disciplina.pagou);
    
    return (
        <div className={styles.disciplina}>
            <Input 
                id={`DISC-${disciplina.id}`} 
                type="checkbox" 
                name={disciplina.name} 
                checked={pagou}
                onChange={
                    (event) => {
                        disciplina.pagou = event.target.checked;
                        setPagou(event.target.checked);
                        setPeriodos(periodos);
                        console.log(event.target.checked);

                        


                        if(event.target.checked) {
                            setQntPagas(qntPagas+1);
                        } else {
                            setQntPagas(qntPagas-1);
                        }
                    }
                }
            />
            <label htmlFor={`DISC-${disciplina.id}`}>
                <p>
                    {disciplina.name}
                </p>
                <a href={`/disciplina/${disciplina.id}`} rel="noreferrer">
                    <FiExternalLink />
                </a>
            </label>
        </div>
    )
}



function Periodo({ indice, periodo, user, setPeriodos, periodos }) {

    const [ qntPagas, setQntPagas ] = useState(
        periodo.filter(
            (disciplina) => disciplina.pagou
        ).length
    );

    return (
        <div className={styles.periodo}>
            <div className={styles.perTitulo}>
                <h3>{indice}º Periodo</h3>
                {/* <h2>{qntPagas}</h2> */}
                <Button
                    onClick={
                        (event) => {
                            event.preventDefault();
                            const inputs = document.querySelectorAll(`#D-${indice} input`) as NodeListOf<HTMLInputElement>;
                            inputs.forEach(
                                (input) => {
                                    input.checked = true;
                                }
                            )
                        }
                    }
                >
                    {
                        qntPagas == periodo.length ? "Desmarcar Todas" : "Marcar Todas"
                    }
                </Button>
            </div>
            <div className={styles.disciplinas} id={`D-${indice}`}>
                {
                    periodo.map(
                        (disciplina, index) => (
                            <DisciplinaCheck 
                                key={index} 
                                indice={index} 
                                disciplina={disciplina} 
                                user={user}
                                setPeriodos={setPeriodos}
                                periodos={periodos}
                                qntPagas={qntPagas}
                                setQntPagas={setQntPagas}
                            /> 
                        )
                    )
                }
            </div> 
        </div>
    )
}


function Periodos({ periodos, user, setPeriodos }) {
    const [ selecionado, setSelecionado ] = useState(-1);
    
    return (
        <form action="" className={styles.formulario}>
            <div className={styles.titulo}>
                <h2>Marque as disciplinas que você já pagou:</h2>
                <FiltroPeriodos
                    qnt={periodos.length}
                    selecionado={selecionado} 
                    setSelecionado={setSelecionado} 
                />
            </div>
            
            <div className={styles.periodos}>
                {
                    periodos.map(
                        (periodo, index) => {
                            if(selecionado == -1 || selecionado == index+1) {
                                return (
                                    <Periodo 
                                        key={index} 
                                        indice={index+1} 
                                        periodo={periodo} 
                                        user={user}
                                        setPeriodos={setPeriodos}
                                        periodos={periodos}
                                    />
                                )
                            }
                        } 
                    )
                }
            </div>

            <div><Button type="submit">Salvar</Button></div>
        </form>
    )

}



function Checagem({ user }) {

    const [ carregando, setCarregando ] = useState(true);
    const [ periodos, setPeriodos ] = useState<any>(null);

    useEffect(
        () => {
            api.get(`/disciplinas/ultraresumidas/aluno/${user.id}`).then(
                response => {
                    setPeriodos(response.data);
                    setCarregando(false);
                }
            )
        }, []
    )

    return carregando? <h1>Carregando...</h1> : <Periodos periodos={periodos} user={user} setPeriodos={setPeriodos} />
}


export default function Check() {

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
            <Head><title>Check</title></Head>
            <Header />
            <div className={styles.check}>
            {
                carregando ? (
                    <h1>Carregando...</h1>
                    ) : (
                        <Checagem user={user} />
                    )
            }
            </div>
            <Footer />
        </>
    )
}