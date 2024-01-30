import { use, useEffect, useState } from 'react';
import styles from './Combinacao.module.scss';
import { OfertaOf } from '@/components/oferta';
import { TabelaHorarioMult } from '@/components/tabelaHorariosMult';


function objetoVazio(n) {
    let i;
    const obj = {};
    for(i=1; i<=n; i++) {
        obj[i] = null;
    }
    return obj;
}


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

function vazio(selecionadas) {
    let i;
    for(i=1; i<=5; i++) {
        if(selecionadas[i] != null) {
            return false;
        }
    }
    return true;
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
                <option value={null}>Selecione uma oferta {i}</option>
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

export function Montador({ofertas, user, setOfertas}) {

    const [ selecionadas, setSelecionadas ] = useState(objetoVazio(5));
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