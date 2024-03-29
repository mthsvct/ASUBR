import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { parseCookies } from 'nookies'

//funcao para paginas que só pode ser acessadas por visitantes
export function redirectHome<P>(fn: GetServerSideProps<P>) {
	return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
		const cookies = parseCookies(ctx);
		// Se o cara tentar acessar a pagina porem tendo já um login salvo redirecionamos
		if(cookies['@nextauth.token']){
			return {
				redirect:{
					destination: '/disciplinas',
					permanent: false,
				}
			}
		}
		let aux = await fn(ctx);
		// console.log(aux);
		return aux;	
	}
}
