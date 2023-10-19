import React, { useState, useEffect } from 'react';
import {
  Modal,
  Fade,
  Box,
  Typography,
  FormControl,
} from '@mui/material';
import axios from 'axios';
const UpdateForm = ({ user, open, onClose, onUpdate, initialStep }) => {
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const [updatedImage, setUpdatedImage] = useState(null);
  const [step, setStep] = useState(initialStep || 1);
  const [modalOpen, setModalOpen] = useState(open);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  useEffect(() => {
    setModalOpen(open);
  }, [open]);
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setUpdatedImage(imageFile);
  
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(imageFile);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 2) {
      const formData = new FormData();
      formData.append('image', updatedImage);
      formData.append('userName', updatedUser.userName);
      formData.append('address', updatedUser.address);
      formData.append('phone', updatedUser.phone);
      formData.append('email', updatedUser.email);

      onUpdate(formData);
    } else {
      setStep(step + 1);
    }
  };

  // Nouvel état pour les villes en fonction du pays sélectionné
  const [countriesWithCities, setCountriesWithCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setSelectedCountry(selectedCountry);
  };


const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    setSelectedCity(selectedCity);
    
    // Mettre à jour l'adresse de l'utilisateur avec le pays et la ville sélectionnés
    const updatedAddress = `${selectedCountry}, ${selectedCity}`;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      address: updatedAddress,
    }));
  };
  
  

  // Fetch the countries and cities data from the backend and set it to the state
  useEffect(() => {
    const fetchCountriesWithCities = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/utils/citiesByCountryweb`);
        if (response.status === 200) {
          const countriesWithCitiesData = response.data;
          // Set the data to the state
          setCountriesWithCities(countriesWithCitiesData);
        }
      } catch (error) {
        console.error('Error fetching countries with cities:', error);
      }
    };
    fetchCountriesWithCities();
  }, []);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
            <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 600,
              height: 600,
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
            }}
          >
            <Typography variant="h6" component="h2">
              Mise à jour du profil - Étape {step}
            </Typography>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreviewUrl && (
              <img
                src={imagePreviewUrl}
                alt="Sélectionnée"
                style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
              />
            )}
            <button
              type="button"
              name="prev"
              className="btn btn-secondary w-100 mt-6 rounded-pill"
              onClick={handleSubmit}
            >
              Suivant
            </button>
          </Box>
        );
      case 2:
        return (
            <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 600,
              height: 600,
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
            }}
          >
              <Typography variant="h6" component="h2">
              Mise à jour du profil - Étape {step}
            </Typography>
          <form onSubmit={handleSubmit}>

            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px', position: 'relative' }}>
    <label htmlFor="userName" className="form-label">Username:</label>
    <div style={{ position: 'relative' }}>
        <i
            className="fa fa-cutlery" // Utilisez une classe appropriée pour l'icône de restaurant, par exemple "fa fa-cutlery" si disponible dans Font Awesome
            aria-hidden="true"
            style={{ position: 'absolute', top: '50%', left: '10px', color: '#044494', transform: 'translateY(-50%)' }}
        ></i>
        <input
            className="form-control"
            required={true}
            style={{ paddingLeft: '30px' }}
            type="text"
            name="userName"
             value={updatedUser.userName}
                onChange={handleInputChange}
        />
    </div>
</div>


<div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px', position: 'relative' }}>
    <label htmlFor="phone" className="form-label">Phone:</label>
    <div style={{ position: 'relative' }}>
        <i
            className="fa fa-cutlery" // Utilisez une classe appropriée pour l'icône de restaurant, par exemple "fa fa-cutlery" si disponible dans Font Awesome
            aria-hidden="true"
            style={{ position: 'absolute', top: '50%', left: '10px', color: '#044494', transform: 'translateY(-50%)' }}
        ></i>
        <input
            className="form-control"
            required={true}
            style={{ paddingLeft: '30px' }}
            type="text"
            name="phone"
             value={updatedUser.phone}
                onChange={handleInputChange}
        />
    </div>
</div>


<div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px', position: 'relative' }}>
    <label htmlFor="address" className="form-label">adresse:</label>
    <div style={{ position: 'relative' }}>
        <i
            className="fa fa-map-marker" // Utilisez une classe appropriée pour l'icône d'adresse, par exemple "fa fa-map-marker" si disponible dans Font Awesome
            aria-hidden="true"
            style={{ position: 'absolute', top: '50%', left: '10px', color: '#044494', transform: 'translateY(-50%)' }}
        ></i>
        <input
            className="form-control"
            required={true}
            style={{ paddingLeft: '30px' }}
            type="text"
            name="address"
            value={updatedUser.address}
            onChange={handleInputChange}
        />
    </div>
</div>
<div style={{ display: 'flex', marginBottom: '10px' }}>
  {/* Afficher le menu déroulant pour les pays */}
  <select
    className="form-control"
    name="country"
    value={selectedCountry}
    onChange={handleCountryChange}
    style={{ marginRight: '10px', width: '150px' }}
  >
    <option value="">Sélectionner un pays</option>
    {countriesWithCities.map((countryObject) => (
      <option key={countryObject.country} value={countryObject.country}>{countryObject.country}</option>
    ))}
  </select>

  {/* Afficher le menu déroulant pour les villes en fonction du pays sélectionné */}
  {selectedCountry && (
    <select
      className="form-control"
      name="city"
      value={selectedCity}
      onChange={handleCityChange}
      style={{ width: '150px' }}
    >
      <option value="">Sélectionner une ville</option>
      {countriesWithCities.find((countryObject) => countryObject.country === selectedCountry)?.cities.map((city) => (
        <option key={city} value={city}>{city}</option>
      ))}
    </select>
  )}
</div>
          
            <button
  type="submit"
  className="btn btn-secondary w-100 mt-6 rounded-pill"
>
Mise à jour
</button>

<button
  type="button"
  name="prev"
  className="btn btn-secondary w-100 mt-6 rounded-pill"
  onClick={handlePreviousStep}
>
  Previous
</button>
<button
  type="button"
  name="cancel"
  className="btn btn-secondary w-100 mt-6 rounded-pill"
  onClick={onClose} // Déclencher la fonction handleClose
  style={{
    backgroundColor: "#cb75cb",
    color: "white"
  }}
>
Cancel
</button>
          </form>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {renderStepContent()}
    </Modal>
  );
};

export default UpdateForm;
