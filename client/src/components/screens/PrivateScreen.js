import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
//import BootstrapTable from 'react-bootstrap-table-next';
import "./DashboardScreen.css";


import {Navbar, Nav, Container, Table, Stack, NavDropdown} from 'react-bootstrap';

const PrivateScreen = () => {
  const [error, setError] = useState("");
  const [privateData, setPrivateData] = useState({message: "", user: {username: "", email: ""}});

  let navigate  = useNavigate();

  const dateNow = Date.now()
  const timeOptions = {weekday:'long',day: 'numeric',month: 'short',year: 'numeric',hour:'numeric',minute:'numeric',timeZone:'Asia/Jakarta',timeZoneName:'short'};

  useEffect(() => {
    const fetchPrivateData = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get("/api/private", config);
        await setPrivateData(data.data);
        console.log(data.data.user.username);
      } catch (error) {
        localStorage.removeItem("authToken");
        setError("You are not authorized please login");
      }
    };

    fetchPrivateData();
  }, []);

  const logoutHandler = async () => {
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    await axios.post("/api/auth/addlog", {
      email: privateData.user.email,
      message: `Logout Successfully (${ new Date(dateNow).toLocaleString('en-US',timeOptions)})`,
    })
      .then(res => {
         console.log(res)
          localStorage.removeItem("authToken");
          navigate("/login")
      })
      .catch((error) => {
      console.log(error);
      })
  }


  return error ? (
    <span className="error-message">{error}</span>
    ) : (
    <div>
      <Navbar className="dashboard-nav" collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <i class="bi bi-person-square" style={{fontSize: "2em",color:'#fff', paddingRight:'1em'}}></i>
          <Navbar.Brand href="#home">{privateData.user.username}</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Nav.Link>{privateData.user.email}</Nav.Link>
              <Nav.Link onClick={logoutHandler}>Log Out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{alignItems:'center'}}>
        <h1> {privateData.message}</h1>
        <h2 style={{alignItems:'center'}}> {privateData.user.email}</h2>
        <button className="btn btn-warning" style={{width:'150px', marginRight:'2em'}}/>
      </div>


      

    </div>
  );
};

export default PrivateScreen;