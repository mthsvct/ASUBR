import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";
import { api } from "../services/apiClient";
import { toast } from "react-toastify";


type AuthContextData = {
    user: UserProps | null; // Defina o usuário como nullable inicialmente
    isAuthenticated: boolean;
    loading: boolean; // Adicione um estado de carregamento
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>; 
}

type UserProps = {
    id: string;
    name: string;
    email: string;
    matricula: string;
    ira: number;
    nivel: number;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    nameN: string;
    emailN: string;
    passwordN: string;
    matriculaN: string;
    iraN: number;
    nivelN: number;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut(){
    // signOut = Des logar
    try {
        // Limpar o token que tinha salvo.
        destroyCookie(undefined, '@nextauth.token');
        // Os dois parametros são: Qual o contexto que eu quero limpar o cookie e o nome do cookie que eu quero limpar.
        // O contexto é undefined porque eu quero limpar o cookie em todos os contextos.
        Router.push('/login'); // Redirecionar para a página inicial.
    } catch {
        // Caso de erro, não fazer nada.
        console.log('Erro ao deslogar.');
    }
}

export function AuthProvider({children}:AuthProviderProps){

    // const [user, setUser] = useState<UserProps>(); // Inicialmente o usuário não está logado, então não temos um usuário.
    const [user, setUser] = useState<UserProps | null>(null); // Inicialize como null
    const isAuthenticated = !!user; // Converter para booleano;
    const [loading, setLoading] = useState(true);

    useEffect(
        () => {
            // Tentar pegal algo no cookie
            const { '@nextauth.token': token } = parseCookies();

            // console.log(token);

            if(token != undefined) {

                api.get('/aluno/me').then(
                    // Caso de sucesso, pegamos os dados do usuário.
                    response => {
                        const { id, name, email, matricula, ira, nivel } = response.data;
                        setUser({ id, name, email, matricula, ira, nivel });
                        setLoading(false);
                    }

                ) // Fim do then.
                .catch(() => {
                    // Caso de erro, deslogamos.
                    setUser(null); // Defina o usuário como null em caso de erro
                    setLoading(false);
                    signOut();
                }) // Fim do catch.
            } else {
                setUser(null); // Defina o usuário como null se não houver token
                setLoading(false);
            }

        }, []
    )

    async function signIn({email, password}: SignInProps){

        // Sign In = Logar

        try {
            // Fazer a requisição para a API.
            const response = await api.post('/aluno/login', {
                email: email,
                password: password
            });

            //console.log(response.data);

            const {status} = response.data;

            // console.log(response.data);

            if (status != 200) {
                toast.error("Erro ao acessar. :(");
                return;
            } 
            
            const { id, name, matricula, ira, nivel } = response.data.aluno;
            const { token } = response.data;

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 dias
                path: "/" // Quais caminhos terão acesso ao cookie.
            }); // Esta função eh para salvar o cookie no navegador.

            setUser({id, name, email, matricula, ira, nivel});
        
            // Passar para as próximas requisições nosso token.
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success("Logado com Sucesso! :D");

            // Redirecionar o usuário para o dashboard (página de ultimos pedidos).
            Router.push('/dashboard');

        } catch(err) {
            // Caso de erro, não fazer nada.
            console.log('Erro ao fazer login.', err);
            toast.error("Erro ao acessar. :(");
        }
    }

    async function signUp({nameN, emailN, passwordN, matriculaN, iraN, nivelN}: SignUpProps){
        
        // signUp = Cadastrar
        
        try {

            // Fazer a requisição para a API para criar o usuário.

            const response = await api.post('/aluno/cadastrar', {
                name: nameN,
                email: emailN,
                password: passwordN,
                matricula: matriculaN,
                ira: iraN,
                nivel: nivelN
            });

            console.log(response.data);

            if(response.data.status != 200){
                toast.error("Erro ao cadastrar. :(");
                return;
            }

            const { id, name, email, matricula, ira, nivel } = response.data.aluno;
            const { token } = response.data;

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 dias
                path: "/" // Quais caminhos terão acesso ao cookie.
            }); // Esta função eh para salvar o cookie no navegador.

            setUser({id, name, email, matricula, ira, nivel});
        
            // Passar para as próximas requisições nosso token.
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success("Cadastrado com Sucesso! :D");

            // Redirecionar o usuário para a página de login.
            Router.push('/check');

        } catch(err) {
            // Caso de erro, não fazer nada.
            console.log('Erro ao fazer cadastro.', err);
            toast.error("Erro ao cadastrar. :(");
        }
    }



    // O user no value tava dando erro, o que professor recomendou: Confira no seu arquivo tsconfig.json se a opção strict esta marcada como false; 

    return(
        <AuthContext.Provider value={{user, isAuthenticated, loading, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}