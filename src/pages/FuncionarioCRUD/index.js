import './funcionariocrud.css'
import Header from '../../components/Header';
import Title from '../../components/Title';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';

export default function FuncionarioCRUD(){
  const { id } = useParams();
  const history = useHistory();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nomeCargo, setNomeCargo] = useState('')
  const [cargoId, setCargoId] = useState('');
  const [nomeSuperior, setNomeSuperior] = useState('');
  const [superiorId, setSuperiorId] = useState('');
  const [cargos, setCargos] = useState([]);
  const [loadingCargos, setLoadingCargos] = useState(true);
  const [cargoSelected, setCargoSelected] = useState(3);
  const [superiores, setSuperiores] = useState([]);
  const [loadingSuperiores, setLoadingSuperiores] = useState(true);
  const [superiorSelected, setSuperiorSelected] = useState(0);
  const [idFuncionario, setIdFuncionario] = useState(false);

  async function loadCargos(){
    await firebase.firestore().collection('cargos')
    .get()
    .then((snapshot)=>{
      const listaCargos = [];

      snapshot.forEach((doc) =>{
        listaCargos.push({
          id: doc.id,
          nome: doc.data().cargo
        })
      })

      if(listaCargos.length === 0){
        setCargos( [{ id: '3', nome: 'sem dados' }]);
        setLoadingCargos(false);
        return;
      }

      setCargos(listaCargos);
      setLoadingCargos(false);

      if(id){
        loadIdFunc(listaCargos);
      }
    })
    .catch((error)=>{
      setLoadingCargos(false);
      setCargos([ {id: '3', nome: ''} ])
    })
  }

  async function loadFuncSuperior(){
    //console.log(' filtro cargo sel ', cargoSelected);

    await firebase.firestore().collection('funcionarios')
    .get()
    .then((snapshot)=>{
      const listaSuperiores = [];

      snapshot.forEach((doc) =>{
        //console.log(` cargo sel ${cargoSelected} cargoId ${doc.data().cargoId}`)

        if(doc.data().cargoId <= cargoSelected){
          listaSuperiores.push({
            id: doc.id,
            nome: doc.data().nome
          })
        }
      })

      if(listaSuperiores.length === 0){
        setSuperiores( [{ id: 99, nome: 'sem dados' }]);
        setLoadingSuperiores(false);
        return;
      }

      setSuperiores(listaSuperiores);
      setSuperiorSelected(superiorId);
      setLoadingSuperiores(false);

      console.log(' pegando hook idfunc: ');
      console.log(' pegando hook lista super: ',listaSuperiores);
      console.log(' pegando hook superiorId: ',superiorId);

    })
    .catch((error)=>{
      console.log(' erro ao buscar superiores: ', error)
      setLoadingSuperiores(false);
      setSuperiores([ {id: 99, nome: ''} ])
    })
  }

  useEffect(()=>{ 
    loadCargos();
    
    return () => {
      
    }
  }, [id]);

  useEffect(()=>{ 

    loadFuncSuperior();
  }, [cargoSelected]);

  async function loadIdFunc(listaCargos){
    await firebase.firestore().collection('funcionarios').doc(id)
    .get()
    .then((snapshot) => {
      setNome(snapshot.data().nome);
      setEmail(snapshot.data().email);
      setLogin(snapshot.data().login);
      setSenha(snapshot.data().senha);
      setTelefone(snapshot.data().telefone);
      setNomeCargo(snapshot.data().cargo);
      setCargoId((snapshot.data().cargoId));
      setNomeSuperior((snapshot.data().superior));
      setSuperiorId((snapshot.data().superiorId));

      //console.log(' pegando dados idfunc: ');
      //console.log(' pegando dados cargoId: ',snapshot.data().cargoId);
      //console.log(' pegando dados superiorId: ',snapshot.data().superiorId);

      const indexCargo = listaCargos.findIndex(item => item.id === snapshot.data().cargoId);
      
      setCargoSelected(indexCargo);
      setSuperiorId(snapshot.data().superiorId);
      setIdFuncionario(true);

      //console.log(' pegando hook idfunc: ');
      //console.log(' pegando hook cargoId: ',indexCargo);
      //console.log(' pegando hook superiorId: ',superiorSelected);
    })
    .catch((error)=>{
      console.log('Erro com o ID passado: ',error);
      setIdFuncionario(false);
    })

  }

  async function handleRegister(e){
    e.preventDefault();

    console.log(' cargo id ', nomeCargo)
    if(idFuncionario){
      await firebase.firestore().collection('funcionarios')
      .doc(id)
      .update({
        nome: nome,
        cargo: nomeCargo,
        cargoId: cargoId,
        email: email,
        senha: senha,
        login: login,
        telefone: telefone,
        superior: nomeSuperior,
        superiorId: superiorId
      })
      .then(()=>{
        toast.success('Chamado atualizado com sucesso!');
        setCargoSelected(3);
        setLogin('');
        history.push('/funcs');
      })
      .catch((error)=>{
        toast.error('Erro ao atualizar, tente mais tarde.')
        console.log(error);
      })

      return;
    }

    await firebase.firestore().collection('funcionarios')
    .add({
      nome: nome,
      cargo: nomeCargo,
      cargoId: cargoId,
      email: email,
      senha: senha,
      login: login,
      telefone: telefone,
      superior: nomeSuperior,
      superiorId: superiorId
    })
    .then(()=>{
      toast.success('Funcionário registrado com sucesso!')
      setCargoSelected(3);
      history.push('/funcs');
    })
    .catch((error)=>{
      toast.error('Erro as registrar, favor tente mais tarde')
    })

  }

  function handleChangeSuperiores(e){
    //console.log(' handle superior id ', superiores[e.target.value].id);
    //console.log(' handle superior nome ', superiores[e.target.value].nome);
    setNomeSuperior(superiores[e.target.value].nome);
    setSuperiorId(superiores[e.target.value].id);
    setSuperiorSelected(e.target.value);
  }

  function handleChangeCargos(e){
    //console.log(' handle cargo id ', e.target.value);
    //console.log(' handle cargo nome ', cargos[e.target.value].nome);
    setNomeCargo(cargos[e.target.value].nome);
    setCargoId(e.target.value);
    setCargoSelected(e.target.value);
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title nome="Novo funcionário">

        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>

            <label>
              Nome
            </label>
            <input type="text" 
              value={nome}
              onChange={ (e) => setNome(e.target.value) }
              required
            />

            <label>
              Email
            </label>
            <input type="text" 
              value={email}
              onChange={ (e) => setEmail(e.target.value) }
              required
            />

            <label>
              Login
            </label>
            <input type="text" 
              value={login}
              onChange={ (e) => setLogin(e.target.value) }
              required
            />

            <label>
              Sehha
            </label>
            <input type="password" 
              value={senha}
              onChange={ (e) => setSenha(e.target.value) }
              required
            />

            <label>
              Telefone
            </label>
            <input type="text" 
              value={telefone}
              onChange={ (e) => setTelefone(e.target.value) }
            />

            <label>
              Cargo
            </label>

            {loadingCargos ? (
              <input type="text" disabled={true} value="Carregando..." />
            ) : (
              <select
              value={cargoSelected}
              onChange={ (e) => handleChangeCargos(e)}
            >
              {cargos.map((item, index)=>{
                return(
                  <option
                  key={item.id}
                  value={index}
                  nome={item.nome}
                  >
                    {item.nome}
                  </option>
                )
              })}
            </select>
            )}

            <label>
              Superior
            </label>

            {loadingSuperiores ? (
              <input type="text" disabled={true} value="Carregando..." />
            ) : (
              <select
              value={superiorSelected}
              onChange={handleChangeSuperiores}
            >
              {superiores.map((item, index)=>{
                //console.log(' dados para selecao ', superior)
                return(
                  <option
                    key={item.id}
                    value={index}
                    nome={item.nome}
                  >
                    {item.nome}
                  </option>
                )
              })}
            </select>
            )}

            <button type="submit">
              Registrar
            </button>
          </form>

        </div>
      </div>
      
    </div>
  )
}