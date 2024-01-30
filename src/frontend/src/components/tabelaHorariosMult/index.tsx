import { OfertaCompleta } from "@/interfaces/oferta";
import styles from './TabelaHorarioMult.module.scss';
import { GoLinkExternal } from "react-icons/go";

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
                    matriz[hora+1][dia] = `${selecao.oferta.disciplina.name};${selecao.cor};${selecao.oferta.id}`;
                }
            )
        }
    );

    // console.log(selecoes);

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
                                    let id = item.split(';')[2];

                                    return (
                                        <td 
                                            key={index} 
                                            className={styles.temAula}
                                            style={ {backgroundColor: cor} }
                                            title={`${disciplina}`} // Adicione esta linha
                                            >
                                            <a 
                                                href={`/oferta/${id}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >

                                                <p className={styles.conteudoP}>
                                                    {
                                                        disciplina.length > 16 ? 
                                                            `${disciplina.substring(0, 16)}...` : 
                                                            disciplina  
                                                    }
                                                </p>

                                                <p className={styles.inteiro}>
                                                    <GoLinkExternal />
                                                    <span>
                                                        {disciplina}
                                                    </span>
                                                </p>
                                            </a>
                                        </td>
                                    )


                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {
                selecoes.length == 0 ? <p>*Nenhuma seleção feita!</p> : <p></p>
            }
        </div>
    )

}