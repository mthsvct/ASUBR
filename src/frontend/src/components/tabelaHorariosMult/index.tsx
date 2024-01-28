import { OfertaCompleta } from "@/interfaces/oferta";
import styles from './TabelaHorarioMult.module.scss';

export function TabelaHorarioMult({selecoes}) {
    let i = 0;
    const horarios = [8, 10, 12, 14, 16, 18, 20, 22]
    
    const matriz = [
        [null, 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        ['8:00', null, null, null, null, null, null],
        ['10:00', null, null, null, null, null, null],
        ['12:00', null, null, null, null, null, null],
        ['14:00', null, null, null, null, null, null],
        ['16:00', null, null, null, null, null, null],
        ['18:00', null, null, null, null, null, null],
        ['20:00', null, null, null, null, null, null],
        ['22:00', null, null, null, null, null, null],
    ];

    selecoes.forEach(
        selecao => {
            selecao.oferta.horarios.forEach(
                horario => {
                    const dia = horario.dia - 1;
                    const hora = horarios.indexOf(horario.hora);
                    matriz[hora+1][dia] = `${selecao.oferta.disciplina.name};${selecao.cor}`;
                }
            )
        }
    );

    return (
        <div className={styles.tabela}>
            <table>
                <thead>
                    <tr>
                        {
                            matriz[0].map(
                                (item, index) => {
                                    return (
                                        <th key={index}>
                                            {item}
                                        </th>
                                    )
                                }
                            )
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                    matriz.map((linha, index) => {
                        if (index === 0) return;
                        return (
                            <tr key={index}>
                                {linha.map((item, index) => {
                                    if (index === 0) return <th key={index}>{item}</th>
                                    if (item === null) return <td key={index}></td>
                                    
                                    let disciplina = item.split(';')[0];
                                    let cor = item.split(';')[1];
                                    
                                    return (
                                        <td 
                                            key={index} 
                                            className={styles.temAula}
                                            style={{backgroundColor: cor}}
                                            >
                                            <p>{disciplina}</p>
                                        </td>
                                    )


                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )

}