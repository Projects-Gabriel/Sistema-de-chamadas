import { useState, useContext } from 'react';
import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import firebase from '../../services/firebaseConection';
import { toast } from 'react-toastify';

import { FiSettings, FiUpload } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';

export default function Profile() {

    const { user , signOut, setUser, storageUser} = useContext(AuthContext);

    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);

    const[imagemAvatar, setImagemAvatar] = useState(null)


    function handleFile(e) {
        if(e.target.files[0]){
            const image = e.target.files[0];

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImagemAvatar(image);
                setAvatarUrl(URL.createObjectURL(e.target.files[0]));
            } else {
                toast.warning('Envie um imagem do tipo PNG ou JPEG')
                setImagemAvatar(null);
                return null;
            }
        }
    }

    async function handleUpload() {
        const currentUid = user.uid;

        const uploadTask = await firebase.storage()
        .ref(`images/${currentUid}/${imagemAvatar.name}`)
        .put(imagemAvatar)
        .then(async () => {
            
            await firebase.storage().ref(`images/${currentUid}`)
            .child(imagemAvatar.name).getDownloadURL()
            .then( async (url) => {
                let urlFoto = url;
                console.log(url);
                await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    nome : nome,
                    avatarUrl: urlFoto
                })
                .then(() => {
                    let data = {
                        ...user,
                        nome : nome,
                        avatarUrl: urlFoto
                    };
                    toast.success('Imagem inserida com sucesso');
                    setUser(data);
                    storageUser(data);
                })
                .catch((error) =>  {
                    toast.error('error ao envia a imagem');
                })
            })
        })  
    }

    async function handleSave(e){
        e.preventDefault();

        if(imagemAvatar === null && nome !== ''){
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                nome: nome,
            })
            .then(() => {
                let data = {
                    ...user,
                    nome : nome
                };

                setUser(data);
                storageUser(data);
                toast.success('Nome alterado!')
            })
        } else if (nome !== '' && imagemAvatar) {
            handleUpload();
        }
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name="Meu perfil">
                    <FiSettings size={25} />
                </Title>

                <div className="container" onSubmit={handleSave}>
                    <form className="form-profile">
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#fff" size={25}/>
                            </span>

                            <input type="file"  accept="image/**" onChange={handleFile} /><br />
                            {avatarUrl === null ?
                                <img src={avatar} width="250" heigth="250" alt="foto de perfil" />
                                :
                                <img src={avatarUrl} width="250" heigth="250" alt="foto de perfil" />

                            }
                        </label>
                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                        <label>Email</label>
                        <input type="text" value={email} disabled  />
                        <button type='submit'>Salvar</button>
                    </form>
                </div>

                <div className="container">
                    <button className="logout-btn" onClick={() => signOut()}>
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
}