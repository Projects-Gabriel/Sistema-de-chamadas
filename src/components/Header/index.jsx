import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { Link } from 'react-router-dom';

import  './header.css';
import avatar from '../../assets/avatar.png';

export default function Header() {
    const { user } = useContext(AuthContext);

    return(
        <div className="sidebar">
            <div>
                <img src={user.avatarUrl === null ? avatar : user.avatarUrl} alt="Imagem do usuario" />
            </div>
            <Link>Chamados</Link>
        </div>
    );
}