import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import Head from "next/head"

import tabela from '../../../public/tabela.png'


import styles from './Sobre.module.scss'





function Contexto(){
    return (
        <div className={styles.paragrafo}>
            <div className={styles.imgContexto}>
                <div className={styles.texto}>
                    <h1>Contexto</h1>
                    <p>Para realizar as matrículas em cada semestre, os alunos dos curso de Sistemas de Informação da Universidade Federal do Piauí (UFPI) devem considerar diversos fatores para a escolha, o que pode tornar a etapa de seleção um processo complexo. </p>

                    <h1 style={{marginTop:"50px"}}>Problemática</h1>
                    <p>O aluno deve levar em conta a estrutura curricular do curso juntamente com o seu nível atual para realizar a seleção de ofertas de disciplinas para a matrícula do semestre, também deve ser considerado as matérias que foram e também as que não foram ofertadas no período em questão, além de considerar possíveis matérias atrasadas, horários das aulas e as matérias que possuem outras matérias como pré-requisitos. Apesar disso, a interface do sistema usado para as matrículas não apresenta uma facilidade em sua utilização, o que pode dificultar ainda mais o processo para o usuário. </p>

                </div>
                <img src="https://ufpi.br/arquivos_download/arquivos/PORTAL_DO_DISCENTE_9.png" alt="Imagem da tela de matriculas do SIGAA" />
            </div>
        </div>
    )
}


function ItemLista({titulo, descricao}){
    return (
        <li>
            {/* <h2>{titulo}</h2>
            <p>{descricao}</p> */}
            <p><b>{titulo}:</b>{descricao}</p>
        </li>
    )
}


function Proposta(){

    return (
        <div className={styles.paragrafo}>
            <h1>O que se propõe neste projeto</h1>
            <p>O aluno deve levar em conta a estrutura curricular do curso juntamente com o seu nível atual para realizar a seleção de ofertas de disciplinas para a matrícula do semestre, também deve ser considerado as matérias que foram e também as que não foram ofertadas no período em questão, além de considerar possíveis matérias atrasadas, horários das aulas e as matérias que possuem outras matérias como pré-requisitos. Apesar disso, a interface do sistema usado para as matrículas não apresenta uma facilidade em sua utilização, o que pode dificultar ainda mais o processo para o usuário.</p>
            <p>Considerando esse contexto, o recomendador de disciplinas acadêmicas propõe uma nova forma realizar uma análise dos fatores de seleção de ofertas de disciplinas do período gerando combinações possíveis ao usuário considerando os seguintes pontos:</p>

            <div className={styles.lista}>
                <img src={tabela.src} alt="Imagem da tabela de horários" />
                <ul>
                    <ItemLista
                        titulo="Ofertas de Disciplinas"
                        descricao="O sistema considerará todas as disciplinas que tiveram alguma oferta no período para realizar suas operações." />
                    
                    <ItemLista
                        titulo="Horários de Aulas"
                        descricao="A partir dos horários das ofertas o sistema pode criar combinações que não geram choques de horários, evitando que o usuário se confunda com os códigos de horários das ofertas." />

                    <ItemLista
                        titulo="Desempenho Acadêmico"
                        descricao="Considerando que o processo de deferimento de matrículas de alunos em uma disciplina é feita com base no índice de rendimento acadêmico (IRA) do aluno, o sistema deve considerar este índice para combinações de disciplinas que evitem que o aluno se matricular em disciplinas que possam resultar em indeferidas." />
                </ul>

                
            </div>
        </div> 
    )
}




function Conteudo(){
    return (
        <div className={styles.conteudo}>
            <div className={styles.sobre}>
                <Contexto />
                <Proposta />
            </div>
        </div>
    )
}




export default function Sobre() {
    return (
        <>
            <Head><title>Sobre</title></Head>
            <Header />
            <Conteudo />
            <Footer />
        </>
    )
}



