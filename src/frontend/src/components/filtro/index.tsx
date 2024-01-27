
import styles from './Filtro.module.scss'

export function FiltroPeriodos(
    { qnt, selecionado, setSelecionado}:
    { qnt: number, selecionado: number, setSelecionado: Function }
    ){

    let blocos = []
    
    blocos.push(
        <div 
            key={-1} 
            onClick={() => setSelecionado(-1)}
            className={`${styles.todos} ${selecionado === -1 ? styles.selecionado : ''}`}
            >
            <h5>Todos</h5>
        </div>
    )

    for (let i = 0; i < qnt; i++) {
        blocos.push(
            <div 
                key={i} 
                onClick={
                    () => setSelecionado(i+1)
                }
                className={selecionado == i+1? styles.selecionado : ''}
            >
                <h5>{i+1}</h5>
            </div>
        );
    }
    
    return (<div className={styles.filtroPeriodos}>{blocos}</div>)
}