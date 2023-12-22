import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { DisciplinaProps } from "@/pages/interfaces/disciplina";
import { api } from "@/services/apiClient";
import Head from "next/head"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";




function DisciplinaInfos({id}) {
    const [disciplina, setDisciplina] = useState<DisciplinaProps | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(
        () => {
            api.get(`/disciplina/${id}`).then(
                response => {
                    setDisciplina(response.data);
                    setLoading(false);
                }
            ).catch(
                error => {
                    console.log(error);
                    toast.error("Erro ao carregar disciplina");
                }
            )
        }, [id]
    );

    if (loading) {
        return <h1>Carregando...</h1>
    } else {
        return (
            <div>
                <h1>{disciplina.name}</h1>
                <p>{disciplina.codigo}</p>
                <p>{disciplina.horas}h</p>
                <p>{disciplina.id}</p>
                {/* <p>{disciplina.pre}</p> */}
            </div>
        )
    }

}

export default function Disciplina() {

    const router = useRouter();
    const { id } = router.query;

    return (
        <>
            <Head><title>Disciplina</title></Head>
            <Header />
            {id == undefined ? <h1>Carregando</h1> : <DisciplinaInfos id={id} />}
            <Footer />
        </>
    )
}