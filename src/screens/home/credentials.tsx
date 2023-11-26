import { AuthContext } from 'auth'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { auth } from '../../firebase'
import React, {useContext, useState} from 'react'
import Form from 'screens/contents/components/cred/form'
import { Header } from 'screens/contents/components/gen/header'
import Navbarmenu from 'screens/contents/components/gen/navigator/navbarmenu'

type Props = {}

export default function Credentials({}: Props) {

  const {currentUser} = useContext(AuthContext)
  const [confirmpassword , setconfirmpassword] = useState('')
  const [currentpassword, setcurrentpassword] = useState('')
  const [newpassword, setnewpassword] = useState('')
  const [loading, setloading] = useState(false)

   const updatepassword = async () => {
    setloading(true)
    try {
      const currentuser = auth.currentUser;

      if (!currentuser) {
        console.error("User is not authenticated.");
        return;
      }

      const credential = EmailAuthProvider.credential(currentUser?.email || '', currentpassword);
      await reauthenticateWithCredential(currentuser,credential);

      await updatePassword(currentuser,newpassword).then(() => {
          setloading(false)
          alert('Password successfully changed!')
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })

    } catch (error: any) {
      console.error("Error updating password:", error.message);
      setloading(false)
    }
  };

  return (
    <div className='container'>
     {loading && 
        <div className="loading-modal">
          <div className="loading-content">
            <div className="spinner"></div>
              <p>Loading...</p>
          </div>
        </div>}
      <Header menu={Navbarmenu}/>
      <Form 
        onConfirmPasswordChange={(e) => setconfirmpassword(e)}
        onNewPasswordChange={(e) => setnewpassword(e)}
        onCurrentPasswordChange={(e) => setcurrentpassword(e)}
        confirmPassword={confirmpassword}
        newPassword={newpassword}
        currentPassword={currentpassword}
      />
      <div className='button-container'>
      <button onClick={updatepassword}>Update</button>
      </div>
    </div>
  )
}