import React,{useState, useEffect, useContext} from 'react'
import '../../styles/component.css'
import NavBarItems from './navigator/navbaritems';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from 'auth';

import { signOut } from 'firebase/auth';
import { auth } from '../../../../firebase/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
type Props = {
  menu: any,
}

export const Header: React.FC<Props> = ({menu}) => {
  const [active, setActive] = useState(1);
  const location = useLocation();
  const navigate = useNavigate()
  const {currentUser} = useContext(AuthContext)
  
      const __navigate = (id: number) => {
        setActive(id);
    }

   useEffect(() => {
        menu.forEach((element: any) => {
            if (location.pathname === element.path) {
                setActive(element.id);
            }
        });
    }, [location.pathname])


  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position: any) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (error) => {
            console.error('Error getting user location:', error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    const getReverseGeocoding = async () => {
      if (latitude !== null && longitude !== null) {
        const reverseGeocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

        try {
          const response = await fetch(reverseGeocodingUrl);
          if (response.ok) {
            const data = await response.json();
            const { address } = data;
            const city = address.city || address.town || address.village;
            const state = address.county || address.state;
            setCity(city);
            setState(state);
          } else {
            console.error('Reverse geocoding request failed.');
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
        }
      }
    };

    getReverseGeocoding();
  }, [latitude, longitude]);

  return (
    <div className="header">
      <div className="left">
      
      <span onClick={() => navigate('/admin/dashboard')} className="app-name">
      {city &&<FontAwesomeIcon icon={faLocationDot} style={{color: 'red', marginRight: 10, width: 25, height: 25}} />}
      {city  ?`${city}, ${state}` : 'Incident Reporting System'}</span>
      </div>
      <div className="right">
        {menu.map((item: any, index: number) =>(
          <div key={index}  onClick={() => __navigate(item.id)}>
                                    <NavBarItems
                                        active={item.id === active}
                                        item={item} />
                                </div>
        ))}
       <img 
        src={currentUser?.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png?20220226140232'} 
        alt="Profile" 
        className="profile-image"
        onClick={() => navigate('/admin/profile')}
       />
      </div>
    </div>
  );
}