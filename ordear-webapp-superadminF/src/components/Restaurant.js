import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import addImage from '../images/add.jpg';
import poubelle from "../images/poubelle.png";
import avatar from "../images/avatar.png";
import Axios from "axios";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 


function Restaurant() {
    const [open, setOpen] = useState(false);
    const [restaurant, setRestaurant] = useState({
        nameRes: "",
        address:"",
        cuisineType:"",
        taxeTPS: "",
        taxeTVQ:"",
        owner: "",
    
    
    });
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState("");
    
    const [color, setColor] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    


    const [restaurants, setRestaurants] = useState([]);

    
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    const [ownersInfo, setOwnersInfo] = useState({});
    useEffect(() => {
        const fetchOwners = async () => {
          const owners = {};
          for (const restaurant of restaurants) {
            if (restaurant.owner) {
              const ownerInfo = await fetchOwnerInfo(restaurant.owner);
              owners[restaurant.owner] = ownerInfo;
            }
          }
          setOwnersInfo(owners);
        };
      
        fetchOwners();
      }, [restaurants]);
      
  
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/user/getListRestaurant`, {
          method: 'GET',
          credentials: 'include',
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('La réponse du réseau n\'était pas valide');
            }
            return response.json();
          })
          .then((data) => {
            // Récupération des restaurants à partir de la réponse du serveur
            setRestaurants(data);
          })
          .catch((error) => {
            console.error('Une erreur s\'est produite lors de la récupération des restaurants :', error);
          });
      }, []);
      
      const fetchOwnerInfo = async (ownerId) => {
        try {
          const response = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/${ownerId}`);
          return response.data;
        } catch (error) {
          console.error('Erreur lors de la récupération des infos du propriétaire :', error);
          return null;
        }
      };
 
    ///////Search//////
    const searchItems = (searchValue) => {
        setSearchInput(searchValue);
  
        if (searchValue !== '') {
            const filteredData = restaurants.filter((restaurant) => {
                const searchableFields = ['nameRes', 'address', 'cuisineType'];
                return searchableFields.some((field) =>
                restaurant[field]?.toLowerCase().includes(searchValue.toLowerCase())
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
 
  return (<>
<Sidebar />
        <div class="pcoded-main-container">
            <div class="pcoded-wrapper">
                <div class="pcoded-content">
                    <div class="pcoded-inner-content">

                        <div class="main-body">
                            <div class="page-wrapper">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="card">
                                            <div className="card-header d-flex align-items-center"> {/* Use Flexbox here */}
                                                <h5>List Restaurants</h5>
                                                
                                                 {/* Boutons de filtre de rôle */}
  
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

                                            <div class="card-block table-border-style">
                                                <div class="table-responsive">
                                                      
                                                    <table className="items-center w-full bg-transparent border-collapse ">
                                                        
                                                        <thead>
                                                        <tr>

                                                            <th
                                                                className={
                                                                    "px-4 align-middle   py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
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
                                                                Name Restaurant
                                                            </th>
                                                            <th
                                                                className={
                                                                    "px-4 align-middle  py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                                    (color === "light"
                                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                                                }
                                                            >
                                                                Address
                                                            </th>
                                                            <th
                                                                className={
                                                                    "px-4 align-middle  py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                                    (color === "light"
                                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                                                }
                                                            >
                                                                CuisineType
                                                            </th>
                                                            <th
                                                                className={
                                                                    "px-4 align-middle   py-3  text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                                    (color === "light"
                                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                                                }
                                                            >
                                                                taxeTPS
                                                            </th>
                                                            <th
                                                                className={
                                                                    "px-4 align-middle   py-3  text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                                    (color === "light"
                                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                                                }
                                                            >
                                                                userName
                                                            </th>
                                                            <th
                                                                className={
                                                                    "px-4 align-middle   py-3  text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                                    (color === "light"
                                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                                                }
                                                            >
                                                                phone
                                                            </th>
                                                            <th
                                                                className={
                                                                    "px-4 align-middle   py-3  text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                                    (color === "light"
                                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                                                }
                                                            >
                                                                taxeTVQ
                                                            </th>
                                                           
                                                        

                                                         {/*    <th
                                                                className={
                                                                    "px-4 align-middle  py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                                    (color === "light"
                                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                                                }
                                                            >
                                                                Actions
                                                            </th>
 */}
                                                        </tr>
                                                        </thead>
                                                        <tbody >
                                                        {filteredResults.
                                                        
                                                        map((res) => (
                                                      
                                                                <tr key={res._id}>
                                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                        &nbsp;
                                                                        <div onClick={() => {  }}
                                                                        > <img src={avatar} width="30" height="30" alt="" />
                                                                        </div>  &nbsp;


                                                                    </td>
                                                                    
                                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                        {res.nameRes}
                                                                    </td>
                                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                        {res.address}
                                                                    </td>
                                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                        {res.cuisineType}
                                                                    </td>
                                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                        {res.taxeTPS}
                                                                    </td>
                                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                        {res.userName}
                                                                    </td>
                                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                        {res.phone}
                                                                    </td>
                                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                        {res.taxeTVQ}
                                                                    </td>
                                                           
                                                                </tr>)
                                                        )}
                                                         {restaurants.map((res) => (
      <tr key={res._id}>
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          &nbsp;
          <div onClick={() => { /* action au clic */ }}>
            <img src={avatar} width="30" height="30" alt="" />
          </div>
          &nbsp;
        </td>
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          {res.nameRes}
        </td>
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          {res.address}
        </td>
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          {res.cuisineType}
        </td>
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          {res.taxeTPS}
        </td>
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
    {ownersInfo[res.owner] ? ownersInfo[res.owner].userName : ''}
</td>
<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
    {ownersInfo[res.owner] ? ownersInfo[res.owner].phone : ''}
</td>
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          {res.taxeTVQ}
        </td>
      </tr>
    ))}

                                                        </tbody>

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

        
                                   </> )
}

export default Restaurant;