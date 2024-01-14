import { DisciplinaProps } from "@/interfaces/disciplina";
import styles from './Disciplina.module.scss';
import { Descricao } from "@/components/descricao";
import { Button2 } from "@/components/button/button2";
import { CiHeart } from "react-icons/ci";
import { CiCircleCheck } from "react-icons/ci";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { ehOpcional } from "@/utils/utilitarios";
import global from '@/styles/Home.module.scss';
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { useState } from "react";


function PodePagar({ pagou, podePagar }: { pagou: boolean, podePagar: boolean }) {
    if(pagou){
        return <p>Você já pagou esta disciplina. :D</p>
    } else if(podePagar) {
        return <p>Você pode pagar esta disciplina. :D</p>
    } else {
        return <p>Devido aos pré-requisitos, você ainda não pode pagar esta disciplina. :( </p>
    }
}


export function Infos(
    {
        disciplina,
        pagou,
        user
    }: {
        disciplina: DisciplinaProps,
        pagou: boolean,
        user: any
    }) {

    const [ auxPagou, setAuxPagou ] = useState(pagou);
    
    async function pagar() {
        if(!auxPagou) {
            // Não pagou!
            await api.post(
                '/matricular', 
                {
                    "alunoId": user.id,
                    "disciplinaId": disciplina.id
                }
            ).then(
                response => {
                    console.log(response);
                    setAuxPagou(true);
                    toast.success("Disciplina paga com sucesso!");
                }
            ).catch(
                error => {
                    console.log(error);
                    toast.error("Erro ao pagar disciplina");
                }
            )
        } else {
            // Já pagou!
            await api.delete(
                `/matricula/delete/${user.id}/${disciplina.id}`,
            ).then(
                response => {
                    console.log(response);
                    setAuxPagou(false);
                    toast.success("Disciplina removida com sucesso!");
                }
            ).catch(
                error => {
                    console.log(error);
                    toast.error("Erro ao remover disciplina");
                }
            )
        }
    }


    return (
        <div className={styles.infos}>
            <div className={styles.coluna1}>
                <div className={styles.name}><h1>{disciplina.name}</h1></div>
                <div className={styles.codigo}><p>{disciplina.codigo}</p></div>
                <div className={styles.opcional}><p>{ehOpcional(disciplina.opcional)}</p></div>
                <div className={styles.nivel}><p>{disciplina.nivel}º periodo</p></div>
                <div className={styles.horas}><p>{disciplina.horas}h</p></div>
                <div className={styles.podePagar}>
                    <PodePagar pagou={auxPagou} podePagar={disciplina.podePagar} />
                </div>
            </div>

            <div className={styles.coluna2}>

                <div className={styles.botoes}>

                    {
                        disciplina.podePagar ? (
                            <div className={`${styles.jaPagou} ${
                                auxPagou ? global.verde : ''
                            }`}>
                                
                                <Button2
                                    onClick={pagar}
                                >
                                    {
                                        auxPagou ? (
                                            <>
                                                <CiCircleCheck />
                                                <p>Paga!</p>
                                            </>
                                        ) : (
                                            <>
                                                <MdOutlineCheckBoxOutlineBlank />
                                                <p>Já pagou?</p>
                                            </>
                                        )
                                    }
                                </Button2>
                            </div>
                        ) : (
                            <></>
                        )
                    }

                    

                    {
                        auxPagou == false ? (
                            <div className={styles.interesses}>
                                <Button2>
                                    <CiHeart />
                                    <p>Registrar Interesse</p>
                                </Button2>
                            </div>
                        ) : (
                            <></>
                        )
                    }
                    
                    
                </div>

                <div className={styles.descricao}>
                    <Descricao texto={disciplina.descricao} />
                </div>
                
            </div>

        </div>
    )
}