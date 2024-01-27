import { OfertaOf } from '@/components/oferta';
import styles from './Ofertas.module.scss'
import { useEffect, useState } from 'react';


function PeriodoOf({ofertas, periodo, disponiveis}:{ofertas: any, periodo: number, disponiveis: boolean}) {

    if (disponiveis) {
        ofertas = ofertas.filter(
            (oferta: any) => {
                return oferta.disponivel
            }
        )
    }

    // if(ofertas.length === 0) {
    //     return <h2>Não há ofertas disponíveis neste periodo.</h2>
    // }

    return (
        <div className={styles.periodo}>
            <div className={styles.tituloPer}>
                <h2>{periodo}º periodo</h2>
            </div>

            {
                ofertas.length === 0 ? (
                    <h2>Não há ofertas disponíveis neste periodo.</h2>
                ) : (
                    <div className={styles.ofertasPer}>
                        {
                            ofertas.map(
                                (oferta: any, index: number) => {
                                    return <OfertaOf key={index} oferta={oferta} />
                                }
                            )
                        }
                    </div>
                )
            }

            {/* <div className={styles.ofertasPer}>
                {
                    ofertas.map(
                        (oferta, index) => {
                            return <OfertaOf key={index} oferta={oferta} />
                        }
                    )
                }
            </div> */}
        </div>
    )
}

export function PeriodosOfs(
    {
        selecionado, ofertas, disponiveis
    }:{
        selecionado: number, ofertas: any, disponiveis: boolean
    }){
    
    return (
        <div className={styles.periodos}>
            {
                ofertas.map(
                    (oferta, index) => {
                        if ( 
                            selecionado === -1 || 
                            index+1 === selecionado
                        ) {
                            return (
                                <PeriodoOf 
                                    key={index} 
                                    ofertas={oferta} 
                                    periodo={index+1} 
                                    disponiveis={disponiveis}
                                    />
                            )
                        }
                    }
                )
            }
        </div>
    )
}