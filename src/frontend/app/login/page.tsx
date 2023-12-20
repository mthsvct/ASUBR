import Head from 'next/head';
import styles from './Login.module.scss';
import { useContext, FormEvent, useState } from 'react'
import { metadata } from '../layout';
import { Logo } from '@/components/logo';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import global from '@/app/page.module.scss';

export default function Login() {
    
    metadata.title = 'Login';
    


    return (
        <>
            <div className={styles.login}>

                <div className={styles.formulario}>
                    <Logo />
                    <form>
                        <div className={styles.inputs}>
                            <Input type="email" placeholder="E-mail" />
                            <Input type="password" placeholder="Password" />
                        </div>

                        <div  className={styles.botoes}>
                            <Button type="submit">Login</Button>
                            <Button>Cadastrar</Button>
                        </div>
                    </form>
                </div>

            </div>
        </>
    )
}