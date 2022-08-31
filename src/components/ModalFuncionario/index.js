
import './modal.css';

import { FiX } from 'react-icons/fi';


export default function ModalFuncionario({conteudo, close}){
  return(
    <div className="modal">
      <div className="container">
        <button className="close" onClick={ close }>
          <FiX size={23} color="#FFF" />
          Voltar
        </button>

        <div>
          <h2>Detalhes do Funcionário</h2>

          <div className="row">
            <span>
              Nome: <a>{conteudo.nome}</a>
            </span>
            <span>
              Email: <a>{conteudo.email}</a>
            </span>
          </div>

          <div className="row">
            <span>
              Login: <a>{conteudo.login}</a>
            </span>
            <span>
              Telefone: <a>{conteudo.telefone}</a>
            </span>
          </div>

          <div className="row">
            <span>
              Cargo: <a>{conteudo.cargo}</a>
            </span>
            <span>
              Superior: <a>{conteudo.superior}</a>
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}