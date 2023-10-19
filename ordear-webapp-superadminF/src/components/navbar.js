import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import addImage from '../images/ajouter.png';

import avatar from "../images/avatar.png";

import desactiver from "../images/desactiver.png";
import activer from "../images/oui.png";
import update from "../images/editer.png";
import eye from "../images/vision .png";
import Axios from 'axios';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';

import 'react-toastify/dist/ReactToastify.css'; 

import axios from 'axios'; // Si vous utilisez Axios
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Style.css';
import tw, { styled } from "twin.macro";
import { Toast, Toaster, toast } from 'react-hot-toast';
import Restaurant from './Restaurant';
import {Switch} from "antd";
import 'antd/dist/reset.css';

    const Example = () => {
        const [user, setUser] = useState({
          userName: '',
          phone: '',
          email: '',
          userName: "",
          address:"",
          birthday:"",
          activate:"",
          role:"",
          restaurantFK:"",
        });
      
        const [restaurant, setRestaurant] = useState({
          nameRes: '',
          address: '',
          taxeTPS: '',
          cuisineType: '',
          taxeTUQ: '',
        });
      
        const handleChangeUser = (e) => {
          const { name, value } = e.target;
          setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
          }));
        };
    const [open, setOpen] = useState(false);
   
    
    
   
    const [msg, setMsg] = useState("");
    const [employees, setEmployees] = useState([]);
    const [color, setColor] = useState("");
    const [style, setStyle] = useState({});
    const [roleFilter, setRoleFilter] = useState(null);
  
    const [filteredResults, setFilteredResults] = useState([]);
    const [searchInput, setSearchInput] = useState('');

  
    const [step, setStep] = useState(1); // Current step of the form
 
    
    const handleNextStep = () => {
        if (step < 2) {
          setStep((prevStep) => prevStep + 1);
        } else {
          // Form submission logic
          handleSubmit();
        }
      };
    
      const handlePreviousStep = () => {
        if (step > 1) {
          setStep((prevStep) => prevStep - 1);
        }
      };
      const redStyle = { color: "red", fontWeight: "bold" };
      const greenStyle = { color: "green", fontWeight: "bold" };
  const [responsables, setResponsables] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const phonePattern = /^\d{8}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
  

  
    
 
        
  
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    
    const handleChangeR = (e) => {
        setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
      };
   
 // Fonction pour afficher tous les utilisateurs
 const handleShowAll = () => {
    setRoleFilter(null);
  };
   
      const handleRoleFilter = (role) => {
        setRoleFilter(role === "client" ? null : role); // If the role is "client", set roleFilter to null, otherwise set it to the selected role
      };
    
      const filteredEmployees = roleFilter
  ? employees.filter((employee) => employee.role === roleFilter && employee.role !== "client")
  : employees.filter((employee) => employee.role !== "client");



  
   const [formData, setFormData] = useState({
    userName: '',
  
    email: '',
    phone: '',
    address: '',
    nameRes: '',
    address: '',
    cuisineType: '',
    sousCuisine: '', 
    taxeTPS: '',
    taxeTUQ: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    let error;
    event.preventDefault();
    if (
      !formData.userName ||
     
      !formData.email ||
      !formData.phone ||
      !formData.nameRes ||
      !formData.address ||
      !formData.cuisineType ||
      !formData.taxeTPS ||
      !formData.taxeTUQ
    ) {
     
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
 
    const tps = parseFloat(formData.taxeTPS);
    const tuq = parseFloat(formData.taxeTUQ);
    if (isNaN(tps) || isNaN(tuq)) {
    
      toast.error("Les champs Taxe TPS et Taxe TUQ doivent être des nombres valides.");
      return;
    }
  // Vérification du format du numéro de téléphone avec une expression régulière
  const phonePattern = /^\d{8}$/;
  if (!phonePattern.test(formData.phone)) {
   
    toast.error("Veuillez saisir un numéro de téléphone valide (8 chiffres).");
    return;
  }
    
  

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/addRestaurantsuper`, {
        method: 'POST',
        credentials:"include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      toast.success('Le formulaire a été soumis avec succès et consulter votre mail ');

     
      // Handle success, show a success message, redirect, etc.
    } catch (error) {
      console.error(error);
      // Handle error, show an error message, etc.
      
      setFormData({
        userName: '',
     
        email: '',
        phone: '',
        nameRes: '',
        address: '',
        cuisineType: '',
        taxeTPS: '',
        taxeTUQ: '',
      });
     
      toast.error('Une erreur est survenue lors de la soumission du formulaire.');
     
    }}



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
    setFormData((prevFormData) => ({
      ...prevFormData,
      address: `${selectedCountry}, ${selectedCity}`,
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


    const disableEmployeeAccount = async (id) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/disableEmployeeAccount/${id}`, {
          method: 'PUT',
          credentials:"include",
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        const data = await response.json();
        if (response.ok) {
          setMsg(data.message);
          toast.success('Responsable est disabled');
          setColor('green'); // Afficher un message de succès en vert (optionnel)
        } else {
          setMsg('Erreur : ' + data.message);
          setColor('red'); // Afficher un message d'erreur en rouge (optionnel)
        }
      } catch (error) {
        setMsg('Erreur : ' + error.message);
        setColor('red'); // Afficher un message d'erreur en rouge (optionnel)
      }
    };
    
// Ajoutez ces deux états pour gérer l'ouverture et la fermeture du pop-up
const [popupEmployeeId, setPopupEmployeeId] = useState(null);
const [showPopup, setShowPopup] = useState(false);

// La fonction handleOpen affiche le pop-up

const handleOpendes = (employeeId) => {
  setPopupEmployeeId(employeeId);
  setShowPopup(true);

  // Add this code to set the transparent class for the row
  const rows = document.querySelectorAll("tr");
  rows.forEach((row) => {
    row.classList.remove("transparent-row");
  });
  const selectedRow = document.querySelector(`tr[data-id="${employeeId}"]`);
  selectedRow.classList.add("transparent-row");
};


// La fonction handleClose ferme le pop-up
const handleClosedes = () => {
  setPopupEmployeeId(null);
  setShowPopup(false);
};

const enableEmployeeAccount = async (id ) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/enableEmployeeAccount/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (response.ok) {
      setMsg(data.message);
      toast.success('Responsable  est activé');
      setColor('green'); // Display success message in green (optional)
    } else {
      setMsg('Erreur : ' + data.message);
      setColor('red'); // Display error message in red (optional)
    }
  } catch (error) {
    setMsg('Erreur : ' + error.message);
    setColor('red'); // Display error message in red (optional)
  }
};
const handleEnable = (employeeId) => {
  setPopupEmployeeId(employeeId);
  setShowPopup(true);
};


console.log(filteredEmployees)

const [isPopupVisible, setPopupVisible] = useState(false);
const handleTogglePopup = async (id) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/getByIdRes/${id}`);
    const employeeData = response.data;

    setUser(employeeData.user);
    setRestaurant(employeeData.restaurant);

    setPopupVisible(true); // Always set to true to show the popup
    toast.success('Detail responsable ');
  } catch (error) {
    console.error(error);
  }
};

const handleBackButtonClick = () => {
  setPopupVisible(false); // Set to false to hide the popup when the "Back" button is clicked
};
//pagination 


const ITEMS_PER_PAGE = 5; // Définissez le nombre d'éléments à afficher par page
const [currentPage, setCurrentPage] = useState(1);
const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
const currentItems = responsables.slice(indexOfFirstItem, indexOfLastItem);

// Fonction pour gérer le changement de page
const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
};

function isValidNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}
const navigate = useNavigate();

const handleHistoryDisabledClick = () => {
  navigate('/consulterResponsablesEnable');
};

const handleHistoryDisableClick = () => {
  navigate('/consulterResponsablesdidisabled');
};






const [showForm, setShowForm] = useState(false);



const handleButtonClickk = (responsable) => {
  const restaurantId = responsable.restaurantFK?._id; // Extract restaurant ID
  const userId = responsable._id; // Extract user ID
  setFormData({
    userName: responsable.userName,
    email: responsable.email,
    phone: responsable.phone,
    nameRes:responsable.restaurantFK?.nameRes,
    address:responsable.restaurantFK?.address,
    cuisineType: responsable.restaurantFK?.cuisineType,
    taxeTPS: responsable.restaurantFK?.taxeTPS,
    taxeTUQ: responsable.restaurantFK?.taxeTUQ,
    
  });
  setShowForm(true);
  console.log('Restaurant ID:', restaurantId);
  console.log('User ID:', userId);
};


const imageStyle = {
  width: '20px', // Ajustez la largeur comme souhaité
  height: '20px', // Ajustez la hauteur comme souhaité
  marginRight: '5px', // Ajoutez un espacement à droite pour séparer l'image du texte
};

const [cuisines, setCuisines] = useState([]);

const [selectedSubCuisines, setSelectedSubCuisines] = useState([]);

const handleChangee = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};



const [showUpdateForm, setShowUpdateForm] = useState(false);
const [selectedResponsable, setSelectedResponsable] = useState(null);
const [currentStep, setCurrentStep] = useState(1);
const [showUpdatePopup, setShowUpdatePopup] = useState(false);

const handleUpdateClick = (responsable) => {
  const restaurantId = responsable.restaurantFK ? responsable.restaurantFK.id : null;

  setFormData({
    userName: responsable.userName,
    email: responsable.email,
    phone: responsable.phone,
    address: responsable.address,
    nameRes: responsable.restaurantFK?.nameRes || '',
    cuisineType: responsable.restaurantFK?.cuisineType || '',
    taxeTPS: responsable.restaurantFK?.taxeTPS || '',
    taxeTUQ: responsable.restaurantFK?.taxeTUQ || '',
  });

  // Set the selected responsable in the state
  setSelectedResponsable(responsable);
  
  // Mettez à jour l'état pour afficher le popup
  setShowUpdatePopup(true);
};



const handleFormUpdate = async (responsable) => {
  try {
    const restaurantId = responsable.restaurantFK?._id;
    const userId = responsable._id; // Extract user ID
    const updatedData = {
      userName: formData.userName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      nameRes: formData.nameRes,
      cuisineType: formData.cuisineType,
      taxeTPS: formData.taxeTPS,
      taxeTUQ: formData.taxeTUQ,
    };

    // Make the API call to update data
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/modifyRestaurant/${restaurantId}/${userId}`, {
      method: 'PUT',
      credentials:"include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      // Data updated successfully
      // You can also update the local state with the updated data if needed

      // Hide the update form
      toast.success('Responsable mise a jour avec success');
      setShowUpdateForm(false);
    } else {
      // Handle error response
      const errorData = await response.json();
      console.error('Error updating data:', errorData.message);
      toast.error('Erreur lors de la mise à jour des données de Responsable');
    }
  } catch (error) {
    console.error('Error updating data:', error.message);
  }
};



useEffect(() => {
  const fetchData = async () => {
    // Fetch or update your data source here, for example:
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/getAllResponsable`);
    const data = await response.json();
    // Assuming the fetched data is stored in the `responsables` state variable, update it:
    setResponsables(data);
  };

  fetchData(); // Call the fetchData function when the component mounts and whenever refreshTrigger changes.
}, [refreshTrigger,enableEmployeeAccount,disableEmployeeAccount]);

///////Search//////
const searchItems = (searchValue) => {
  setSearchInput(searchValue);

  if (searchValue !== '') {
    const filteredData = responsables.filter((responsable) => {
      const searchableFields = ['userName', 'email', 'phone'];
      return searchableFields.some((field) =>
      responsable[field]?.toLowerCase().includes(searchValue.toLowerCase())
      );
    });

    if (filteredData.length === 0) {
      // Afficher le toast en cas de recherche sans résultat
      toast.info("Not found ! ", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }

    setFilteredResults(filteredData);
  } else {
    setFilteredResults([]); // Réinitialiser les résultats filtrés s'il n'y a pas de recherche.
  }
};

const [employeeStates, setEmployeeStates] = useState({});
const handleToggleEmployeeAccount = async (id, isEnabled) => {
    try {
        if (isEnabled) {
            await enableEmployeeAccount(id);
        } else {
            await disableEmployeeAccount(id);
        }

        // Mettre à jour l'état local et le stockage local
        setEmployeeStates(prevStates => ({
            ...prevStates,
            [id]: isEnabled
        }));

        localStorage.setItem('employeeStates', JSON.stringify({
            ...employeeStates,
            [id]: isEnabled
        }));
    } catch (error) {
        toast.error('Failed to toggle Responsable account:', error);
        // Handle the error, e.g., display an error message to the user
    }
};
const [cuisineData, setCuisineData] = useState({});


useEffect(() => {
  fetch(`${process.env.REACT_APP_BACKEND_URL}/user/utils/typecuisine`)
    .then(response => response.json())
    .then(data => setCuisineData(data))
    .catch(error => console.error('Erreur lors du chargement des données :', error));
}, []);

const handleChangeCuisine = event => {
  const { name, value } = event.target;
  setFormData({ ...formData, [name]: value });

  // Mettre à jour également l'état de sousCuisine
  if (cuisineData[value] && Array.isArray(cuisineData[value])) {
    setFormData(prevData => ({
      ...prevData,
      sousCuisine: cuisineData[value][0]
    }));
  }
};




  return (<>
    <Sidebar />
    <Toaster/>
    <div>
      {/* Affichage du message d'erreur ou de succès */}
      {msg && <p style={{ color }}>{msg}</p>}
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="card">
                        <div className="card-header d-flex align-items-center">
                          {/* Use Flexbox here */}
                          <h5>List Responsable</h5>
                          <div className="mr-3" onClick={handleOpen}>
                            <img src={addImage} width="25" height="25" alt="Employee Image" />
                          </div>
                          {/* Boutons de filtre de rôle */}
                  
                        </div>
                   
                      </div>
                      
                      <div className="sidebar-container">
  {/* ... other sidebar content ... */}
  <div className="links-container">
    <p className="link-text" onClick={handleHistoryDisabledClick} style={{ color: '#215cb4', fontWeight: 'bold', border: '1px solid #cb75cb', padding: '5px', margin: '0' }}>
      history enable Responsable
    </p>
    <p className="link-text" onClick={handleHistoryDisableClick} style={{ color: '#215cb4', fontWeight: 'bold', border: '1px solid #cb75cb', padding: '5px', margin: '0' }}>
      history disable Responsable
    </p>
    {/* ... other links ... */}
  </div>
</div>
<div className="main-search">
                                                        <div className="input-group">
                                                            <input type="text" id="m-search" className="form-control"
                                                                   placeholder="Ma Recherche ..."
                                                                   onChange={(e) => searchItems(e.target.value)}/>
                                                           
                                                            <span className="input-group-append ">
                                                        <i className="feather icon-search input-group-text"></i>
                                                    </span>
                                                        </div>
                                                    </div>





                      <div className="card-block table-border-style">
                        <div className="table-responsive">
                          <table className="items-center w-full bg-transparent border-collapse">
                            <thead>
                              <tr>
                              <th
                                                           className={
                                                            "px-4 align-middle  py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                            (color === "light"
                                                                ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                                : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                                        }
                                                            >
                                                                #
                                                            </th>
                                                            <th
                                                                className={
                                                                    "px-4 align-middle  py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                                    (color === "light"
                                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                                                }
                                                            >
                                                                Username
                                                            </th>
                                                           
                                                          
                                                            <th
                                                                className={
                                                                    "px-4 align-middle   py-3  text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                                    (color === "light"
                                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                                                }
                                                            >
                                                                Email
                                                            </th>
                                                          
                                                            <th
                                                                className={
                                                                    "px-4 align-middle   py-3  text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                                    (color === "light"
                                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                                                }
                                                            >
                                                                Phone
                                                            </th>
                                                           
                                                            <th
    className={
        "px-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
        (color === "light"
            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
    }
>
    Activer
</th>
<th
                                                                className={
                                                                    "px-4 align-middle   py-3  text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                                    (color === "light"
                                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                                                }
                                                            >
                                                                nom du restaurant
                                                            </th>
<th
                                                                className={
                                                                    "px-4 align-middle  py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                                    (color === "light"
                                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                                                }
                                                            >
                                                                Actions
                                                            </th>
                                                          
                                                           
                                                            

                                                       

                                                        </tr>
                                                        </thead>  <tbody>
                                                        {filteredResults.map((responsable) => (
                                <tr key={responsable._id} >
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    &nbsp;
                                    <div onClick={() => ""}>
                                      <img src={avatar} width="30" height="30" alt="" />
                                    </div>{" "}
                                    &nbsp;
                                  </td>
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    {responsable.userName}
                                  </td>
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    {responsable.email}
                                  </td>
                                  
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    {responsable.phone}
                                  </td>
                                 
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
      {responsable.activate ? (
        <img src={activer} alt="Activé"  style={imageStyle} />
      ) : (
        <img src={desactiver} alt="Désactivé"  style={imageStyle} />
      )}
    </td>
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
  {responsable.restaurantFK?.nameRes}
</td>

{/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
  
  {responsable.activate ? (
    <button
      style={{
        backgroundColor: '#044494',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        cursor: 'pointer',
      }}
      onClick={() => disableEmployeeAccount(responsable._id)}
    >
      Disable
    </button>
  ) : (
    <button
      style={{
        backgroundColor: '#044494',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        cursor: 'pointer',
      }}
      onClick={() => enableEmployeeAccount(responsable._id)}
    >
      Enable
    </button>
  )}
</td> */}
  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                        <Switch
                                                                            checked={employeeStates[responsable._id]}
                                                                            onChange={isChecked => {
                                                                                handleToggleEmployeeAccount(responsable._id, isChecked);
                                                                                // Afficher des messages de toast si nécessaire
                                                                            }}
                                                                        />
                                                                    </td>

                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    &nbsp;
                                    <div onClick={() => handleTogglePopup(responsable._id)}>
  <img src={eye} width="30" height="30" alt="" />
</div>

                                    &nbsp;
                                  </td>
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
  <button className="icon-button no-border" onClick={() => handleUpdateClick(responsable)}>
    <img src={update} width="30" height="30" alt="Update" />
  </button>
</td>


                               



                                </tr>


                                
                            ))}
                            {currentItems.map((responsable) => (
                                <tr key={responsable._id} >
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    &nbsp;
                                    <div onClick={() =>""}>
                                      <img src={avatar} width="30" height="30" alt="" />
                                    </div>{" "}
                                    &nbsp;
                                  </td>
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    {responsable.userName}
                                  </td>
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    {responsable.email}
                                  </td>
                                  
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    {responsable.phone}
                                  </td>
                                 
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
      {responsable.activate ? (
        <img src={activer} alt="Activé"  style={imageStyle} />
      ) : (
        <img src={desactiver} alt="Désactivé"  style={imageStyle} />
      )}
    </td>
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
  {responsable.restaurantFK?.nameRes}
</td>

{/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">

  {responsable.activate ? (
    <button
      style={{
        backgroundColor: '#044494',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        cursor: 'pointer',
      }}
      onClick={() => disableEmployeeAccount(responsable._id)}
    >
      Disable
    </button>
  ) : (
    <button
      style={{
        backgroundColor: '#044494',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        cursor: 'pointer',
      }}
      onClick={() => enableEmployeeAccount(responsable._id)}
    >
      Enable
    </button>
  )}
</td> */}
<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                        <Switch
                                                                            checked={employeeStates[responsable._id]}
                                                                            onChange={isChecked => {
                                                                                handleToggleEmployeeAccount(responsable._id, isChecked);
                                                                                // Afficher des messages de toast si nécessaire
                                                                            }}
                                                                        />
                                                                    </td>


                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    &nbsp;
                                    <div onClick={() => handleTogglePopup(responsable._id)}>
  <img src={eye} width="30" height="30" alt="" />
</div>

                                    &nbsp;
                                  </td>
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
  <button className="icon-button no-border" onClick={() => handleUpdateClick(responsable)}>
    <img src={update} width="30" height="30" alt="Update" />
  </button>
</td>

                               


                                </tr>
                              ))}
                            



                            </tbody>
                            
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <div className="custom-pagination">
          <button
            className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt; 
          </button>
          {Array.from({ length: Math.ceil(responsables.length / ITEMS_PER_PAGE) }).map((_, index) => (
            <button
              key={index}
              className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={`pagination-button ${currentPage === Math.ceil(responsables.length / ITEMS_PER_PAGE) ? 'disabled' : ''}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(responsables.length / ITEMS_PER_PAGE)}
          >
             &gt;
          </button>
        </div>
      </div>


                          </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
  
        <div className={`popup ${showUpdatePopup && selectedResponsable ? 'active' : ''}`}>
  {currentStep === 1 && (
    <div className="form-container">
      <Typography variant="h5" component="h2">
   Update User Information
            </Typography>
   
      <form >
      

      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px', position: 'relative' }}>
      <label htmlFor="userName" className="form-label">userName:</label>
      <input className={`form-control ${formData.userName === '' ? 'is-invalid' : ''}`} type="text" name="userName" value={formData.userName} onChange={handleChange} required={true}
        style={{ paddingLeft: '30px' }} />
      {formData.userName === '' && <div className="invalid-feedback">Veuillez remplir ce champ.</div>}
      <i className="fa fa-user" aria-hidden="true" style={{ position: 'absolute', top: '40%', left: '10px', color: '#044494', transform: 'translateY(40%)' }}></i>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px', position: 'relative' }}>
      <label htmlFor="phone" className="form-label">phone:</label>
      <div style={{ position: 'relative' }}>
        <i
          className="fa fa-phone"
          aria-hidden="true"
          style={{ position: 'absolute', top: '30%', left: '10px', color: '#044494', transform: 'translateY(-50%)' }}
        ></i>
        <input
          className={`form-control ${formData.phone === '' || !phonePattern.test(formData.phone) ? 'is-invalid' : ''}`}
          required={true}
          style={{ paddingLeft: '30px' }}
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        {formData.phone === '' && <div className="invalid-feedback">Veuillez remplir ce champ.</div>}
        {!phonePattern.test(formData.phone) && <div className="invalid-feedback">Veuillez saisir un numéro de téléphone valide (8 chiffres).</div>}
      </div>
    </div>


     
        <div className="button-container">
        <button
        type="button"
        name="next"
        className="btn btn-primary w-100 mt-6 rounded-pill"
        onClick={() => setCurrentStep(2)}
      >
        Next
      </button>
      
      <button
        type="button"
        name="next"
        className="btn btn-primary w-100 mt-6 rounded-pill"
        onClick={() => setShowUpdatePopup(false)}
      >
        Cancel
      </button>
       
      
        </div>
      </form>
    </div>
  )}

  {currentStep === 2 && (
    <div className="form-container">
         <Typography variant="h5" component="h2">
         Update Restaurant Information
            </Typography>
    
      <form >
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px', position: 'relative' }}>
  <label htmlFor="nameRes" className="form-label">Name Restaurant:</label>
  <div style={{ position: 'relative' }}>
    <i
      className="fa fa-cutlery" // Utilisez une classe appropriée pour l'icône de restaurant, par exemple "fa fa-cutlery" si disponible dans Font Awesome
      aria-hidden="true"
      style={{ position: 'absolute', top: '50%', left: '10px', color: '#044494', transform: 'translateY(-50%)' }}
    ></i>
    <input
      className={`form-control ${formData.nameRes === '' ? 'is-invalid' : ''}`}
      required={true}
      style={{ paddingLeft: '30px' }}
      type="text"
      name="nameRes"
      value={formData.nameRes}
      onChange={handleChange}
    />
    {formData.nameRes === '' && <div className="invalid-feedback">Veuillez remplir ce champ.</div>}
  </div>
</div>
<div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px', position: 'relative' }}>
    <label htmlFor="taxeTPS" className="form-label">TaxeTPS:</label>
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
            name="taxeTPS"
            value={formData.taxeTPS}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
    </div>
</div>
          
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px', position: 'relative' }}>
    <label htmlFor="cuisineType" className="form-label">cuisine Type:</label>
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
            name="cuisineType"
            value={formData.cuisineType}
          onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
        />
    </div>
</div>
       
        <div className="button-container">
        <button
        type="button"
        name="next"
        className="btn btn-primary w-100 mt-6 rounded-pill"
        onClick={() => handleFormUpdate(selectedResponsable)}>Update
      </button>
      <button
        type="button"
        name="next"
        className="btn btn-primary w-100 mt-6 rounded-pill"
        onClick={() => setCurrentStep(1)}>Back
      </button>
      <button
        type="button"
        name="next"
        className="btn btn-primary w-100 mt-6 rounded-pill"
        onClick={() => setShowUpdatePopup(false)}>Cancel
      </button>
    
        </div>
      </form>
    </div>
  )}
</div>


     {isPopupVisible && (
  <div
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999,
      backgroundColor: '#ffffff',
      border: '1px solid #cb75cb',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
    }}
  >
    {/* Avatar */}
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <img src={avatar} width="100" height="100" alt="Avatar" />
    </div>

    {/* User information */}
    <h3>User Information:</h3>
    <p>Username: {user.userName}</p>
    <p>Email: {user.email}</p>
    <p>Phone: {user.phone}</p>
    {/* Add other user fields as needed */}
    
    {/* Restaurant information */}
    <h3>Restaurant Information:</h3>
    <p>Name: {restaurant.nameRes}</p>
    <p>Address: {restaurant.address}</p>
    <p>CuisineType: {restaurant.cuisineType}</p>
    <p>taxeTPS: {restaurant.taxeTPS}</p>
    <p>taxeTUQ: {restaurant.taxeTUQ}</p>
    {/* Add other restaurant fields as needed */}
    
    <button     style={{
        backgroundColor: '#800080',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        cursor: 'pointer',
      }}  onClick={handleBackButtonClick}>Back</button>
      

  </div>
)}
   
        <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Fade in={open}>
      <Box
      sx={{
        ...style,
        width: 500, // Increase the width to make the form larger
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        
      //  overflowY: "scroll", // Utilisez "scroll" pour activer la barre de défilement verticale
       
      }}
      className="modal-content " 
    >
         

         {step === 1 && (
  <form noValidate>
    {/* Step 1 fields */}
    <Typography variant="h5" component="h2">
    Add new Responsable
            </Typography>
  
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px', position: 'relative' }}>
      <label htmlFor="userName" className="form-label">userName:</label>
      <input className={`form-control ${formData.userName === '' ? 'is-invalid' : ''}`} type="text" name="userName" value={formData.userName} onChange={handleChange} required={true}
        style={{ paddingLeft: '30px' }} />
      {formData.userName === '' && <div className="invalid-feedback">Veuillez remplir ce champ.</div>}
      <i className="fa fa-user" aria-hidden="true" style={{ position: 'absolute', top: '40%', left: '10px', color: '#044494', transform: 'translateY(40%)' }}></i>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px', position: 'relative' }}>
      <label htmlFor="phone" className="form-label">phone:</label>
      <div style={{ position: 'relative' }}>
        <i
          className="fa fa-phone"
          aria-hidden="true"
          style={{ position: 'absolute', top: '30%', left: '10px', color: '#044494', transform: 'translateY(-50%)' }}
        ></i>
        <input
          className={`form-control ${formData.phone === '' || !phonePattern.test(formData.phone) ? 'is-invalid' : ''}`}
          required={true}
          style={{ paddingLeft: '30px' }}
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        {formData.phone === '' && <div className="invalid-feedback">Veuillez remplir ce champ.</div>}
        {!phonePattern.test(formData.phone) && <div className="invalid-feedback">Veuillez saisir un numéro de téléphone valide (8 chiffres).</div>}
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px', position: 'relative' }}>
      <label htmlFor="email" className="form-label">email:</label>
      <div style={{ position: 'relative' }}>
        <i
          className="fa fa-envelope"
          aria-hidden="true"
          style={{ position: 'absolute', top: '30%', left: '10px', color: '#044494', transform: 'translateY(-50%)' }}
        ></i>
        <input
          className={`form-control ${formData.email === '' || !emailPattern.test(formData.email) ? 'is-invalid' : ''}`}
          required={true}
          style={{ paddingLeft: '30px' }}
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {formData.email === '' && <div className="invalid-feedback">Veuillez remplir ce champ.</div>}
        {!emailPattern.test(formData.email) && <div className="invalid-feedback">Veuillez saisir une adresse e-mail valide.</div>}
      </div>
    </div>

    <center>
      <button
        type="button"
        name="next"
        className="btn btn-primary w-100 mt-6 rounded-pill"
        onClick={handleNextStep}
      >
        Next
      </button>
    </center>
  </form>
)}







          {step === 2 && (
            
            <form noValidate onSubmit={handleSubmit}>
              {/* Step 2 fields */}
              {/* ... (fields for step 2) */}
              
              <Typography variant="h5" component="h2">
              add Restaurant
            </Typography>
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px', position: 'relative' }}>
  <label htmlFor="nameRes" className="form-label">Name Restaurant:</label>
  <div style={{ position: 'relative' }}>
    <i
      className="fa fa-cutlery" // Utilisez une classe appropriée pour l'icône de restaurant, par exemple "fa fa-cutlery" si disponible dans Font Awesome
      aria-hidden="true"
      style={{ position: 'absolute', top: '50%', left: '10px', color: '#044494', transform: 'translateY(-50%)' }}
    ></i>
    <input
      className={`form-control ${formData.nameRes === '' ? 'is-invalid' : ''}`}
      required={true}
      style={{ paddingLeft: '30px' }}
      type="text"
      name="nameRes"
      value={formData.nameRes}
      onChange={handleChange}
    />
    {formData.nameRes === '' && <div className="invalid-feedback">Veuillez remplir ce champ.</div>}
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
      className={`form-control ${formData.address === '' ? 'is-invalid' : ''}`}
      required={true}
      style={{ paddingLeft: '30px' }}
      type="text"
      name="address"
      value={formData.address}
      onChange={handleChange}
    />
    {formData.address === '' && <div className="invalid-feedback">Veuillez remplir ce champ.</div>}
  </div>
</div>

              {/* Wrap the country and city selects in a flex container */}
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





              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px', position: 'relative' }}>
      <label htmlFor="cuisineType" className="form-label">CuisineType:</label>
      <input
        className={`form-control ${formData.cuisineType === '' ? 'is-invalid' : ''}`}
        required={true}
        style={{ paddingLeft: '30px' }}
        type="text"
        name="cuisineType"
        value={formData.cuisineType}
        onChange={handleChange}
      />
      {formData.cuisineType === '' && <div className="invalid-feedback">Veuillez remplir ce champ.</div>}
    </div> 
     
    {/* <div>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px', position: 'relative' }}>
        <label htmlFor="cuisineType" className="form-label">Cuisine Type :</label>
        <select
          className={`form-control ${formData.cuisineType === '' ? 'is-invalid' : ''}`}
          required={true}
          style={{ paddingLeft: '30px' }}
          name="cuisineType"
          value={formData.cuisineType}
          onChange={handleChangeCuisine}
        >
          <option value="">Sélectionnez un type de cuisine</option>
          {Object.keys(cuisineData).map((cuisineType, index) => (
            <option key={index} value={cuisineType}>{cuisineType}</option>
          ))}
        </select>
        {formData.cuisineType === '' && <div className="invalid-feedback">Veuillez remplir ce champ.</div>}
      </div>
      
      {formData.cuisineType && Array.isArray(cuisineData[formData.cuisineType]) && (
        <div>
          <label htmlFor="sousCuisine" className="form-label">Sous-cuisine :</label>
          <select
            className="form-control"
            name="sousCuisine"
            value={formData.sousCuisine}
            onChange={handleChangeCuisine}
          >
            {cuisineData[formData.cuisineType].map((sousCuisine, index) => (
              <option key={index} value={sousCuisine}>{sousCuisine}</option>
            ))}
          </select>
        </div>
      )}
    </div> */}
    
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
  <div style={{ flex: 1, marginRight: '10px' }}>
    <label htmlFor="taxeTPS" className="form-label">taxeTPS:</label>
    <input
      className={`form-control ${!isValidNumber(formData.taxeTPS) ? 'is-invalid' : ''}`}
      required={true}
      style={{ paddingLeft: '30px' }}
      type="text"
      name="taxeTPS"
      value={formData.taxeTPS}
      onChange={handleChange}
    />
    {!isValidNumber(formData.taxeTPS) && <div className="invalid-feedback">Veuillez entrer un nombre valide.</div>}
  </div>
  <div style={{ flex: 1, marginLeft: '10px' }}>
    <label htmlFor="taxeTUQ" className="form-label">taxeTUQ:</label>
    <input
      className={`form-control ${!isValidNumber(formData.taxeTUQ) ? 'is-invalid' : ''}`}
      required={true}
      style={{ paddingLeft: '30px' }}
      type="text"
      name="taxeTUQ"
      value={formData.taxeTUQ}
      onChange={handleChange}
    />
    {!isValidNumber(formData.taxeTUQ) && <div className="invalid-feedback">Veuillez entrer un nombre valide.</div>}
  </div>
</div>



              <center>
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
                  name="add"
                  className="btn btn-primary w-100 mt-6 rounded-pill"
                  onClick={handleSubmit} // Attach the handleSubmit function here
                >
                  Add
                </button>
              
        <button
  type="button"
  name="cancel"
  className="btn btn-secondary w-100 mt-6 rounded-pill"
  onClick={handleClose} // Déclencher la fonction handleClose
  style={{
    backgroundColor: "#ff4d4d",
    color: "white"
  }}
>
Cancel
</button>
    
              </center>
            </form>
          )}

          {/* Show the success/failure message */}
          {msg && <div>{msg}</div>}
        </Box>
      </Fade>

    </Modal>
          

  
    
         
                                   </> )

};
export default Example;