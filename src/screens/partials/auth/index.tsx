import { collection, getDocs } from '@firebase/firestore';
import { auth, db } from '../../../firebase';
import React, { useContext, useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css'
import { AuthContext } from 'auth';
import { logindata } from 'types/interfaces';
export default function Login({}) {

  const [loginemail, setloginEmail] = useState('');
  const [loginpassword, setloginPassword] = useState('');
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate()
    useEffect(() => {
   const getUserData = async () => {
  try {

    const querySnapshot = await getDocs(collection(db, 'user'));
    querySnapshot.forEach((doc: any) => {
      // console.log(doc.id, ' => ', doc.data());
    });
  } catch (error) {
    console.log(error);
    console.log('Error getting user documents: ', error);
  }
};

getUserData();
  if(currentUser != null){
    navigate("/admin/dashboard");
  }
  }, [currentUser]);

  const checkStatus = async (e: any) => {
    e.preventDefault()
    const querySnapshot = await getDocs(collection(db, "user"));
    const userData: logindata[] = [];
  
    querySnapshot.forEach((doc) => {
      if (doc.data().email === loginemail) {
        userData.push({
            email: doc.data().email,
            agencyname: doc.data().fullname, 
            contactnumber: doc.data().password,
            photoURL: doc.data().photoURL,
            type: doc.data().type,
            userType: doc.data().userType,
            uid: doc.data().uid,
            username: doc.data().username,
        });
      }
    });
  
    if (userData.length > 0) {
      const isAdmin = userData.some((user) => user.userType === "Admin");
      console.log(isAdmin);
      if (isAdmin) {
        const email = loginemail;
        const password = loginpassword;
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/admin/dashboard");
      } else {
        alert("The provided email does not belong to an admin user.");
      }
    } else {
      alert("no matches found with the email and password provided.");
    }
  };


  return (
    <div className='container'>
      <div className='inner-container'>
         <div className='image-container'>
          <img />
        </div>
        <div className='login-container'>
          <div className='login-input-container'>
        <input 
          placeholder='email address'
          onChange={(e) => setloginEmail(e.target.value)}
        />
        <input 
          placeholder='password'
          onChange={(e) => setloginPassword(e.target.value)}
          type='password'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              checkStatus(e);
            }
          }}
        />
        <button type='submit' onClick={checkStatus}>Login</button>
         </div>
         </div>
      </div>
    </div>
  )
}