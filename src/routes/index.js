import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Customers from '../pages/Customers';
import Tickets from '../pages/Tickets';
import Funcionarios from '../pages/Funcionarios';
import FuncionarioCRUD from '../pages/FuncionarioCRUD';

export default function Routes(){
  return(
    <Switch>
      <Route exact path="/" component={SignIn} />
      <Route exact path="/register" component={SignUp} />

      <Route exact path="/dashboard" component={Dashboard} isPrivate />
      <Route exact path="/profile" component={Profile} isPrivate />
      <Route exact path="/customers" component={Customers} isPrivate />
      <Route exact path="/tickets" component={Tickets} isPrivate />
      <Route exact path="/funcs" component={Funcionarios} isPrivate />
      <Route exact path="/tickets/:id" component={Tickets} isPrivate />
      <Route exact path="/funcionario" component={FuncionarioCRUD} isPrivate />
      <Route exact path="/funcionario/:id" component={FuncionarioCRUD} isPrivate />
    </Switch>
  )
}