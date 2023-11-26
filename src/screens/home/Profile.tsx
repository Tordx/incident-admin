import { AuthContext } from 'auth';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Header } from 'screens/contents/components/gen/header';
import Navbarmenu from 'screens/contents/components/gen/navigator/navbarmenu';

type Props = {};

export default function Profile({}: Props) {
  const { currentUser } = useContext(AuthContext);
	const navigate = useNavigate()


	const signOutUser = async () => {
		try {
				await signOut(auth);
				navigate('/login')
				console.log("User signed out successfully.");
			} catch (error) {
				// Handle any errors here
				console.error("Error signing out:", error);
			}
		};
	

  return (
    <div className='container'>
      <Header menu={Navbarmenu} />
			<div className='outer-profile'>
				<div className='inner-profile'>
				
					<div className='padding-profile'>
						<div className='profile-container'>
							<div className='profile-info'>
								<div className='profile-photo'>
									<img
										src={currentUser?.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/660px-No-Image-Placeholder.svg.png?20200912122019'} // Replace with the actual URL from Firebase
										alt='Profile'
										className='profileimg'
									/>
								</div>
								<div className='profile-name'>{currentUser?.displayName || 'No Name'}</div>
							</div>
						</div>
				<div className='menu'>
					<div>

						<p>Manage</p>
						<Link to='/admin/changephoto' className='menu-item'>
							Update Photo
						</Link>
						<Link to='/admin/credentials' className='menu-item'>
							Update Credentials
						</Link>
					</div>
					<br />
				</div>

					<button className='menu-item' onClick={signOutUser}>Logout</button>
					<Link to = '/' className='back-button' >
					close
					</Link>
					</div>
				</div>
			</div>
    
    </div>
  );
}