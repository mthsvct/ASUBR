import styles from './Oferta.module.scss';
import { OfertaCompleta } from '@/interfaces/oferta';
import { AlunoProps } from '@/interfaces/aluno';
import { Button2 } from '@/components/button/button2';
import { CiHeart } from 'react-icons/ci';
import { VscLinkExternal } from "react-icons/vsc";
import { TabelaHorario } from '@/components/tabelaHorario';
import { api } from '@/services/apiClient';
import { toast } from 'react-toastify';
import { FaHeart } from "react-icons/fa";


function Informacoes(
    {oferta, setOferta, user}:
    {oferta:OfertaCompleta, setOferta:Function, user:AlunoProps}
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
    {oferta:OfertaCompleta, setOferta:Function, user:AlunoProps}
) {

    async function interessar() {
        await api.post(
            `/interesse`, 
            {alunoId: user.id, ofertaId: oferta.id}
        ).then(
            response => {
                if (response.data.status == 200) {
                    console.log('Interesse registrado');
                    console.log(response.data)
                    setOferta(
                        {
                            ...oferta, 
                            temInteresse: true,
                            qntInteressados: oferta.qntInteressados + 1,
                            iraMin: response.data.iraMin
                        }
                    )
                } else {
                    toast.error(response.data.message)
                }
            }
        ).catch(
            error => {
                console.log(error)
                toast.error("Erro ao registrar interesse")
            }
        )
    }


    async function desinteressar() {
        await api.delete(
            `/interesse/${user.id}/${oferta.id}`
        ).then(
            (response) => {
                if (response.data.status == 200) {
                    console.log('Interesse registrado');
                    console.log(response.data)
                    setOferta(
                        {
                            ...oferta, 
                            temInteresse: false,
                            qntInteressados: response.data.qntNova,
                            iraMin: response.data.iraMin
                        }
                    )
                } else {
                    toast.error(response.data.message)
                }
            }
        ).catch(
            error => {
                console.log(error);
                toast.error("Erro ao remover interesse")
            }
        )

        const div = document.getElementById('botaoDiv') as HTMLDivElement;
        div.classList.remove(styles.interessado)
    }

    async function gestaoInteresse() {
        if (oferta.temInteresse) {
            await desinteressar()
        } else {
            await interessar()
        }
    }

    // console.log(oferta);

    return (
        <div className={styles.botoesOf}>
            {
                oferta.podePagar ? (
                    <div 
                        id='botaoDiv' 
                        className={
                            `${styles.botaoDiv} ${oferta.temInteresse ? styles.interessado : ''}`
                        }
                        
                        >
                        <Button2
                            onClick={gestaoInteresse}
                            >
                            {
                                oferta.temInteresse ? (
                                    <>
                                        <FaHeart />
                                        <p>Remover Interesse</p>
                                    </>
                                ) : (
                                    <>
                                        <CiHeart />
                                        <p>Registrar Interesse</p>
                                    </>
                                )   
                            }
                        </Button2>
                    </div>
                    
                ) : <></>
            }

            <div className={styles.botaoDiv}>
                <Button2 linkagem={`/disciplina/${oferta.disciplina.id}`}>
                    <VscLinkExternal />
                    <p>Ir para a disciplina</p>
                </Button2>
            </div>
        </div>
    )
}

function Infos(
    {oferta, setOferta, user}:{oferta:OfertaCompleta, setOferta:Function, user:AlunoProps}
) {
    return(
        <div className={styles.infos}>
            <Informacoes oferta={oferta} setOferta={setOferta} user={user} />
            <BotoesOf oferta={oferta} setOferta={setOferta} user={user} />
        </div> 
    )
    
}


function TabelaHorOferta(
    {oferta, setOferta, user}:
    {oferta:OfertaCompleta, setOferta:Function, user:AlunoProps}
) {
    return (
        <div className={styles.tabelaHorarioOf}>
            <div className={styles.tituloTabela}>
                <h1>Horários</h1>
                <p>Esses são os horários das aulas desta oferta:</p>
            </div>

            <div className={styles.tabela}>
                <div className={styles.centrou}>
                    <TabelaHorario oferta={oferta} />
                </div>
            </div>
        </div>
    )
}



export function OfertaMain({oferta, setOferta, user}:{oferta:OfertaCompleta, setOferta:Function, user:AlunoProps}){
    
    return (
        <div className={styles.oferta}>  
            <Infos oferta={oferta} setOferta={setOferta} user={user} />
            <TabelaHorOferta oferta={oferta} setOferta={setOferta} user={user} />
        </div>
    )
}