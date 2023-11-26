import { AuthContext } from 'auth';
import { auth, db, storage } from '../../firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import React, { useContext, useState, useRef } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile, User } from 'firebase/auth'; // Import User type
import { Header } from 'screens/contents/components/gen/header';
import Navbarmenu from 'screens/contents/components/gen/navigator/navbarmenu';

type Props = {};

export default function ChangePhoto({}: Props) {
  const { currentUser } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState(currentUser?.displayName);
  const [email, setEmail] = useState(currentUser?.email);
  const [photo, setPhoto] = useState<string | null>(currentUser?.photoURL || null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async () => {
    if (!fileInputRef.current || !fileInputRef.current.files) return;

    const selectedFile = fileInputRef.current.files[0];
    if (!selectedFile) return;

    try {
      setLoading(true);
      const currentuser: User | null = auth.currentUser || null;

      if (!currentuser) {
        console.error("User is not authenticated");
        return;
      }

      const storageRef = ref(storage, `images/${selectedFile.name}`);
      await uploadBytes(storageRef, selectedFile);

      const imageURL = await getDownloadURL(storageRef);

      await updateProfile(currentuser, {
        displayName: displayName,
        photoURL: imageURL,
      });

      const userDataRef = doc(db, 'user', currentuser?.uid || '');
      const updateinfo = {
        username: displayName,
        email: email,
        photoURL: imageURL,
        userType: 'Admin',
      };
      await setDoc(userDataRef, updateinfo);

      // Set the photo URL to display the uploaded image
      setPhoto(imageURL);

      setLoading(false);
      alert('Successfully updated profile');

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileInputChange = () => {
    if (fileInputRef.current && fileInputRef.current.files) {
      const selectedFile = fileInputRef.current.files[0];
      if (selectedFile) {
        setPhoto(URL.createObjectURL(selectedFile));
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    try {
      if (event.dataTransfer.files.length > 0) {
        const selectedFile = event.dataTransfer.files[0];
        if (selectedFile) {
          setPhoto(URL.createObjectURL(selectedFile));
          fileInputRef.current!.files = event.dataTransfer.files;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const preventDefault = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
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
      <div className="changephotocontainer">
        <div>
          <p>Choose Photo to upload</p>
          <label>
            Browse
            <input
              type="file"
              ref={fileInputRef}
              accept=".jpeg, .jpg, .png"
              style={{ display: 'none', marginLeft: 20}}
              onChange={handleFileInputChange}
            />
          </label>
        </div>
      </div>
      <div
        className="changephotocontainer drag"
        onDrop={handleDrop}
        onDragOver={preventDefault}
      >
        {photo && <img src={photo} alt="Selected" />}
        <p>Drag and drop photo here</p>
        
      </div>
      <div className="button-container">
        <button onClick={handleImageUpload}>
          Upload
        </button>
      </div>
    </div>
  );
}
