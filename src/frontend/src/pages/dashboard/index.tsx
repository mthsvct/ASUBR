import { canSSRAuth } from "@/utils/canSSRAuth"
import Head from "next/head"

export default function Dashboard() {
	return (
		<>
			<Head><title>Home</title></Head>
			<h1>Hello World!</h1>
			<p><i>Dashboard</i></p>
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

