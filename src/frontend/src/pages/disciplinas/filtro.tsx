import { Input } from '@/components/input';
import styles from './Disciplinas.module.scss'
import { Button } from '@/components/button';

function marca({e, filtros, setFiltros, valor}:{e: any, filtros: any, setFiltros: any, valor: any}) {
    if(e.target.checked) {
        setFiltros({
            ...filtros,
            horas: [...filtros.horas, valor]
        })
    } else {
        // Remover o 90h do array
        const index = filtros.horas.indexOf(valor);
        if (index > -1) {
            let copia = [...filtros.horas];
            copia.splice(index, 1);
            setFiltros({
                ...filtros,
                horas: copia
            })
        }
    }
}



export function Filtro({filtros, setFiltros}:{filtros: any, setFiltros: any}) {

    return (
        <div className={styles.menuFiltro} style={{display:'none'}}>
            <h2>Filtros</h2>

            <form action="">
                <div className={styles.inputsFora}>
                    <Input 
                        type="checkbox" 
                        name="opcionais" 
                        id="opcionais"
                        onChange={
                            (e) => {
                                setFiltros({
                                    ...filtros,
                                    opcionais: e.target.checked
                                })
                            }
                        }
                    />
                    <label htmlFor="opcionais"><p>Somente Opcionais</p></label>
                </div>

                <div className={styles.inputsFora}>
                    <Input 
                        type="checkbox" 
                        name="semPre" 
                        id="semPre" 
                        onChange={
                            (e) => {
                                setFiltros({
                                    ...filtros,
                                    semPre: e.target.checked
                                })
                            }
                        }
                    />
                    <label htmlFor="semPre"><p>Somente disciplinas que não possuem pré-requisitos</p></label>
                </div>

                <div className={styles.inputsFora}>
                    <Input 
                        type="checkbox" 
                        name="naoPagos" 
                        id="naoPagos" 
                        onChange={
                            (e) => {
                                setFiltros({
                                    ...filtros,
                                    naoPagos: e.target.checked
                                })
                            }
                        }
                    />
                    <label htmlFor="naoPagos"><p>Somente os NÃO pagos</p></label>
                </div>

                <div className={styles.inputsFora}>
                    <Input 
                        type="checkbox" 
                        name="pagos" 
                        id="pagos" 
                        onChange={
                            (e) => {
                                setFiltros({
                                    ...filtros,
                                    pagos: e.target.checked
                                })
                            }
                        }
                    />
                    <label htmlFor="pagos"><p>Somente os pagos</p></label>
                </div>

                <div className={styles.horas}>

                    <p>Somente com a quantidade horas:</p>
                    <div className={styles.todos}>
                        <div className={styles.coluna}>
                            <div className={styles.horasInput}>
                                <Input 
                                    type="checkbox" 
                                    name="h15" 
                                    id="h15" 
                                    onChange={(e) => marca({e, filtros, setFiltros, valor: 15})}
                                />
                                <label htmlFor="h15"><p>15h</p></label>
                            </div>

                            <div className={styles.horasInput}>
                                <Input 
                                    type="checkbox" 
                                    name="h30" 
                                    id="h30" 
                                    onChange={(e) => marca({e, filtros, setFiltros, valor: 30})}
                                />
                                <label htmlFor="h30"><p>30h</p></label>
                            </div>
                        </div>

                        <div className={styles.coluna}>
                            <div className={styles.horasInput}>
                                <Input 
                                    type="checkbox" 
                                    name="h60" 
                                    id="h60"
                                    onChange={(e) => marca({e, filtros, setFiltros, valor: 60})}
                                />
                                <label htmlFor="h60"><p>60h</p></label>
                            </div>
                            <div className={styles.horasInput}>
                                <Input 
                                    type="checkbox" 
                                    name="h90" 
                                    id="h90" 
                                    onChange={(e) => marca({e, filtros, setFiltros, valor: 90})}
                                />
                                <label htmlFor="h90"><p>90h</p></label>
                            </div>
                        </div>
                    </div>

                </div>


                <div className={styles.botoes}>
                    <Button>Resetar</Button>
                    {/* <Button type="submit">Aplicar</Button> */}
                </div>

            </form>
        </div>
    )
    
}