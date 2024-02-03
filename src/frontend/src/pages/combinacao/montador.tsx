import { use, useEffect, useState } from 'react';
import styles from './Combinacao.module.scss';
import { OfertaOf } from '@/components/oferta';
import { TabelaHorarioMult } from '@/components/tabelaHorariosMult';




function buscaOferta(id, ofertas) {
    let i;
    for(i=0; i<ofertas.length; i++) {
        if(ofertas[i].id == id) {
            return ofertas[i];
        }
    }
    return null;
}

function estaSelecionada(id, selecionadas) {
    let i;
    for(i=1; i<=5; i++) {
        if(selecionadas[i] != null && selecionadas[i].id == id) {
            return true;
        }
    }
    return false;
}

function transformaSelecoes(selecionadas, cores) {
    let selecoes = [];
    let i;
    for(i=1; i<=5; i++) {
        if( selecionadas[i] != null ) {
            selecoes.push(
                {
                    oferta: selecionadas[i],
                    cor: cores[i-1]
                }
            );
        }
    }
    return selecoes;
}


function tamanho(selecionadas) {
    let i;
    let n = 0;
    for(i=1; i<=5; i++) {
        if(selecionadas[i] != null) {
            n++;
        }
    }
    return n;
}


function choca(oferta1, oferta2) {
    // self.dia == horario.dia and self.hora == horario.hora
    for(let i=0; i<oferta1.horarios.length; i++) {
        for(let j=0; j<oferta2.horarios.length; j++) {
            if(oferta1.horarios[i].dia == oferta2.horarios[j].dia && oferta1.horarios[i].hora == oferta2.horarios[j].hora) {
                return true;
            }
        }
    }
    return false;
}


function chocaAlgum(selecionadas, oferta) {
    let i;
    let tam = tamanho(selecionadas);

    for(i=0; i<=tam; i++) { //  Estou percorrendo o selecionadas
        if(selecionadas[i] != null) {
            if(choca(selecionadas[i], oferta)) {
                return true;
            } 
        }
    }
    return false;
}





function Selecionador({ofertas, selecionadas, setSelecionadas, i, cor}) {

    const [ selecionada, setSelecionada ] = useState(null);

    useEffect(() => {
        setSelecionadas({...selecionadas, [i]: selecionada});
        
    }, [selecionada])

    return (
        <div className={styles.selecionador}>
            <select 
                name={`selecionador_${i}`} 
                onChange={
                    e => setSelecionada(buscaOferta(e.target.value, ofertas))
                }
                style={
                    selecionada != null ? {backgroundColor: cor} : {}
                }
            >
                <option value={null}>Selecione uma oferta {i}:</option>
                {
                    ofertas.map(
                        (oferta, index) => {
                            if(estaSelecionada(oferta.id, selecionadas)) {
                                return (
                                    <option 
                                        key={index} 
                                        value={oferta.id} 
                                        disabled
                                    >
                                        {oferta.disciplina.name} - Turma {oferta.turma}
                                    </option>
                                )
                            } else if(chocaAlgum(selecionadas, oferta)) {
                                return (
                                    <option 
                                        key={index} 
                                        value={oferta.id} 
                                        disabled
                                    >
                                        (Choque de Horário) - {oferta.disciplina.name} - Turma {oferta.turma}
                                    </option>
                                )
                            } else {
                                return (
                                    <option 
                                        key={index} 
                                        value={oferta.id} 
                                    >
                                        {oferta.disciplina.name} - Turma {oferta.turma}
                                    </option>
                                )
                            }
                            
                        }
                    )
                }
            </select>
            {/* { selecionada != null ? <OfertaOf oferta={selecionada} cor={cor} /> : <p>Nada!</p> } */}
        </div>
    )


}

export function Montador({ofertas, user, setOfertas, selecionadas, setSelecionadas}) {

    
    const [ carregando, setCarregando ] = useState(true);
    const [ selecoes, setSelecoes ] = useState([]);

    let i;
    const selecionadores = [];
    const cores = [
        '#FFDBA2',
        '#B7E1DE',
        '#FF9494',
        '#CBC2F7',
        '#D4FF8D'
    ]

    for(i=1; i<=5; i++) {
        selecionadores.push(
            <Selecionador 
                key={i} 
                ofertas={ofertas} 
                selecionadas={selecionadas} 
                setSelecionadas={setSelecionadas} 
                i={i} 
                cor={cores[i-1]}
            /> 
        )
    }


    useEffect(
        () => {
            setSelecoes(transformaSelecoes(selecionadas, cores))
        }, [selecionadas]
    )

    return (
        <form className={styles.montador}>
            <div className={styles.selecionadores}>
                {selecionadores}   
            </div>
            
            <div className={styles.tabela}>
                <TabelaHorarioMult selecoes={selecoes}/>
            </div>
        </form>
    )
}