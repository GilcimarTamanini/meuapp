import './tickets.css'
import Header from '../../components/Header';
import Title from '../../components/Title';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';

export default function Tickets(){
  const { id } = useParams();
  const history = useHistory();

  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [complemento, setComplemento] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loadCustomers, setLoadCustomers] = useState(true);
  const [customerSelected, setCustomerSelected] = useState(0);
  const [idCustomer, setIdCustomer] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(()=>{
    async function loadCustomers(){
      await firebase.firestore().collection('customers')
      .get()
      .then((snapshot)=>{
        const listaCustomers = [];

        snapshot.forEach((doc) =>{
          listaCustomers.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia
          })
        })

        if(listaCustomers.length === 0){
          setCustomers( [{ id: '1', nomeFantasia: 'sem dados' }]);
          setLoadCustomers(false);
          return;
        }

        setCustomers(listaCustomers);
        setLoadCustomers(false);

        if(id){
          loadId(listaCustomers);
        }
      })
      .catch((error)=>{
        setLoadCustomers(false);
        setCustomers([ {id: 1, nomeFantasia: ''} ])
      })
    }

    loadCustomers();
  }, [id]);

  async function loadId(lista){
    await firebase.firestore().collection('tickets').doc(id)
    .get()
    .then((snapshot) => {
      setAssunto(snapshot.data().assunto);
      setStatus(snapshot.data().status);
      setComplemento(snapshot.data().complemento);

      const indexCli = lista.findIndex(item => item.id === snapshot.data().clienteId);
      setCustomerSelected(indexCli);
      setIdCustomer(true);
    })
    .catch((error)=>{
      console.log('Erro com o ID passado: ',error);
      setIdCustomer(false);
    })

  }

  async function handleRegister(e){
    e.preventDefault();

    if(idCustomer){
      await firebase.firestore().collection('tickets')
      .doc(id)
      .update({
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid
      })
      .then(()=>{
        toast.success('Chamado atualizado com sucesso!');
        setCustomerSelected(0);
        setComplemento('');
        history.push('/dashboard');
      })
      .catch((error)=>{
        toast.error('Erro ao atualizar, tente mais tarde.')
        console.log(error);
      })

      return;
    }

    await firebase.firestore().collection('tickets')
    .add({
      created: new Date(),
      cliente: customers[customerSelected].nomeFantasia,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      status: status,
      complemento: complemento,
      userId: user.uid
    })
    .then(()=>{
      toast.success('Chamado registrado com sucesso!')
      setComplemento('');
      setCustomerSelected(0);

    })
    .catch((error)=>{
      toast.error('Erro as registrar, favor tente mais tarde')
    })


  }

  function handleChangeSelect(e){
    setAssunto(e.target.value);

  }

  function handleChangeOption(e){
    setStatus(e.target.value);

  }

  function handleChangeCustomers(e){
    //console.log('index cliente selecionado: ', e.target.value);
    //console.log('id cliente selecionado: ', customers[e.target.value]);
    setCustomerSelected(e.target.value);
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title nome="Novo chamado">

        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>
              Cliente
            </label>

            {loadCustomers ? (
              <input type="text" disabled={true} value="Carregando..." />
            ) : (
              <select
              value={customerSelected}
              onChange={handleChangeCustomers}
            >
              {customers.map((item, index)=>{
                return(
                  <option
                    key={item.id}
                    value={index}
                  >
                    {item.nomeFantasia}
                  </option>
                )
              })}
            </select>
            )}

            

            <label>
              Assunto
            </label>
            <select 
              value={assunto}
              onChange={handleChangeSelect}
            >
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Tecnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label>
              Status
            </label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Aberto"
                onChange={handleChangeOption}
                checked={ status === 'Aberto' }
              />
              <span>
                Em Aberto
              </span>

              <input
                type="radio"
                name="radio"
                value="Progresso"
                onChange={handleChangeOption}
                checked={ status === 'Progresso' }
              />
              <span>
                Em Progresso
              </span>

              <input
                type="radio"
                name="radio"
                value="Atendido"
                onChange={handleChangeOption}
                checked={ status === 'Atendido' }
              />
              <span>
                Atendido
              </span>

            </div>

            <label>
              Complemento
            </label>
            <textarea
              type="text"
              placeholder="Descreva seu problema."
              value={complemento}
              onChange={ (e) => 
                setComplemento(e.target.value)
              }
            />

            <button type="submit">
              Registrar
            </button>
          </form>

        </div>
      </div>
      
    </div>
  )
}