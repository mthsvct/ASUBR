import { Logo } from "@/components/logo";
import { metadata } from "../layout";
import styles from '../login/Login.module.scss';
import { Input } from "@/components/input";
import { Button } from "@/components/button";


export default function Cadastrar() {
    metadata.title = 'Cadastrar';



    return (
        <>
            <div className={styles.login}>

                <div className={styles.formulario}>
                    <Logo />
                    <form>
                        <div className={styles.inputs}>
                            <div style={{marginTop: '0px'}}>
                                <Input type="text" placeholder="Nome" autoComplete="off" />
                                <Input type="email" placeholder="E-mail" autoComplete="off" />
                            </div>

                            <div style={{marginTop: '15px'}}>
                                <Input type="password" placeholder="Password" />
                                <Input type="password" placeholder="Confirmar Password" />
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
                </div>

            </div>
        </>
    )
}