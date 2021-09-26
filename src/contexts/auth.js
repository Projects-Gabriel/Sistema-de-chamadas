import { createContext, useState, useEffect } from "react";
import firebase from "../services/firebaseConection";
import { toast } from "react-toastify";

export const AuthContext = createContext();


function AuthProvider({children}) {
    
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true)
    
    // mantém o usuario logado
    useEffect(() => {

        function loadStorage() {
            const storageUser = localStorage.getItem('sistemaUser');

            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }

            setLoading(false);
        }

        loadStorage();

    }, [])

    // logando o usuario
    async function signIn(email, password) {
        setLoadingAuth(true);

        await firebase.auth().signInWithEmailAndPassword(email,password)
        .then( async (value) => {
            let uid = value.user.uid;

            const userProfile = await firebase.firestore().collection('users')
            .doc(uid).get();

            let data ={
                uid: uid,
                nome: userProfile.data.nome,
                avatarUrl: userProfile.data.avatarUrl,
                email: value.user.email
            }

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success('Bem vindo de Volta!');
        })
        .catch((error) => {
            console.log(error);
            toast.error('Ops deu erro ')
            setLoadingAuth(false);
        })
    }

    // Cadastra o usuario
    async function signUp(email,password,nome) {
        setLoadingAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(async (value) => {
            var uid = value.user.uid;
 
            await firebase.firestore().collection('users')
            .doc(uid).set({
                nome: nome,
                avatarUrl: null,
            })
            .then(() => {
                let data = {
                    uid: uid,
                    nome: nome,
                    email: email,
                    avatarUrl: null
                }

                setUser(data);
                storageUser(data);
                setLoading(false)
                toast.success('Bem vindo a nossa Plataforma!')
            })
        })
        .catch((error) => {

            toast.error('Ops algo deu errado');
            if(error.code === 'auth/weak-password'){
                toast.error('senha muito fraca');
              } else if(error.code === 'auth/email-already-in-use') {
                toast.error('email já existe');
            }
            setLoadingAuth(false);
        })
    }

    // cria um localstorage do usuario
    function storageUser(data){
        localStorage.setItem('sistemaUser',JSON.stringify(data));
    }

    // faz o logout
    async function signOut(){
        await firebase.auth().signOut();
        localStorage.removeItem('sistemaUser');
        setUser(null);
    }

    return(
        <AuthContext.Provider value = {{signed : !!user, user, loading, signUp, signOut, signIn, loadingAuth}} >
            {children}
        </AuthContext.Provider >
    );
}

export default AuthProvider;