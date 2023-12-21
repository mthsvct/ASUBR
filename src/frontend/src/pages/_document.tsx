import { Footer } from '@/components/footer'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang="pt-br">
			<Head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com"/>
				<link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100;0,200;0,400;0,600;0,700;1,100;1,200;1,400;1,600;1,700&family=League+Spartan:wght@100;200;300;400;500;600;700;800;900&family=Outfit:wght@100;200;300;400;500;800&family=Young+Serif&display=swap" rel="stylesheet" />
			</Head>
			<body>
				<Main />
				
				<NextScript />
			</body>
		</Html>
	)
}
