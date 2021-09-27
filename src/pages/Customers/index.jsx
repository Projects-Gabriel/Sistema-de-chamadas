import { useState } from "react"
import Title from "../../components/Title";
import Header from "../../components/Header";
import firebase from "../../services/firebaseConection";

import './customers.css';
import { FiUser } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Customers() {

    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    async function handleAdd(e) {
        e.preventDefault();

        await firebase.firestore().collection('clients')
        .add({
            nomeFantasia: nomeFantasia,
            cnpj: cnpj,
            endereco: endereco
        })
        .then(() => {
            setNomeFantasia('');
            setCnpj('');
            setEndereco('');
            toast.info("cliente cadastrado.")
        })

    }

    return(
        <div>
            <Header />
            <div className="content">
                <Title name="Clientes">
                    <FiUser size={25}/>
                </Title>

                <div className="container" onSubmit={handleAdd}>
                    <form action="" className="form-profile customers">
                        <label>Nome Fantasia</label>
                        <input type="text" placeholder="Nome da sua empresa" value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} required/>
                        <label>cnpj</label>
                        <input type="text"  placeholder="Seu cnpj" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required/>
                        <label>Endereço</label>
                        <input type="text" placeholder="Endereço da empresa" value={endereco} onChange={(e) => setEndereco(e.target.value)} required/>
                        <button>Salvar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}