import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiSettings} from 'react-icons/fi'

import  './header.css';
import avatar from '../../assets/avatar.png';

export default function Header() {
    const { user } = useContext(AuthContext);

    return(
        <div className="sidebar">
            <div>
                <img src={user.avatarUrl === null ? avatar : user.avatarUrl} alt="Imagem do usuario" />
            </div>
            <Link to="/"><FiHome color="#FFF" size={24}></FiHome>Chamados</Link>
            <Link to="/customers"><FiUser color="#FFF" size={24}></FiUser>Clientes</Link>
            <Link to="/profile"><FiSettings color="#FFF" size={24}></FiSettings>Configuraçõe</Link>
        </div>
    );
}