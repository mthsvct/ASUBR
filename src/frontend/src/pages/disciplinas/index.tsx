import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import { Footer } from "@/components/footer";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { Header } from "@/components/header";



function Disciplina({disciplina, index}){
    return (
        <div key={index}>
            <h1>{disciplina.name}</h1>
            <p>{disciplina.codigo}</p>
            <p>{disciplina.horas}h</p>
        </div>
    )
}

function Listagem({disciplinas}){
    return (
        <div>
            {
                disciplinas.map((disciplina, index) => {
                        return Disciplina({disciplina, index})
                    }
                )
            }
        </div>
    )
}

export default function Disciplinas() {

    const [disciplinas, setDisciplinas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/disciplinas/resumidas').then(
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
    }, [disciplinas.length] // toda vez que o tamanho do array de disciplinas mudar, ele vai executar o useEffect.
    )

    return (
        <>
            <Head><title>Disciplinas</title></Head>
            <Header />
            {loading ? <h1>Carregando...</h1> : <Listagem disciplinas={disciplinas} />}
            <Footer />
        </>
    )    
}