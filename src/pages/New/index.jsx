import { useState, useEffect, useContext } from 'react';
import {FiPlus} from 'react-icons/fi';
import firebase from '../../services/firebaseConection';
import { toast } from 'react-toastify';
import {useHistory, useParams} from 'react-router-dom'

import './new.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';

export default function New() {
 
    const { id } = useParams();
    const history = useHistory();

    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customerSelected, setCustomerSelected] = useState('')

    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto')
    const [complemento, setComplemento] = useState('');

    const [idCustomer, setIdCustomer] = useState(false);

    const { user } = useContext(AuthContext);

    useEffect(() => { 
        async function loadCustomers() {
            await firebase.firestore().collection('clients')
            .get()
            .then((snapshot) => {
                let lista = [];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia,
                    })
                })

                if(lista.length === 0){
                    setCustomers([{id: '1', nomeFantasia: ''}]);
                    setLoadCustomers(false);
                    return;
                }

                setLoadCustomers(false);
                setCustomers(lista);

                if(id) {
                    loadId(lista);
                }
                
            })
            .catch(() => {
                setLoadCustomers(false);
                setCustomers([{id: '1', nomeFantasia: ''}]);
            })
        }
        
        loadCustomers();

    }, [id]);


    async function loadId(lista){
        await firebase.firestore().collection('chamados')
        .doc(id)
        .get()
        .then((snapshot) => {
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento);
            
            let index = lista.findIndex(item => item.id === snapshot.data().clienteID);
            setCustomerSelected(index)
            setIdCustomer(true);
        })
        .catch((error) => {
            setIdCustomer(false);
        });
    }

    async function handleAddCaller(e){
        e.preventDefault();
        
        if(idCustomer) {
            await firebase.firestore().collection('chamados')
            .doc(id)
            .update({
                cliente: customers[customerSelected].nomeFantasia,
                clienteID: customers[customerSelected].id,
                assunto: assunto,
                status:  status,
                complemento: complemento,
                userId: user.uid
            })
            .then(() => {
                toast.info('Chamado Editado com sucesso!');
                setCustomerSelected(0);
                setComplemento('');
                history.push('/dashboard');
            })
            .catch((error) => {
                toast.error('Não houve atualização, tente novamente mais tarde');
            })
            return;
        }
            
        await firebase.firestore().collection('chamados')
        .add({
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteID: customers[customerSelected].id,
            assunto: assunto,
            status:  status,
            complemento: complemento,
            userId: user.uid
        })
        .then(() => {
            toast.success("Chamado criado com sucesso");
            setComplemento('')
            setCustomerSelected(0);
        })
        .catch(() => {
            toast.error("Erro ao Registrar, tente mais tarde.");
        })
    }
    // chama quando troca o cliente
    function handleChangeCustomers(e) {
        setCustomerSelected(e.target.value);
    }

    // Chama quando troca o assunto
    function handleChangeSelect(e) {
        e.preventDefault();
        setAssunto(e.target.value);
    }

    // chama quando troca o status
    function handleOptionChange(e){
        e.preventDefault();
        setStatus(e.target.value);
    }

    return(
        <div>
            <Header />
            <div className="content">
                <Title name="Chamado">
                    <FiPlus size={25}/>
                </Title>

                <div className="container">

                    <form className="form-profile" onSubmit={handleAddCaller}>
                        <label>Cliente</label>

                        {loadCustomers ? (
                            <input type="text" disabled value="carregando clientes ..." />
                        ): (
                            <select value={customerSelected} onChange={handleChangeCustomers}>
                                {customers.map((item, index) => {
                                    return(
                                        <option key={item.id} value={index}>{item.nomeFantasia}</option>
                                    );
                                })}
                             </select>
                        )
                        }

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value="Suporte">Suportes</option>
                            <option value="Visita Tecnica">Visita Tecnica</option>
                            <option value="Financeiro">financerios</option>
                        </select>

                        <label htmlFor="">Status</label>
                        <div className="status">
                            <input type="radio" name="radio" value="Aberto"  onChange={handleOptionChange} checked={status === 'Aberto'}/>
                            <span>Em aberto</span>

                            <input type="radio" name="radio" value="Progresso" onChange={handleOptionChange} checked={status === 'Progresso'}/>
                            <span>Progresso</span>

                            <input type="radio" name="radio" value="Finalizado" onChange={handleOptionChange} checked={status === 'Finalizado'}/>
                            <span>Finalizado</span>
                        </div>
                        
                        <label>Complementos</label>
                        <textarea type="text" placeholder="Descreva seu problema (opcional)" value={complemento} onChange={(e) => setComplemento(e.target.value)}></textarea>

                        <button type="submit" >Salvar</button>
                    </form>

                </div>
            </div>
        </div>   
    );  
}