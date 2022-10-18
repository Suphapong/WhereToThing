import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import GoogleMapReact from 'google-map-react';
import { GoogleMap, useJsApiLoader, MarkerF} from "@react-google-maps/api"; 
//import BootstrapTable from 'react-bootstrap-table-next';
import "../screens/DashboardScreen.css";
import "./Maps.css";
import {Navbar, Nav, Container, Table, Stack, NavDropdown, Modal, Button, Form, Alert} from 'react-bootstrap';
import BinManage from "./BinManage";
import Notification from "./Notification";
import * as BIN_DATA from "./binlocation.json"


const center = { lat:13.119869072706644, lng:100.92038463558079}

const config = {
    header: {
      "Content-Type": "application/json",
    },
  };

const AdminMapScreen = () => {
  const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: "AIzaSyDFNTbKO8trQpy5lXrbPFug-c2BeIgB4h0",
  })
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [focus, setFocus] = useState(center);

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true)

  const [allBin, setAllBin] = useState(
    {
    lat:0,
    long:0,
    type:"Blue_A",
    location:""
    })
 
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
    console.log("Props : ",parseFloat(props.bin.lat))
    return(
      <MarkerF
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

  const onClickDelete = (id) => {
    try {
      let ans = window.confirm("Are you sure to delete bin?")
      if (ans) {
        deleteBin(id)
        fetchBinData()
        handleCloseModal()
      }
    } catch (error) {
      setError(error);
    }
  }

  const deleteBin = async (id) => {
    try {
      await axios.post("/api/auth/deletebin",{id})
        .then(res => {
          console.log(res)
          alert("ลบถังขยะสำเร็จ")
          
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
          <Form.Label htmlFor="topic" className='fw-bold'>เเจ้งปัญหาถังขยะใบนี้:</Form.Label><br/>
          <Form.Label htmlFor="topic" className='fw-bold'>หัวข้อ:</Form.Label>
          <Form.Control type="text" placeholder="หัวข้อ..." value={topic} onChange={(e)=>setTopic(e.target.value)} required/>
          <Form.Label htmlFor="by" className='fw-bold'>โดย:</Form.Label>
          <Form.Control type="text" placeholder="ชื่อเล่น..." value={writer} onChange={(e)=>setWriter(e.target.value)} required/>
          <Form.Label htmlFor="description" className='fw-bold'>รายละอียด:</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="อธิบายลายละเอียด..." value={description} onChange={(e)=>setDescription(e.target.value)} required/>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="danger" onClick={()=>{onClickDelete()}}
          ><i class="bi bi-send-fill text-white"></i></Button>
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
          <Form.Label htmlFor="topic" className='fw-bold'>เเจ้งปัญหาถังขยะใบนี้:</Form.Label><br/>
          <Form.Label htmlFor="topic" className='fw-bold'>ประเภทถัง:</Form.Label>
          <Form.Control type="text" placeholder="ประเภท..." value={binDataModal.type} disabled/>
          <Form.Label htmlFor="schedule" className='fw-bold'>สถานที่:</Form.Label>
          <Form.Control type="text" placeholder="@" value={binDataModal.location} disabled/>
          <Form.Label htmlFor="schedule" className='fw-bold'>เวลาเก็บขยะ:</Form.Label>
          <Form.Control type="text" placeholder="-" value={binDataModal.schedule} disabled/>
          <Form.Label htmlFor="lat" className='fw-bold'>lat:</Form.Label>
          <Form.Control type="text" placeholder="-" value={binDataModal.lat} disabled/>
          <Form.Label htmlFor="lat" className='fw-bold'>long:</Form.Label>
          <Form.Control type="text" placeholder="-" value={binDataModal.long} disabled/>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={()=>{onClickDelete(binDataModal._id)}}
            ><i class="bi bi-trash-fill text-white"></i></Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Notification show={showOffCanvasLeft} onHide={handleCloseOffCanvasLeft}  callback={(e)=>onClickPanTo(e)}/>
      <BinManage show={showOffCanvasRight} onHide={handleCloseOffCanvasRight} callback={fetchBinData}/>

      <Navbar className="map-nav" collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <i class="bi bi-map-fill" style={{fontSize: "2em",color:'#fff', paddingRight:'1em'}}></i>
          <Navbar.Brand>Where to ทิ้ง</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Nav.Link href="/map" style={{color:'#fff',fontSize:'20px'}}><i class="bi bi-pin-map" style={{color:'#fff',fontSize:'30px'}}/>
              &nbsp;</Nav.Link>&nbsp;&nbsp;&nbsp;

              <Nav.Link href="/admin/status" style={{color:'#fff',fontSize:'20px'}}><i class="bi bi-person-video3" style={{color:'#fff',fontSize:'30px'}}/>
              &nbsp;</Nav.Link>&nbsp;&nbsp;&nbsp;

              <Nav.Link href="https://forms.gle/LFg7tmSPinQ7xXCF7" style={{color:'#fff',fontSize:'20px'}}><i class="bi bi-clipboard-data-fill" style={{color:'#fff',fontSize:'30px'}}/>
              &nbsp;</Nav.Link>

              {/* <Nav.Link><i class="bi bi-facebook" style={{color:'#fff',fontSize:'25px'}}/></Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
        
      </Navbar>
      <BinManage/>
      <GoogleMap 
      zoom={18} 
      center={focus} 
      mapContainerStyle={{height: '83vh', width: `100vw`}}
      options={{
        zoomControl: false,
        streetViewControl: true,
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
        onClick={()=>map.panTo(focus)}
        ><i class="bi bi-geo-alt-fill" style={{color:'#fff',fontSize:'25px'}}></i> </button>

        <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px'}}
         onClick={()=>{map.setZoom(18)
        }}
        ><i class="bi bi-zoom-out" style={{color:'#fff',fontSize:'25px'}}></i></button>
        
        <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px'}}
        onClick={handleshowOffCanvasRight}
        ><i class="bi bi-trash-fill" style={{color:'#fff',fontSize:'25px'}}></i> </button>
      </div>


    </div>
  );
};

export default AdminMapScreen;