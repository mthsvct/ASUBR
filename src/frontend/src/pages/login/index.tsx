import Head from 'next/head';
import styles from './Login.module.scss';
import { useContext, FormEvent, useState } from 'react'
import { Logo } from '@/components/logo';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import global from '@/app/page.module.scss';
import { Footer } from '@/components/footer';
import { canSSRGuest } from '@/utils/canSSRGuest';
import { AuthContext } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
    
    const { signIn } = useContext(AuthContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(event: FormEvent){
        event.preventDefault();
		console.log(email, password);
        if(email === '' || password === ''){
        	toast.error("Preencha os campos")
        	return;
        }
        setLoading(true);
        let data = {
			email,
        	password
        }
        await signIn(data)
        setLoading(false);
    }


    return (
        <>
            <Head><title>Login</title></Head>
            <div className={styles.login}>
                <div className={styles.formulario}>
                    <Logo />
                    <form onSubmit={handleLogin}>
                        <div className={styles.inputs}>
                            <Input 
								type="email" 
								placeholder="E-mail"
								value={email}
                        		onChange={ (e) => setEmail(e.target.value) }
							/>

                            <Input 
								type="password" 
								placeholder="Password" 
								value={password}
								onChange={ (e) => setPassword(e.target.value) }
							/>

                        </div>
                        
						<div  className={styles.botoes}>
                            <Button type="submit" loading={loading}>Login</Button>
                            <Button linkagem='/cadastrar' >Cadastrar</Button>
                        </div>
                    
					</form>
                </div>
            </div>
            <Footer />
        </>
    )
}

export const getServerSideProps = canSSRGuest(
    async (ctx) => {
        return {
            props: {}
        }
    }
);