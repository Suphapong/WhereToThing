import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import GoogleMapReact from 'google-map-react';
import { GoogleMap, useJsApiLoader, MarkerF} from "@react-google-maps/api"; 
//import BootstrapTable from 'react-bootstrap-table-next';
import "../screens/DashboardScreen.css";
import {Navbar, Nav, Container, Table, Stack, NavDropdown, Modal, Button, Form} from 'react-bootstrap';
import Report from "./Report";
import Notification from "./Notification";
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
    type:"Blue_A",
    location:""
  })


  const [showOffCanvasRight, setshowOffCanvasRight] = useState(false);
  const handleCloseOffCanvasRight = () => setshowOffCanvasRight(false);
  const handleshowOffCanvasRight = () => setshowOffCanvasRight((s) => !s);

  const [showOffCanvasLeft, setshowOffCanvasLeft] = useState(false);
  const handleCloseOffCanvasLeft = () => setshowOffCanvasLeft(false);
  const handleshowOffCanvasLeft = () => setshowOffCanvasLeft((s) => !s);
  
  const [markBin, setmarkBin] = useState(BIN_DATA.default)

  const [error, setError] = useState("");
  const [topic, setTopic] = useState("");
  const [writer, setWriter] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false);

  //console.log("MARK-BIN-DATA : ", markBin)
 // console.log("isLoaded",isLoaded);
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
    //console.log("Props : ",props.bin)
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
        //console.log("bin :",bin)
         return(
          <MarkerItem bin={bin}/>)
        }
      )
    )
  }

  const sendSubmit = async () => {
    try {
      await axios.post("/api/auth/addreport", {
        type: binDataModal.type,
        topic,
        writer,
        description,
        location: binDataModal.location,
        status
      })
        .then(res => {
           console.log(res)
            //navigate("/login")
        })
        .catch((error) => {
        console.log(error);
      })

    } catch (error) {
      setError(error.response.data.error);
    }
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
          <Modal.Title><img width="50" height="70" src={require(`./binicon/binpng/${binDataModal.type}.png`)}/>
          &nbsp;@&nbsp;{binDataModal.location}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Label htmlFor="topic" className='fw-bold'>เเจ้งปัญหาถังขยะใบนี้:</Form.Label><br/>
          <Form.Label htmlFor="topic" className='fw-bold'>หัวข้อ:</Form.Label>
          <Form.Control type="text" placeholder="หัวข้อ..." value={topic} onChange={(e)=>setTopic(e.target.value)} required/>
          <Form.Label htmlFor="by" className='fw-bold'>โดย:</Form.Label>
          <Form.Control type="text" placeholder="ชื่อเล่น..." value={writer} onChange={(e)=>setWriter(e.target.value)} required/>
          <Form.Label htmlFor="description" className='fw-bold'>รายละอียด:</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="อธิบายลานละเอียด..." value={description} onChange={(e)=>setDescription(e.target.value)} required/>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>{sendSubmit()}}
          ><i class="bi bi-send-fill text-white"></i>  Send</Button>
        </Modal.Footer>
      </Modal>
      )
  }
  
  return (
    <div>
      <ModalBin/>
      <Notification show={showOffCanvasLeft} onHide={handleCloseOffCanvasLeft}/>
      <Report show={showOffCanvasRight} onHide={handleCloseOffCanvasRight}/>
      <Navbar className="dashboard-nav" collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <i class="bi bi-map-fill" style={{fontSize: "2em",color:'#fff', paddingRight:'1em'}}></i>
          <Navbar.Brand href="#home">Where to ทิ้ง</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Nav.Link></Nav.Link>
              <Nav.Link><i class="bi bi-facebook" style={{color:'#fff',fontSize:'25px'}}></i></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
        
      </Navbar>
      <Report/>
      <GoogleMap 
      zoom={18} 
      center={center} 
      mapContainerStyle={{height: '83vh', width: `100vw`}}
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
      <div style={{display:'flex', flexDirection:'row', width:'100vw'}}>
      <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px'}}
        onClick={handleshowOffCanvasLeft}
        ><i class="bi bi-bell-fill" style={{color:'#fff',fontSize:'25px'}}></i> Notification</button>
        
        <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px'}}
        onClick={()=>{map.setZoom(20);
        }}
        ><i class="bi bi-zoom-in" style={{color:'#fff',fontSize:'25px'}}></i></button>

        <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px'}}
        onClick={()=>map.panTo(center)}
        ><i class="bi bi-geo-alt-fill" style={{color:'#fff',fontSize:'25px'}}></i> OG</button>

        <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px'}}
        onClick={()=>{map.setZoom(18);
        }}
        ><i class="bi bi-zoom-out" style={{color:'#fff',fontSize:'25px'}}></i></button>
        
        <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px'}}
        onClick={handleshowOffCanvasRight}
        ><i class="bi bi-megaphone-fill" style={{color:'#fff',fontSize:'25px'}}></i> Report</button>
      </div>

    </div>
  );
};

export default MapScreen;