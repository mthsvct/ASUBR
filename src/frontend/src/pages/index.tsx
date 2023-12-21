import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.scss'
import { Button } from '@/components/button'
import { redirectHome } from '@/utils/redirectHome'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {


	return (
		<>
			<div>
				<h2>Links:</h2>
				<Button linkagem='/login'>Login</Button>
				<Button linkagem='/cadastrar'>Cadastrar</Button>
				<Button linkagem='/disciplinas'>Disciplinas</Button>
			</div>
			<h1>Hello World!</h1>
		</>
	)
}

export const getServerSideProps = redirectHome(
	async (ctx) => {
		return {
			props: {}
		}
	}
);
