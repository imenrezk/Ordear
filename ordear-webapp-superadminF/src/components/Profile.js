
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import { useCookies } from 'react-cookie';
import UpdateForm from './UpdateForm'; // Make sure to provide the correct path
import { Toast, Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const UserProfile = () => {
  const [user, setUser] = useState({});
  const [cookies] = useCookies(['tokenLogin']);
  const [imageURL, setImageURL] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [image,setImage]= useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
    // const handleOpenPassword = () => setOpenPassword(true);
    // const handleClosePassword = () => setOpenPassword(false);
      
    const [step, setStep] = useState(1); // Initialiser l'étape à 1

    const navigate= useNavigate();

    const handleOpen = () => {
      setShowUpdatePopup(true); // Ouvrir le composant UpdateForm
      setStep(1); // Initialiser l'étape à 1 lorsque le pop-up s'ouvre
    };
  
    const handleClose = () => {
      setShowUpdatePopup(false); // Fermer le composant UpdateForm
    };
  
  useEffect(() => {
    if (showUpdatePopup) {
      setStep(1); // Mettre à jour l'étape à 1 lorsque le pop-up s'ouvre
    }
  }, [showUpdatePopup]);    
      
      
  const styles = {
    imageUpload: {
        position: 'relative',
        width: '40px',
        height: '40px',
        margin: '0 auto',
    },
    profileImage: {
        width: '25%',
        height: '25%',
        objectFit: 'cover',
        borderRadius: '50%',
        border: '2px solid #fff',
    },
    fileInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '40%',
        height: '40%',
        opacity: 0,
        cursor: 'pointer',
    },
};

const fetchData = async () => {
  try {
    const response = await axios.get('/user/getUser', {
      headers: {
        Authorization: `Bearer ${cookies.tokenLogin}`,
      },
    });

    setUser(response.data[0]);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};
  useEffect(() => {
   

   // if (cookies.tokenLogin) {
      
   // }
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const response = await axios.get('/user/getImage', {
          headers: {
            Authorization: `Bearer ${cookies.tokenLogin}`,
          },
          responseType: 'blob',
        });

        const imageURL = URL.createObjectURL(response.data);
        setImageURL(imageURL);
      } catch (error) {
        console.error('Error fetching user image:', error);
      }
    };

    if (user && user.image) {
      fetchUserImage();
    }
  }, [user, cookies.tokenLogin,refreshTrigger]);



const handleUpdate = async (updatedData) => {
    try {
      await axios.put(`/user/updateUserAdmin/${user._id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${cookies.tokenLogin}`,
          'Content-Type': 'multipart/form-data', // Définir le type de contenu pour le téléchargement de fichiers
        },
      });
      setUser(updatedData);
        toast.success('mise a jour effectuer avec success');
        navigate("/profilResponsable");
        fetchData();
      setShowUpdatePopup(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des données ');
      console.error('Erreur lors de la mise à jour des données utilisateur :', error);
    }
  };

  
  
  
 

 
  return (<>
 
    <Sidebar />
    <Toaster/>
        <main>

            <section className=" section  ">
                <div className="separator separator-bottom separator-skew">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        version="1.1"
                        viewBox="0 0 2560 100"
                        x="0"
                        y="0"
                    >
                        <polygon className="fill-blue" points="2560 0 2560 100 0 100" fill="#cb75cb" />
                    </svg>
                </div>
            </section>

            <section className="section">
                <div className="card mb-3" >
                    <div className="row g-0">
                        <div className="col-md-4">
                        </div>
                        <div className="col-md-8">

                            <div className="card-body">
                                <h2 className="card-title">Profile card</h2>
                                <br />
                                <div>

                                <img src={imageURL} alt="User Profile"  className="profile-image" style={styles.profileImage} />
                              
                                </div>

                                <br />
                                <br />
                                <br />
                                <br />

                                <p className="card-text"> Username : {user.userName}</p>
                                <p className="card-text">Email :     {user.email}</p>
                                <p className="card-text">Phone :     {user.phone}</p>
                                <p className="card-text">Role :  {user.role}   </p>
                                <p className="card-text">Address :    {user.address}</p>
                                <br />
                           
      <button
        type="button"
        className="btn btn-primary mt-4 rounded-pill"
        onClick={handleOpen}
        style={{ marginRight: '5px' }}
      >
        Mise à jour
      </button>

      {/* Contenu de la mise à jour (pop-up) */}
      {showUpdatePopup && (
  <UpdateForm
    user={user}
    open={showUpdatePopup}
    onClose={handleClose}
    onUpdate={handleUpdate}
    initialStep={step} // Passer la valeur de step comme initialStep
  />
)}
        
       
        
                            

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            </main>
                                       </> )
};

export default UserProfile;
