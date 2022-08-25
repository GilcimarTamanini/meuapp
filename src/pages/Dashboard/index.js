import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";

import Heaqder from '../../components/Header';

export default function Dashboard(){
  const { signOut } = useContext(AuthContext);

  return(
    <div>
      <Heaqder/>
      <h1>
        PAGINA DASHBOARD
      </h1>
    </div>
  )
}