import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import avatar from "../images/avatar.png";

const ConsulterResdisabled = () => {
  const [responsables, setResponsables] = useState([]);

  useEffect(() => {
    const fetchResponsables = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/consultertrue`);
        setResponsables(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchResponsables();
  }, []);

  return (
    <>
      <Sidebar />
      <div>
        {/* Affichage du message d'erreur ou de succès */}
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
                            <h5>Liste des Responsables enable </h5>
                            {/* Boutons de filtre de rôle */}
                          </div>
                        </div>
                        <div className="sidebar-container">
                          <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {responsables.map((responsable) => (
                              <div
                                key={responsable._id}
                                style={{
                                  flexBasis: "30%",
                                  margin: "10px",
                                  border: "1px solid #ccc",
                                  borderRadius: "10px",
                                  padding: "20px",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "150px",
                                    height: "150px",
                                    borderRadius: "50%",
                                    backgroundColor: "#f0f0f0",
                                    marginBottom: "10px",
                                  }}
                                >
                                  <img
                                    src={avatar}
                                    alt="Avatar"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      borderRadius: "50%",
                                    }}
                                  />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                  <div style={{ color: "black", fontWeight: "bold" }}>
                                    Nom: {responsable.userName}
                                  </div>
                                  <div style={{ color: "black", fontWeight: "bold" }}>
                                    Email: {responsable.email}
                                  </div>
                                  <div style={{ color: "black", fontWeight: "bold" }}>
                                    Phone: {responsable.phone}
                                  </div>
                                  <div style={{ color: "black", fontWeight: "bold" }}>
                                    Activate: {responsable.activate.toString()}
                                  </div>
                                  <div style={{ color: "black", fontWeight: "bold" }}>
                                    Role: {responsable.role}
                                  </div>
                                  {/* Add other fields you want to display */}
                                </div>
                              </div>
                            ))}
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
    </>
  );
};

export default ConsulterResdisabled;
