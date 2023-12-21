import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import { Footer } from "@/components/footer";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";


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
    return disciplinas.map(
        (disciplina, index) => {
            return Disciplina({disciplina, index});
        }
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
    })


    if (loading) {
        return (
            <>  
                <Head><title>Disciplinas</title></Head>
                <h1>Carregando...</h1>
                <Footer />
            </>
        )
    } else {
        return (
            <>  
                <Head><title>Disciplinas</title></Head>
                <div>
                    <Listagem disciplinas={disciplinas} />
                </div>
                <Footer />
            </>
        )
    }


    
}