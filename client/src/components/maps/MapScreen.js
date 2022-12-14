import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import GoogleMapReact from 'google-map-react';
import { GoogleMap, useJsApiLoader, MarkerF} from "@react-google-maps/api"; 
//import BootstrapTable from 'react-bootstrap-table-next';
import "../screens/DashboardScreen.css";
import "./Maps.css";
import {Navbar, Nav, Container, Table, Stack, NavDropdown, Modal, Button, Form, Alert} from 'react-bootstrap';
import Report from "./Report";
import Notification from "./Notification";
import * as BIN_DATA from "./binlocation.json"


const center = { lat:13.119869072706644, lng:100.92038463558079}

const config = {
  header: {
    "Content-Type": "application/json",
  },
}

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
  const fetchBinData = async () => {
    try {
      const { data } = await axios.get("/api/auth/getbin", config);
      let arr = BIN_DATA.default
      setmarkBin(data);
      
    } catch (error) {
      setError(error.response.data.error);
    }
  }

  useEffect(() => {
    fetchBinData();
  }, []);

  if (!isLoaded) {
    return (
      <div>Loading...</div>
    )
    
  }

  const handleBinModal = (bin) => {
    try {
      setShowModal(true)
      setBinDataModal(bin)
    } catch (error) {
      setError(error.response.data.error);
    }
  }
  
  const MarkerItem = (props) => {
    //console.log("Props : ",props.bin)
    return(
      <MarkerF
        //onLoad={onLoad}
        position={{ lat:parseFloat(props.bin.lat), lng:parseFloat(props.bin.long)}}
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
        position: { lat: parseFloat(binDataModal.lat), lng: parseFloat(binDataModal.long)}
      })
        .then(res => {
           console.log(res)
           setTopic("")
           setWriter("")
           setDescription("")
           setShowModal(false)
           alert("?????????????????????????????????????????????????????????")
            //navigate("/login")
        })
        .catch((error) => {
        console.log(error);
      })

    } catch (error) {
      setError(error.response.data.error);
    }
  }

  const onClickPanTo = (pos) => {
    console.log('pos',pos);
    map.panTo(pos)
    map.setZoom(20)
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
          <Form.Label htmlFor="topic" className='fw-bold'>???????????????????????????????????????????????????????????????:</Form.Label><br/>
          <Form.Label htmlFor="topic" className='fw-bold'>??????????????????:</Form.Label>
          <Form.Control type="text" placeholder="??????????????????..." value={topic} onChange={(e)=>setTopic(e.target.value)} required/>
          <Form.Label htmlFor="by" className='fw-bold'>?????????:</Form.Label>
          <Form.Control type="text" placeholder="????????????????????????..." value={writer} onChange={(e)=>setWriter(e.target.value)} required/>
          <Form.Label htmlFor="description" className='fw-bold'>???????????????????????????:</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="????????????????????????????????????????????????..." value={description} onChange={(e)=>setDescription(e.target.value)} required/>
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
    <div className="map-screen">
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
          <Form.Label htmlFor="topic" className='fw-bold'>???????????????????????????????????????????????????????????????:</Form.Label><br/>
          <Form.Label htmlFor="topic" className='fw-bold'>??????????????????:</Form.Label>
          <Form.Control type="text" placeholder="??????????????????..." value={topic} onChange={(e)=>setTopic(e.target.value)} required/>
          <Form.Label htmlFor="by" className='fw-bold'>?????????:</Form.Label>
          <Form.Control type="text" placeholder="????????????????????????..." value={writer} onChange={(e)=>setWriter(e.target.value)} required/>
          <Form.Label htmlFor="description" className='fw-bold'>???????????????????????????:</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="????????????????????????????????????????????????..." value={description} onChange={(e)=>setDescription(e.target.value)} required/>
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

      <Notification show={showOffCanvasLeft} onHide={handleCloseOffCanvasLeft} callback={(e)=>onClickPanTo(e)}/>
      <Report show={showOffCanvasRight} onHide={handleCloseOffCanvasRight}/>

      <Navbar className="map-nav" collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <i class="bi bi-map-fill" style={{fontSize: "2em",color:'#fff', paddingRight:'1em'}}></i>
          <Navbar.Brand>Where to ????????????</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Nav.Link></Nav.Link>
              <Nav.Link href="https://forms.gle/LFg7tmSPinQ7xXCF7" style={{color:'#fff',fontSize:'20px'}}><i class="bi bi-clipboard-data-fill" style={{color:'#fff',fontSize:'30px'}}/>
              </Nav.Link>
              {/* <Nav.Link><i class="bi bi-facebook" style={{color:'#fff',fontSize:'30px'}}></i></Nav.Link> */}
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
        streetViewControl: false  ,
        mapTypeControl: false,
        fullscreenControl: false
      }} 
      onLoad={map => setMap(map)}
      >
        <MarkerBins/>
      </GoogleMap>
      <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
        <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px'}}
        onClick={handleshowOffCanvasLeft}
        ><i class="bi bi-bell-fill" style={{color:'#fff',fontSize:'25px'}}></i></button>
        
        <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px'}}
        onClick={()=>{map.setZoom(20);
        }}
        ><i class="bi bi-zoom-in" style={{color:'#fff',fontSize:'25px'}}></i></button>

        <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px'}}
        onClick={()=>map.panTo(center)}
        ><i class="bi bi-geo-alt-fill" style={{color:'#fff',fontSize:'25px'}}></i> </button>

        <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px'}}
        onClick={()=>{map.setZoom(18);
        }}
        ><i class="bi bi-zoom-out" style={{color:'#fff',fontSize:'25px'}}></i></button>
        
        <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px'}}
        onClick={handleshowOffCanvasRight}
        ><i class="bi bi-megaphone-fill" style={{color:'#fff',fontSize:'25px'}}></i> </button>
      </div>


    </div>
  );
};

export default MapScreen;