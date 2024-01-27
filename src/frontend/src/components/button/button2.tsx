import { ReactNode, ButtonHTMLAttributes, useState, useEffect } from 'react';
import styles from './Button.module.scss';
import { FaSpinner } from 'react-icons/fa'
import global from '@/styles/Home.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean,
    linkagem?: string,
    cor?: number;
    children: ReactNode, // O QUE TEM DENTRO DO COMPONENTE POR EX: <Button>Nome do Butão</Button> o children é o "Nome do Butão"
}

export function Button2(
    {
        loading, 
        linkagem, 
        cor, 
        children,
        ...rest
    }: ButtonProps
) { 

    const [classe, setClasse] = useState(
        `${styles.button2} ${global.trans} ${global.toEscuro}`
    );

    useEffect(
        () => {
            if(cor === undefined) return;
            setClasse(`${classe} ${escolheCor(cor)}`)
        }, [cor]
    );

    function escolheCor(cor) {
        // console.log(cor, cor === 'vermelho');
        if( cor === 0 ) return '';
        if( cor === 1 ) return styles.vermelhado;
    }

    return (
        <button 
            className={
                // `${styles.button2} ${global.trans} ${global.toEscuro}`
                classe
            }
            disabled={loading}
            {...rest}
            >
            { loading ? 
                (<FaSpinner color='#000' size={50} />) 
                :
                    linkagem ? (<a href={linkagem} className={styles.buttonText}>{children}</a>)
                    :
                    (<a className={styles.buttonText}>{children}</a>)
            }            
        </button>
    )
}