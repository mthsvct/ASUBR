import { Button } from "@/components/button"
import { Footer } from "@/components/footer"
import { canSSRAuth } from "@/utils/canSSRAuth"
import Head from "next/head"

export default function Dashboard() {
	return (
		<>
			<Head><title>Home</title></Head>
			<h1>Hello World!</h1>
			<Button linkagem="/disciplinas">Disciplinas</Button>
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

