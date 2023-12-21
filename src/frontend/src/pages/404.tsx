// import Footer from "@/components/Footer"
// import { Header } from "@/components/Header"
import Head from "next/head"
import styles from '@/pages/login/Login.module.scss'
import { useRouter } from "next/router"
import { Button } from "@/components/button"
import { Footer } from "@/components/footer"

export default function NotFound() {

    // Pegar o link da página anterior pelo o histórico do navegador


    return (
        <>
        <Head>
            <title>Página não encontrada</title>
        </Head>
        {/* <Header /> */}
        <div className={styles.login}>
            <h1>404</h1>
            <h2>Page not found.</h2>
            <h3>:(</h3>
            <Button linkagem='/' style={{marginTop: '50px'}}>Voltar</Button>
        </div>
        <Footer />
        </>
    )
}