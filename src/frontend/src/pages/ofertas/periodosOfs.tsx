import { OfertaOf } from '@/components/oferta';
import styles from './Ofertas.module.scss'
import { useEffect, useState } from 'react';


function PeriodoOf({ofertas, periodo}:{ofertas: any, periodo: number}) {
    return (
        <div className={styles.periodo}>
            <div className={styles.tituloPer}>
                <h2>{periodo}º periodo</h2>
            </div>
            <div className={styles.ofertasPer}>
                {
                    ofertas.map(
                        (oferta, index) => {
                            return <OfertaOf key={index} oferta={oferta} />
                        }
                    )
                }
            </div>
        </div>
    )
}

export function PeriodosOfs(
    {selecionado, ofertas
    }:{selecionado: number, ofertas: any,
    }){
    
    return (
        <div className={styles.periodos}>
            {
                ofertas.map(
                    (oferta, index) => {
                        if ( selecionado === -1 || index+1 === selecionado ) {
                            // return <OfertaOf key={index} oferta={oferta} />
                            return <PeriodoOf key={index} ofertas={oferta} periodo={index+1} />
                        }
                    }
                )
            }
        </div>
    )
}