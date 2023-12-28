import { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';
import { FaSpinner } from 'react-icons/fa'
import global from '@/styles/Home.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean,
    linkagem?: string,
    children: ReactNode, // O QUE TEM DENTRO DO COMPONENTE POR EX: <Button>Nome do Butão</Button> o children é o "Nome do Butão"
}

export function Button2({loading, linkagem,  children, ...rest}: ButtonProps){
    
    return (
        <button 
            className={`${styles.button2} ${global.claro} ${global.trans} ${global.toEscuro}`}
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