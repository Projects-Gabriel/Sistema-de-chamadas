import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import logo from '../../assets/logo.png';
import './signup.css';

function SignUp() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nome, setNome] = useState('');

    const { signUp, loadingAuth } = useContext(AuthContext);

    function handleSubmit(e) {
        e.preventDefault();
        signUp(email,password,nome);
    }   
    
    return(
        <div className="container-center">
            <div className="signup">
                <div className="signup-area">
                    <img src={logo} alt="Sistema Logo" />
                </div>
                <form onSubmit={handleSubmit}>
                    <h1>Entrar</h1>
                    <input type="text" placeholder="seu nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    <input type="text" placeholder="email@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="*******" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <button type="submit">{loadingAuth ? 'Cadastrando . . .' : 'Cadastrar'}</button>
                </form>
                <Link to="/">Já possui uma conta? Entre </Link>
            </div>
        </div>
    );
}

export default SignUp;