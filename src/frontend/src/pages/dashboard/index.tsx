import { Button } from "@/components/button"
import { Footer } from "@/components/footer"
import { AuthContext } from "@/contexts/AuthContext"
import { canSSRAuth } from "@/utils/canSSRAuth"
import Head from "next/head"
import Link from "next/link"
import { useContext } from "react"

export default function Dashboard() {
	const { user, signOut } = useContext(AuthContext)
	return (
		<>
			<Head><title>Home</title></Head>
			<h1>Hello World!</h1>
			<Button linkagem="/disciplinas">Disciplinas</Button>
			<Link onClick={signOut} href="">Sair</Link>
			<p><i>Dashboard</i></p>
			<Footer />
		</>
	)
}

export const getServerSideProps = canSSRAuth(
	async (ctx) => {
		return {
			props: {}
		}
	}
)

