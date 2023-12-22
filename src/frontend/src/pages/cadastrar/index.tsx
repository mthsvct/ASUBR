import { Logo } from "@/components/logo";
import styles from '../login/Login.module.scss';
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import Head from "next/head";
import { Footer } from "@/components/footer";
import { canSSRGuest } from "@/utils/canSSRGuest";
import { AuthContext } from "@/contexts/AuthContext";
import { FormEvent, useContext, useState } from "react";
import { toast } from "react-toastify";


function Inputs({user, setUser}) {
    return (
        <>
            <div className={styles.inputs}>
                <div style={{marginTop: '0px'}}>
                    <label htmlFor="nome">Nome:</label>
                    <Input 
                        type="text" 
                        id="nome"
                        placeholder="Nome" 
                        autoComplete="off" 
                        value={user.name}
                        onChange={(e) => setUser({...user, name: e.target.value})}
                    /> 
                    
                    <label htmlFor="email">E-mail:</label>
                    <Input 
                        type="email" 
                        id="email"
                        placeholder="E-mail" 
                        autoComplete="off"
                        value={user.email}
                        onChange={(e) => setUser({...user, email: e.target.value})}
                    />
                </div>

                <div style={{marginTop: '25px'}}>
                    <label htmlFor="password">Senha:</label>
                    <Input 
                        type="password" 
                        id="password"
                        placeholder="Password" 
                        value={user.password}
                        onChange={(e) => setUser({...user, password: e.target.value})}
                    />

                    <label htmlFor="confirm">Confirme a senha:</label>
                    <Input 
                        type="password" 
                        id="confirm"
                        placeholder="Confirmar Password"
                        value={user.confirmPassword}
                        onChange={(e) => setUser({...user, confirmPassword: e.target.value})}
                    />
                </div>

                <div style={{marginTop: '25px', marginBottom: '10px'}}>
                    
                    <label htmlFor="ira">IRA:</label>
                    <Input 
                        type="number" 
                        id="ira"
                        placeholder="IRA" 
                        step={0.01} 
                        min={0}
                        max={10} 
                        value={user.ira}
                        onChange={(e) => setUser({...user, ira: e.target.value})}
                    />

                    <label htmlFor="nivel">Nível:</label>
                    <Input 
                        type="number" 
                        placeholder="Nível" 
                        id="nivel"
                        step={1} 
                        min={1}
                        value={user.nivel}
                        onChange={(e) => setUser({...user, nivel: e.target.value})}
                    />
                    
                    <label htmlFor="matricula">Matricula:</label>
                    <Input 
                        type="text" 
                        id="matricula"
                        placeholder="Matricula" 
                        autoComplete="off"
                        value={user.matricula}
                        onChange={(e) => setUser({...user, matricula: e.target.value})}
                    />
                </div>
            </div>
        </>
    )
}




export default function Cadastrar() {

    const { signUp } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        matricula: '',
        ira: 0,
        nivel: 1
    });

    async function handleSignUp(event: FormEvent){
        event.preventDefault();
    
        if(user.name === '' || user.email === '' || user.password === ''){
            toast.error("Preencha todos os campos")
            return;
        } else if(user.password !== user.confirmPassword){
            toast.error("As senhas não coincidem")
            return;
        }
    
        setLoading(true);

        let data = {
            name: user.name,
            email: user.email,
            password: user.password,
            matricula: user.matricula,
            ira: user.ira,
            nivel: user.nivel
        }

        await signUp(data);
        setLoading(false);
    }


    return (
        <>
            <Head><title>Cadastrar</title></Head>
            <div className={styles.login}>
                <div className={styles.formulario}>
                    <Logo />
                    <form onSubmit={handleSignUp}>
                        <Inputs user={user} setUser={setUser} />
                        <div  className={styles.botoes}>
                            <Button type="submit">Cadastrar</Button>
                            <Button linkagem='/login' >Login</Button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
    return {
        props: {}
    }
  }
);