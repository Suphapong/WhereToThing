import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import GoogleMapReact from 'google-map-react';
import { GoogleMap, useJsApiLoader, MarkerF} from "@react-google-maps/api"; 
//import BootstrapTable from 'react-bootstrap-table-next';
import "../screens/DashboardScreen.css";
import Accordion from 'react-bootstrap/Accordion';
import {Navbar, Nav, Container, Table, Stack, NavDropdown, Modal, Button, Form} from 'react-bootstrap';
import Report from "./Report";
import * as BIN_DATA from "./binlocation.json"


const center = { lat:13.119869072706644, lng:100.92038463558079}



const MapScreen = () => {
  const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: "AIzaSyDFNTbKO8trQpy5lXrbPFug-c2BeIgB4h0",
  })
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true)
  const [binDataModal, setBinDataModal] = useState(
  {
    lat:0,
    long:0,
    type:"",
    location:""
  })


  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const handleCloseOffCanvas = () => setShowOffCanvas(false);
  const handleShowOffCanvas = () => setShowOffCanvas((s) => !s);
  
  const [markBin, setmarkBin] = useState(BIN_DATA.default)

  console.log("MARK-BIN-DATA : ", markBin)
  console.log("isLoaded",isLoaded);
  if (!isLoaded) {
    return (
      <div>Loading...</div>
    )
    
  }

  const handleBinModal = (bin) => {
    setShowModal(true)
    setBinDataModal(bin)
  }
  
  const MarkerItem = (props) => {
    console.log("Props : ",props.bin)
    return(
      <MarkerF
        //onLoad={onLoad}
        
        position={{ lat:props.bin.lat, lng:props.bin.long}}
        icon={{
            url: require(`./binicon/${props.bin.type}.ico`), scaledSize: {width: 32, height: 40},
            fillColor: '#EB00FF',
            scale: 1,
        }}
        onClick={(key) => handleBinModal(props.bin)}
        />
    )
  }

  const MarkerBins = () => {
    return(
      markBin.map(bin => {
        console.log("bin :",bin)
         return(
          <MarkerItem bin={bin}/>)
        }
      )
    )
  }

  const ModalBin = () => {
    return(
    <Modal
        show={showModal}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title><img width="100" height="200" src={`https://www.businesswaste.co.uk/wp-content/uploads/2021/05/bw-wheelie_bin_360l.png`}/>@{binDataModal.location}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label htmlFor="inputPassword5">เเจ้งปัญหาถังขยะใบนี้:</Form.Label>
          <Form.Control type="text" placeholder="Normal text" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary">จุ๊กกรู๊</Button>
        </Modal.Footer>
      </Modal>
      )
  }
  
  return (
    <div>
      <Report></Report>
      <ModalBin/>
      <Report show={showOffCanvas} onHide={handleCloseOffCanvas}/>
      <Navbar className="dashboard-nav" collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <i class="bi bi-person-square" style={{fontSize: "2em",color:'#fff', paddingRight:'1em'}}></i>
          <Navbar.Brand href="#home">Where to ทิ้ง</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Nav.Link></Nav.Link>
              <Nav.Link>Log Out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
        
      </Navbar>
      <div style={{display:'flex', flexDirection:'row'}}>
        <button type="button" class="btn btn-light" 
        onClick={()=>map.panTo(center)}
        ><i class="bi bi-cursor-fill"></i>OG</button>
        <button type="button" class="btn btn-light" 
        onClick={()=>{map.setZoom(18);
        }}
        >ZOOM</button>
        <button type="button" class="btn btn-light" 
        onClick={handleBinModal}
        >MODAL</button>
        <button type="button" class="btn btn-light" 
        onClick={handleShowOffCanvas}
        >OffCanvas</button>
      </div>
      
      <Report></Report>
      <GoogleMap 
      zoom={18} 
      center={center} 
      mapContainerStyle={{height: '100vh', width: `100vw`}}
      options={{
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false
      }} 
      onLoad={map => setMap(map)}
      >
        <MarkerBins/>
      </GoogleMap>

    </div>
  );
};

export default MapScreen;