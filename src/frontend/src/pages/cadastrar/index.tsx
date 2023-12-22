import { Logo } from "@/components/logo";
import styles from '../login/Login.module.scss';
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import Head from "next/head";
import { Footer } from "@/components/footer";
import { canSSRGuest } from "@/utils/canSSRGuest";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useState } from "react";


function Formulario({user, setUser}) {
    return (
        <form>
            <div className={styles.inputs}>
                <div style={{marginTop: '0px'}}>
                    <Input 
                        type="text" 
                        placeholder="Nome" 
                        autoComplete="off" 
                        value={user.name}
                        onChange={(e) => setUser({...user, name: e.target.value})}
                    />
                    
                    <Input 
                        type="email" 
                        placeholder="E-mail" 
                        autoComplete="off" 
                    />
                </div>

                <div style={{marginTop: '15px'}}>
                    <Input 
                        type="password" 
                        placeholder="Password" 
                    />

                    <Input 
                        type="password" 
                        placeholder="Confirmar Password"
                    />
                </div>

                <div style={{marginTop: '15px', marginBottom: '10px'}}>
                    <Input type="number" placeholder="IRA" step={0.01} min={0} max={10} />
                    <Input type="text" placeholder="Matricula" autoComplete="off" />
                </div>
            </div>

            <div  className={styles.botoes}>
                <Button type="submit">Cadastrar</Button>
                <Button linkagem='/login' >Login</Button>
            </div>
        </form>
    )
}


export default function Cadastrar() {

    const { signUp } = useContext(AuthContext)
    // const [name, setName] = useState('')
    // const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');
    // const [loading, setLoading] = useState(false);
    // const [matricula, setMatricula] = useState('')
    // const [ira, setIra] = useState(0)

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        matricula: '',
        ira: 0
    })


    return (
        <>
            <Head><title>Cadastrar</title></Head>
            <div className={styles.login}>
                <div className={styles.formulario}>
                    <Logo />
                    <Formulario user={user} setUser={setUser} />
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