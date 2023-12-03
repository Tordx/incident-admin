import { AuthError, confirmPasswordReset, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../firebase/index';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {}

export const ForgotPassword = (props: Props) => {

	const [loginemail, setloginEmail] = useState('');
	const navigate = useNavigate()

	const handleReset = async() => {
		console.log('clicking?')
		try {
			await sendPasswordResetEmail(auth, loginemail).then((success: any) => {
				alert('Password Reset Link sent Successfuly!');
				navigate('/login')
			})
		} catch(err: any){
			console.log('error?' + err)
			if(err == 'FirebaseError: Firebase: Error (auth/invalid-email).') {
				alert('That is not an email address')
			}
			if(err == 'FirebaseError: Firebase: Error (auth/user-not-found).') {
				alert('Email not found')
			}
			if(err == 'FirebaseError: Firebase: Error (auth/too-many-requests).') {
				alert('You sent to many request, try again in a few.')
			}
		}
	}

  return (
    <div className='container'>
      <div className='forgotpassword'>
				<strong>Forgot Password</strong>
				<br/>
        <input 
						placeholder='email address'
						onChange={(e) => setloginEmail(e.target.value)}
					/>

				<button onClick={() => handleReset()}>Reset Password</button>
				</div>
    </div>
  )
}