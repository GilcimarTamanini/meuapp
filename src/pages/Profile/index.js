import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import avatar from '../../assets/avatar.png';
import firebase from '../../services/firebaseConnection';

import { AuthContext } from '../../contexts/auth';
import { useContext, useState } from 'react';

import { FiSettings, FiUpload } from 'react-icons/fi';


export default function Profile(){
  const { 
    user,
    signOut, 
    setUser, 
    storageUser } = useContext(AuthContext);

  const [nome, setNome] = useState(user && user.nome);
  const [email, setEmail] = useState(user && user.email);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imgAvatar, setImgAvatar] = useState(null);

  function handleFile(e){

    if(e.target.files[0]){
      const image = e.target.files[0];

      if(image.type === 'image/jpeg' || image.type === 'image/png'){
        setImgAvatar(image);
        setAvatarUrl(URL.createObjectURL(e.target.files[0]))
      }else{
        alert('Envia uma imagem do tipo JPEG ou PNG');
        setImgAvatar(null);
        return null;
      }
    }

  }

  async function handleUpload(){
    const currentUid = user.uid;

    const uploadTask = await firebase.storage()
    .ref(`images/${currentUid}/${imgAvatar.name}`)
    .put(imgAvatar)
    .then(async ()=>{
      await firebase.storage().ref(`images/${currentUid}`)
      .child(imgAvatar.name).getDownloadURL()
      .then(async (url)=>{
        const urlFoto = url;

        await firebase.firestore().collection('users')
        .doc(user.uid)
        .update({
          avatarUrl: urlFoto,
          nome: nome
        })
        .then(()=>{
          const data = {
            ...user,
            avatarUrl: urlFoto,
            nome: nome
          };

          setUser(data);
          storageUser(data);
        })
      })
    })

  }

  async function handleSave(e){
    e.preventDefault();

    if(imgAvatar === null && nome !== ''){
      await firebase.firestore().collection('users')
      .doc(user.uid)
      .update({
        nome: nome
      })
      .then(()=>{
        const data = {
          ...user,
          nome: nome
        };

        setUser(data);
        storageUser(data);

      })
    }
    else if(imgAvatar !== null && nome !== ''){
      handleUpload();
    }

  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title nome="Meu perfil">
          <FiSettings size={25}/>
        </Title>


        <div className="container">
          <form className="form-profile" onSubmit={handleSave}>
            <label className="label-avatar">
              <span>
                <FiUpload color="#FFF" size={25} />
              </span>

            <input 
              type="file" 
              accept="image/*"
              onChange={handleFile}
            />
            <br/>
            { avatarUrl === null ?
              <img src={avatar} width="250" alt="Sua foto do perfil"/>
              :
              <img src={avatarUrl} width="250" alt="Sua foto do perfil"/>
            } 

            </label>

            <label>
              Nome
            </label>
            <input type="text" 
              value={nome}
              onChange={ (e) => setNome(e.target.value) }
            />

            <label>
              Email
            </label>
            <input type="text" 
              value={email}
              disabled={true}
            />

            <button>
              Salvar
            </button>
          </form>
        </div>
      
        <div className="container">
          <button className="logout-btn" 
            onClick={ () => {signOut()}}
          >
            Sair
          </button>
        </div>      

      </div>

    </div>
  )
}
