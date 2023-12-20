import Image from 'next/image'
import styles from './page.module.scss'
import { Redirect } from 'next'
import { redirect } from 'next/navigation'

export default function Home() {

	return redirect('/login')


	// return (
	// 	<h1>
	// 		ASUBR
	// 	</h1>
	// )
}
