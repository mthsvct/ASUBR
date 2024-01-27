import { OfertaCompleta } from "@/interfaces/oferta";
import styles from './TabelaHorario.module.scss';

export function TabelaHorario(
    {oferta}:{oferta: OfertaCompleta}
) {
    let i = 0;
    const horarios = [8, 10, 12, 14, 16, 18, 20, 22]
    // const matriz = [
    //     [null, "8h", "10h", "12h", "14h", "16h", "18h", "20h", "22h"],
    //     ['Segunda', null, null, null, null, null, null, null, null],
    //     ['Terça', null, null, null, null, null, null, null, null],
    //     ['Quarta', null, null, null, null, null, null, null, null],
    //     ['Quinta', null, null, null, null, null, null, null, null],
    //     ['Sexta', null, null, null, null, null, null, null, null],
    //     ['Sábado', null, null, null, null, null, null, null, null],
    // ]

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

    oferta.horarios.forEach(horario => {
        const dia = horario.dia - 1;
        const hora = horarios.indexOf(horario.hora);
        matriz[hora+1][dia] = 'true';
    })

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
                    {matriz.map((linha, index) => {
                        if (index === 0) return;
                        return (
                            <tr key={index}>
                                {linha.map((item, index) => {
                                    if (index === 0) return <th key={index}>{item}</th>
                                    if (item === null) return <td key={index}></td>
                                    return (
                                        <td key={index} className={styles.temAula}>
                                            <p>Aula</p>
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