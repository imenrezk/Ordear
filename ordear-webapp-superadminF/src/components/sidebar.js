import React from 'react'
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { useHistory } from 'react-router-dom';
import './Style.css';
import { useDispatch } from 'react-redux';
import { logout } from '../features/userSlice';
import { useNavigate } from 'react-router-dom'
function Sidebar() {
    const user = useSelector(selectUser); // Utiliser le sélecteur pour obtenir les données de l'utilisateur
    const dispatch = useDispatch();
    const navigate = useNavigate();
   
    const handleLogout = () => {
        dispatch(logout());
        navigate('/'); // Utilisez navigate pour effectuer la redirection vers '/'
      };
  return (
    <div>

<nav class="pcoded-navbar">
        <div class="navbar-wrapper">
            <div class="navbar-brand header-logo">
            <a class="b-brand custom-logo-background">
    <div class="b-bg"></div>
    <img src='/logo.png' style={{height:"30px"}}/>
    <span class="b-title"></span>
</a>

                <a class="mobile-menu" id="mobile-collapse" href="javascript:"><span></span></a>
            </div>
            <div class="navbar-content scroll-div">
                <ul class="nav pcoded-inner-navbar">
                    <li class="nav-item pcoded-menu-caption">
                        <label>Navigation</label>
                    </li>
                    <li data-username="form elements advance componant validation masking wizard picker select" class="nav-item dashboard-items">
                        <a href="form_elements.html" class="nav-link dashboard-links "><span class="pcoded-micon"><i class="feather icon-file-text"></i></span><span class="pcoded-mtext">Home</span></a>
                    </li>
                    <li class="nav-item pcoded-menu-caption">
                        <label>Restaurant</label>
                    </li>
                    <li data-username="basic components Button Alert Badges breadcrumb Paggination progress Tooltip popovers Carousel Cards Collapse Tabs pills Modal Grid System Typography Extra Shadows Embeds" class="nav-item dashboard-items">
                        <a href="/restaurantDetaille" class="nav-link dashboard-links "><span class="pcoded-micon"><i class="feather icon-box"></i></span><span class="pcoded-mtext">Restaurant Details</span></a>
                      
                    </li>

                    <li class="nav-item pcoded-menu-caption">
                        <label>Responsable</label>
                    </li>
                    <li data-username="basic components Button Alert Badges breadcrumb Paggination progress Tooltip popovers Carousel Cards Collapse Tabs pills Modal Grid System Typography Extra Shadows Embeds" class="nav-item dashboard-items">
                        <a href="/responsable" class="nav-link dashboard-links "><span class="pcoded-micon"><i class="feather icon-box"></i></span><span class="pcoded-mtext">Responsable Details</span></a>
                      
                    </li>
                   
                   
                   
                </ul>
            </div>
        </div>
    </nav>
    <header class="navbar pcoded-header navbar-expand-lg navbar-light">
        <div class="m-header">
            <a class="mobile-menu" id="mobile-collapse1" href="javascript:handleMobileNavbar()"><span></span></a>
            <a href="index.html" class="b-brand">
                   <div class="b-bg">
                       <i class="feather icon-trending-up"></i>
                   </div>
                   <span class="b-title">Ordear</span>
               </a>
        </div>
        <a class="mobile-menu" id="mobile-header" href="javascript:">
            <i class="feather icon-more-horizontal"></i>
        </a>
        <div class="collapse navbar-collapse">
            <ul class="navbar-nav mr-auto">
              
                <li class="nav-item">
                    
                </li>
            </ul>
            <ul class="navbar-nav ml-auto">
                <li>
                  
                </li>
                <li>
                    <div class="dropdown drp-user">
                        <a href="javascript:" class="dropdown-toggle" data-toggle="dropdown">
                            <i class="icon feather icon-settings"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right profile-notification">
                        <div class="pro-head">
        <img src="assets/images/user/avatar-1.jpg" class="img-radius" alt="User-Profile-Image" />
        <span>{user ? user.userName : "Guest"}</span>
        <li>
          <a href="javascript:" className="dud-logout" title="Déconnexion" onClick={handleLogout}>
            <i className="feather icon-log-out"></i>
          </a>
        </li>
      </div>
                            <ul class="pro-body">
                             
                                <li><a href="/profilResponsable" class="dropdown-item"><i class="feather icon-user"></i> Profile</a></li>
                             
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </header>
  </div>
  )
}

export default Sidebar