import styles from './Oferta.module.scss';

function HorarioOf({horario}:{horario: any}) {
    return (
        <div className={styles.horario}>
            <p>{horario.diaStr}</p>
            <h2>{horario.hora}:00</h2>
        </div>
    )
}

function HorariosOf({horarios}:{horarios: any}) {
    return (
        <div className={styles.horarios}>
            {
                horarios.length === 1 ? (
                    <HorarioOf horario={horarios[0]} />
                ) : horarios.length === 2 ? (
                    <>
                        <HorarioOf horario={horarios[0]} />
                        <HorarioOf horario={horarios[1]} />
                    </>
                ) : (
                    <>
                        <HorarioOf horario={horarios[0]} />
                        <div className={styles.horario}>
                            <h2>+</h2>
                        </div>
                    </>
                )
            }
        </div>
    )
}



export function OfertaOf({oferta}:{oferta: any}) {
    return (
        <div className={styles.oferta}>
            <a href={`/oferta/${oferta.id}`} className={styles.linkagem}>

                <div className={styles.name}>
                    <p>{oferta.disciplina.name}</p>
                </div>

                <div className={styles.professor}>
                    <p>{oferta.professor}</p>
                </div>

                <HorariosOf horarios={oferta.horarios} />

                <div className={styles.turma}>
                    <p>Turma {oferta.turma}</p>
                </div>
                
            </a>
        </div>
    )
}