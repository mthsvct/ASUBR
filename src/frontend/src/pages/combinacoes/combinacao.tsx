import { TabelaHorarioMult } from '@/components/tabelaHorariosMult';
import styles from './Combinacoes.module.scss';
import { OfertaOf } from '@/components/oferta';


function Horarios({combinacao}) {
    return (
        <div className={styles.horarios}>
            <h1>Horários</h1>
            <TabelaHorarioMult selecoes={combinacao.selecoes} />
        </div>
    )
}


function Lista({combinacao}) {
    return (
        <div className={styles.lista}>
            {
                combinacao.selecoes.map(
                    (selecao, index) => {
                        return (
                            <OfertaOf 
                                key={index} 
                                oferta={selecao.oferta} 
                                cor={selecao.cor} 
                                />
                        )
                    }
                )
            }
        </div>
    )
}


function Selecionadas({combinacao}) {
    return (
        <div className={styles.selecionadas}>
            <h1>Ofertas Selecionadas</h1>
            <Lista combinacao={combinacao} />
        </div>
    )
}



function Combinacao({combinacao, user, index}){
    return (
        <details className={styles.combinacao}>
            <summary>Combinação {index} {
                combinacao.manual ? "- *Manual" : ""
            } </summary>
            
            <div className={styles.infos}>
                <Horarios combinacao={combinacao} />
                <Selecionadas combinacao={combinacao} />
            </div>

        </details>

    )
}


function ListCombs({combinacoes, user, inicio}){
    return (
        <>
            {
                combinacoes.map(
                    (combinacao, index) => {
                        inicio = inicio + 1;
                        return ( 
                            <Combinacao 
                                key={index}
                                combinacao={combinacao} 
                                user={user} 
                                index={inicio} 
                                /> 
                        )
                    }
                )
            }
        </>
    )
}




export function CombinacoesLists({combinacoes, user}){
    
    return (
        <div className={styles.listagem}>
            <ListCombs 
                combinacoes={combinacoes.manuais} 
                user={user} 
                inicio={0}
                />
                
            <ListCombs 
                combinacoes={combinacoes.automaticas} 
                user={user} 
                inicio={combinacoes.manuais.length}
                />
        </div>
    )
}


