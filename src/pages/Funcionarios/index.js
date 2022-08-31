import './funcionarios.css';
import { useState, useEffect, useRef } from 'react';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ModalFuncionario from '../../components/ModalFuncionario';
import firebase from '../../services/firebaseConnection';

const listRef = firebase.firestore().collection('funcionarios').orderBy('nome', 'asc');

export default function Funcionarios(){
  const effectRan = useRef(false);

  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [showPostModal, setShowPostModal]= useState(false);
  const [detail, setDetail] = useState();
  const [filtroSuperior, setFiltroSuperior] = useState('');

  async function loadFuncionarios(){
    console.log('load func', filtroSuperior.length)
    //await listRef.where('superior', '==', '*').limit(5)
    await listRef.limit(5)
    .get()
    .then((snapshot) => {
      updateState(snapshot)
    })
    .catch((err)=>{
      console.log('Deu algum erro: ', err);
      setLoadingMore(false);
    })

    setLoading(false);

  }

  useEffect(()=> {

    if(effectRan.current === true){
      
      loadFuncionarios();
    }

    return () => {
      effectRan.current = true
    }
  }, []);

  async function updateState(snapshot){
    const isCollectionEmpty = snapshot.size === 0;

    if(!isCollectionEmpty){
      const lista = [];

      snapshot.forEach((doc)=>{
        if(filtroSuperior !== '' && filtroSuperior !== doc.data().superior) {
          console.log(' filtrando sup ', filtroSuperior);
          console.log(' doc.data().superior ', doc.data().superior);
          return;
        }

        lista.push({
          id: doc.id,
          nome: doc.data().nome,
          email: doc.data().email,
          login: doc.data().login,
          cargo: doc.data().cargo,
          superior: doc.data().superior,
          senha: doc.data().senha,
          telefone: doc.data().telefone
        })
      })

      const lastDoc = snapshot.docs[snapshot.docs.length -1];
      
      setFuncionarios(funcionarios => [...funcionarios, ...lista]);
      setLastDocs(lastDoc);

    }else{
      setIsEmpty(true);
    }

    setLoadingMore(false);

  }


  async function handleMore(){
    setLoadingMore(true);
    await listRef.startAfter(lastDocs).limit(5)
    .get()
    .then((snapshot)=>{
      updateState(snapshot)
    })
  }
 
  function togglePostModal(item){
    setShowPostModal(!showPostModal);
    setDetail(item);
  }

  function toggleEditModal(item){
    setShowPostModal(!showPostModal);
  }

  function handleFiltro(){
    console.log('filtrar sup: ',filtroSuperior)
    setFuncionarios('');
    loadFuncionarios();
  }

  if(loading){
    return(
      <div>
        <Header/>

        <div className="content">
          <Title name="Funcionários">
            <FiMessageSquare size={25} />
          </Title>  

          <div className="container dashboard">
            <span>Buscando funcionários...</span>
          </div>

        </div>      
      </div>
    )
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title nome="Funcionários">
          <FiUsers size={25} />
        </Title>

        {funcionarios.length === 0 ? (
          <div className="container dashboard">
            <span>{filtroSuperior.length === 0 ? `Nenhum funcionário registrado...`
                  :
                  `Nenhum funcionário registrado com o Superior: ${filtroSuperior}`
                  }
            </span>

            <Link to="/funcionario" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo funcionário
            </Link>
          </div>
        )  : (
          <>
            <Link to="/funcionario" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo funcionário
            </Link>

            <div>
            <label>
              Filtro por Superior
            </label>
            <br/>
            <input type="text"
              value={filtroSuperior}
              onChange={ (e) => setFiltroSuperior(e.target.value) }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                    handleFiltro(e.target.value);
                }
            }}
            />
            </div>

            <table>
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">Email</th>
                  <th scope="col">Cargo</th>
                  <th scope="col">Login</th>
                  <th scope="col">Superior</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                {funcionarios.map((item, index)=>{
                  return(
                    <tr key={index}>
                      <td data-label="Nome">{item.nome}</td>
                      <td data-label="Email">{item.email}</td>
                      <td data-label="Cargo">{item.cargo}</td>
                      <td data-label="Login">{item.login}</td>
                      <td data-label="Superior">{item.superior}</td>
                      <td data-label="#">
                        <button className="action" style={{backgroundColor: '#3583f6' }}
                          onClick={ () => togglePostModal(item) }
                        >
                          <FiSearch color="#FFF" size={17} cursor="pointer" />
                        </button>

                        <Link className="action" 
                          style={{backgroundColor: '#F6a935' }}
                          to={`/funcionario/${item.id}`}
                          onClick={ () => toggleEditModal(item) }
                        >
                          <FiEdit2 color="#FFF" size={17} cursor="pointer" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            {loadingMore && <h3 style={{textAlign: 'center', marginTop: 15 }}>Buscando dados...</h3>}
            { !loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button> }

          </>
        )}

      </div>

      {showPostModal && (
        <ModalFuncionario
          conteudo={detail}
          close={togglePostModal}
        />

      )}

    </div>
  )
}