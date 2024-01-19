import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { DisciplinaProps } from "../../../interfaces/disciplina";
import { api } from "@/services/apiClient";
import Head from "next/head"
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from './Disciplina.module.scss';
import { Infos } from "./infos";
import { Pre } from "./pre";
import { Prox } from "./prox";
import { AuthContext } from "@/contexts/AuthContext";
import { OfertasDisc } from "./ofertasDisc";


function DisciplinaInfos({ id, user }) {
    
    const [ disciplina, setDisciplina ] = useState<any>(null);
    const [ carregando, setCarregando ] = useState(true);

    useEffect(
        () => {
            api.get(`/disciplina/${id}/aluno/${user.id}`).then(
                response => {
                    setDisciplina(response.data);
                    setCarregando(false);
                    console.log(response.data);
                }
            ).catch(
                error => {
                    console.log(error);
                    toast.error("Erro ao carregar disciplina");
                }
            )
        }, [id]
    );

    if (carregando || disciplina == null) {
        return <h1>Carregando...</h1>
    } else {
        return (
            <div className={styles.disciplina}>
                <div className={styles.conteudo}>
                    <Infos 
                        disciplina={disciplina} 
                        pagou={disciplina.pagou} 
                        setDisciplina={setDisciplina}
                        user={user}
                        />
                    <Pre disciplina={disciplina} />
                    <Prox disciplina={disciplina} />
                    <OfertasDisc disciplina={disciplina} />
                </div>
            </div>
        )
    }

}

export default function Disciplina() {

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
            <Head><title>Disciplina</title></Head>
            <Header />
            {
                carregando ? 
                    <h1>Carregando</h1> : 
                    <DisciplinaInfos id={id} user={user} />
            }
            <Footer />
        </>
    )
}