import styles from './Oferta.module.scss';
import { OfertaCompleta } from '@/interfaces/oferta';
import { Aluno } from '@/interfaces/aluno';
import { Button2 } from '@/components/button/button2';
import { CiHeart } from 'react-icons/ci';
import { VscLinkExternal } from "react-icons/vsc";


function Informacoes(
    {oferta, setOferta, user}:
    {oferta:OfertaCompleta, setOferta:Function, user:Aluno}
) {
    return (
        <div className={styles.informacoes}>
            <div className={styles.tituloOf}>
                <h1>{oferta.disciplina.name}</h1>
            </div>    

            <div className={styles.codigos}>
                <p>Turma {oferta.turma}</p>
                <p>({oferta.codHorario})</p>
                <p>{oferta.vagas} vagas</p>
            </div>

            <div className={styles.professor}>
                <p>Professor: <b>{oferta.professor}</b></p>
            </div>

            <div className={styles.interessados}>
                <p>Interessados: <b>{oferta.qntInteressados}</b> alunos. </p>
            </div>


            <div className={styles.ira}>
                <p>IRA mínimo: <b>{oferta.iraMin}</b></p>
            </div>
        </div>
    )
}

function BotoesOf(
    {oferta, setOferta, user}:
    {oferta:OfertaCompleta, setOferta:Function, user:Aluno}
) {


    return (
        <div className={styles.botoesOf}>

            {
                oferta.podePagar ? (
                    <Button2>
                        <CiHeart />
                        <p>Registrar Interesse</p>
                    </Button2>
                ) : <></>
            }

            

            <Button2 linkagem={`/disciplina/${oferta.disciplina.id}`}>
                <VscLinkExternal />
                <p>Ir para a disciplina</p>
            </Button2>
        </div>
    )
}

function Infos(
    {oferta, setOferta, user}:{oferta:OfertaCompleta, setOferta:Function, user:Aluno}
) {
    return(
        <div className={styles.infos}>
            <Informacoes oferta={oferta} setOferta={setOferta} user={user} />
            <BotoesOf oferta={oferta} setOferta={setOferta} user={user} />
        </div> 
    )
    
}



export function OfertaMain({oferta, setOferta, user}:{oferta:OfertaCompleta, setOferta:Function, user:Aluno}){
    
    return (
        <div className={styles.oferta}>  
            <Infos oferta={oferta} setOferta={setOferta} user={user} />
        </div>
    )
}