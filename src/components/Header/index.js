import { useContext } from 'react'; 
import './header.css';
import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';

import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiUsers, FiSettings } from 'react-icons/fi';

export default function Header(){
  const { user } = useContext(AuthContext);

  /*if(user.avatarUrl == null){
    console.log('img nula')
  } else{
    console.log(user)
  }*/

  return(
    <div className='sidebar'>
      <div>
        <img src={user.avatarUrl === null ? avatar : user.avatarUrl} alt="Foto avatar" />
      </div>

      <Link to="/dashboard">
        <FiHome color="#FFF" size={24}></FiHome>
        Chamados
      </Link>

      <Link to="/customers">
        <FiUser color="#FFF" size={24}></FiUser>
        Clientes
      </Link>

      <Link to="/funcs">
        <FiUsers color="#FFF" size={24}></FiUsers>
        Funcionários
      </Link>

      <Link to="/profile">
        <FiSettings color="#FFF" size={24}></FiSettings>
        Configurações
      </Link>
    </div>
  )
}