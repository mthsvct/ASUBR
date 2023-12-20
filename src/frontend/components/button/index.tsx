import { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';
import {FaSpinner} from 'react-icons/fa'
import global from '@/app/page.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean,
    linkagem?: string,
    children: ReactNode, // O QUE TEM DENTRO DO COMPONENTE POR EX: <Button>Nome do Butão</Button> o children é o "Nome do Butão"
}

export function Button({loading, linkagem,  children, ...rest}: ButtonProps){
    
    return (
        <button 
            className={`${styles.button} ${global.amarelo} ${global.trans} ${global.amareloToClaro}`}
            disabled={loading}
            {...rest}
            >
            { loading ? 
                (<FaSpinner color='#FFF' size={16} />) 
                :
                    linkagem ? (<a href={linkagem} className={styles.buttonText}>{children}</a>)
                    :
                    (<a className={styles.buttonText}>{children}</a>)
            }            
        </button>
    )
}