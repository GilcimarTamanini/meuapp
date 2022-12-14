import { useState, useEffect, createContext } from "react";
import firebase from '../services/firebaseConnection';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({ children }){
  const [ user, setUser] = useState(null);
  const [ loadingAuth, setLoadingAuth ] = useState(false);
  const [ loadingApp, setLoadingApp ] = useState(true);

  useEffect(()=>{

    function loadStorage(){
      const storageUser = localStorage.getItem('SistemaUser');

    if(storageUser){
      setUser(JSON.parse(storageUser));
      setLoadingApp(false);
    }

    setLoadingApp(false);
    }

    loadStorage();
    
  },[])

  function storageUser(data){
    localStorage.setItem('SistemaUser', JSON.stringify(data));
  }

  async function signIn(email, password){
    setLoadingAuth(true);

    await firebase.auth().signInWithEmailAndPassword(email, password)
    .then(async (value)=>{
      const uid = value.user.uid;

      const userProfile = await firebase.firestore().collection('users')
      .doc(uid).get();

      const data = {
        uid: uid,
        nome: userProfile.data().nome,
        avatarUrl: userProfile.data().avatarUrl,
        email: value.user.email
      };

      setUser(data);
      storageUser(data);
      setLoadingAuth(false);
      toast.success('Bem vindo!')

    })
    .catch((error)=>{
      toast.error('Ops algo deu errado!')
      setLoadingAuth(false);
    })
  }

  async function signUp(email, password, nome){
    setLoadingAuth(true);
    await firebase.auth().createUserWithEmailAndPassword(email, password)
    .then( async (value)=>{
      const uid = value.user.uid;

      await firebase.firestore().collection('users')
      .doc(uid).set({
        nome: nome,
        avatarUrl: null,
      })
      .then(() => {
        const data = {
          uid: uid,
          nome: nome,
          email: value.user.email,
          avatarUrl: null
        };

        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
        toast.success('Bem vindo a plataforma!')
      })
    })
    .catch((error)=>{
      console.log(error);
      toast.error('Ops algo deu errado!')
      setLoadingAuth(false);
    })
  }
  
  async function signOut(){
    await firebase.auth().signOut();
    localStorage.removeItem('SistemaUser');
    setUser(null);
  }

  return(
    <AuthContext.Provider 
    value={{
       signed: !!user,
       user,
       loadingApp,
       signUp,
       signOut,
       signIn,
       loadingAuth,
       setUser,
       storageUser
      }}
       >
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;