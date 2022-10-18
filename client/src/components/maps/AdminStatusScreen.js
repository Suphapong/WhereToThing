import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import GoogleMapReact from 'google-map-react';
import { GoogleMap, useJsApiLoader, MarkerF} from "@react-google-maps/api"; 
//import BootstrapTable from 'react-bootstrap-table-next';
import "../screens/DashboardScreen.css";
import "./Maps.css";
import {Navbar, Nav, Container, Table, Stack, NavDropdown, Modal, Button, Form, Alert, ToggleButton, ButtonGroup} from 'react-bootstrap';
import BinManage from "./BinManage";
import Notification from "./Notification";
import * as BIN_DATA from "./binlocation.json"


const center = { lat:13.119869072706644, lng:100.92038463558079}

const config = {
    header: {
      "Content-Type": "application/json",
    },
  };

const AdminStatusScreen = () => {
  const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: "AIzaSyDFNTbKO8trQpy5lXrbPFug-c2BeIgB4h0",
  })
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))

  const [showModal, setShowModal] = useState(false);
  
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true)

  const [reportData, setReportData] = useState([]);
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

  const [showStatus, setShowStatus] = useState(true);
  const [filterSelect, setFilterSelect] = useState('1');
  const [filterKey, setFilterKey] = useState('');
  const [filterData, setFilterData] = useState([{type:'general'}]);

  const [radioValue, setRadioValue] = useState('4');


 const fetchReportData = async () => {
    try {
      const { data } = await axios.get("/api/auth/getreport", config);
      setReportData(data.reverse());
      setFilterData(data);
      console.log("setReportData: ",data);
    } catch (error) {
      setError(error.response.data.error);
    }
  }

  useEffect(() => {
    fetchReportData();
    
  }, [showStatus]);

  if (!isLoaded) {
    return (
      <div>Loading...</div>
    )  
  }
  

  const onChangeStatus = (id, state) => {
    try {
      let ans = window.confirm("Are u sure ?")
      if (ans) {
        updateStatus(id, state)
        fetchReportData();
      }
    } catch (error) {
      setError(error);
    }
  }

  const onClickDelete = (id) => {
    try {
      let ans = window.confirm("Are u sure to delete ?")
      if (ans) {
        deleteReport(id)
        fetchReportData();
      }
    } catch (error) {
      setError(error);
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await axios.put("/api/auth/updatereportstatus", 
        {id,status}
      )
        .then(res => {
          console.log(res)
          alert("อัพเดทสถานะได้สำเร็จ")
          
        })
        .catch((error) => {
        console.log(error);
      })

    } catch (error) {
      setError(error.response.data.error);
    }
  }

  const deleteReport = async (id) => {
    try {
      await axios.post("/api/auth/deletereport",{id})
        .then(res => {
          console.log(res)
          alert("อัพเดทสถานะได้สำเร็จ")
          
        })
        .catch((error) => {
        console.log(error);
      })

    } catch (error) {
      setError(error.response.data.error);
    }
  }

  const handleEditBt = () => {
    if (showStatus) {
      let ans = window.confirm("คุณต้องการเเก้ไขสถานะในตารางใช่ไหม ?")
      if (ans) {
        setShowStatus(!showStatus)
      }
    }else{
      let ans = window.confirm("คุณต้องการปิดการเเก้ไขสถานะในตารางใช่ไหม ?")
      if (ans) {
        setShowStatus(!showStatus)
      }
    }
    console.log("showStatus:",showStatus);
  }

  const handleSearchBt = () => {
    let filter = reportData.filter((item)=> filterKey === '' ? item : filterSelect === '1' ? item.topic === filterKey: 
    filterSelect === '2' ?  item.type === filterKey:
    filterSelect === '3' ?  item.writer === filterKey : item.location=== filterKey)
    setFilterData(filter)
    console.log("filter:",filter);
  }

  const handleStatusToggle = (state) => {
    if(state=='4'){
      setFilterData(reportData)
      setRadioValue(state)
    }else{
    let filter = reportData.filter((item)=> item.status === state)
    setRadioValue(state)
    setFilterData(filter)
    console.log("filter:",filter)
    }
  }

  const ReportItem = (props) => {
    const date = new Date(parseInt(props.report.date));
    return(
        <tr>
          <td>{props.id+1}</td>
          <td>{props.report.topic}</td>
          <td style={{width:'20%'}}>{date.toLocaleDateString('th-TH')} {date.toLocaleTimeString('th-TH')} </td>
          <td>{props.report.type}</td>
          <td>{props.report.writer}</td>
          <td>{props.report.location}</td>
          <td style={{width:'30%'}}>{props.report.description}</td>
          <td>
            <Form>
            <Form.Group className="mb-3">
              <Form.Select id={props.report._id} disabled={showStatus || props.report.status === '3'} value={props.report.status}
              onChange={(e) => onChangeStatus(props.report._id, e.target.value)}>
                <option value='1'>มีปัญหา</option>
                <option value='2'>กำลังดำเนินการ</option>
                <option value='3'>เเก้ไขสำเร็จ</option>
              </Form.Select>  
            </Form.Group>
            </Form>
            {props.report.status === '3' ? 
            <i class="bi bi-check-square-fill text-white btn btn-success" style={{fontSize:'20px',width:'auto'}}/>  : 
            props.report.status === '2' ? <i class="bi bi-hourglass-split text-white btn btn-warning" style={{fontSize:'20px',width:'auto'}}/>:
            <i class="bi bi-x-square-fill text-white btn btn-danger" style={{fontSize:'20px',width:'auto'}}/> 
            }

            <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px', width:'auto'}} disabled={showStatus}>
              <i class="bi bi-file-earmark-image" style={{color:'#fff',fontSize:'20px'}}></i>
            </button>

            <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px', width:'auto'}} disabled={showStatus}
              onClick={()=>onClickDelete(props.report._id)}>
            <i class="bi bi-trash-fill" style={{color:'#fff',fontSize:'20px'}}></i>
            </button>
          </td>
        </tr>
    )
  }

  const ReportTable = () => {
    return(
      <Table striped>
        <thead>
          <tr>
            <th># 
            </th>
            <th>หัวข้อ
            </th>
            <th>เวลา</th>
            <th>ประเภทปัญหา</th>
            <th>ผู้เเจ้ง</th>
            <th>สถานที่</th>
            <th>รายละเอียด</th>
            <th >สถานะ </th>
          </tr>
        </thead>
        <tbody>
        {filterData.map((report,index) => {
          return(
            <ReportItem report={report} id={index}/>)
          }
        )}
        </tbody>
      </Table>
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
           setTopic("")
           setWriter("")
           setDescription("")
           setShowModal(false)
           alert("เเจ้งปัญหาได้สำเร็จ")
            //navigate("/login")
        })
        .catch((error) => {
        console.log(error);
      })

    } catch (error) {
      setError(error.response.data.error);
    }
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
          <Button variant="primary" onClick={()=>{sendSubmit()}}
          ><i class="bi bi-send-fill text-white"></i>  Send</Button>
        </Modal.Footer>
      </Modal>

      <Notification show={showOffCanvasLeft} onHide={handleCloseOffCanvasLeft} callback={null} />
      <BinManage show={showOffCanvasRight} onHide={handleCloseOffCanvasRight}/>

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

              <Nav.Link href="/admin/map" style={{color:'#fff',fontSize:'20px'}}><i class="bi bi-trash-fill " style={{color:'#fff',fontSize:'30px'}}/>
              &nbsp;</Nav.Link>
              {/* <Nav.Link><i class="bi bi-facebook" style={{color:'#fff',fontSize:'25px'}}/></Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
        
      </Navbar>
      <BinManage/>
      <div className="row bg-white" style={{display:'flex', flexDirection:'column',justifyContent:'center',width:'100%'}}>
        <div style={{display:'flex', flexDirection:'row', alignItems:'center',width:'100%',height:'4em'}}>
          <Form.Label htmlFor="topic" className='fw-bold' style={{width:'8em'}}>ค้นหาจาก</Form.Label>&nbsp;
          <Form.Select  style={{maxWidth:'10em'}} value={filterSelect} onChange={(e)=> setFilterSelect(e.target.value)} >
            <option value='1'>หัวข้อ</option>
            <option value='2'>ประเภทปัญหา	</option>
            <option value='3'>ผู้เเจ้ง</option>
            <option value='4'>สถานที่</option>
          </Form.Select>&nbsp;
          <Form.Control type="text" placeholder="..." value={filterKey} onChange={(e)=>setFilterKey(e.target.value)} requiredstyle={{width:'40em'}}/>&nbsp;
          <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px', width:'auto', borderRadius:'50%'}}
          onClick={()=>{
            setFilterData(reportData) 
            setFilterKey('')
            setFilterSelect('1')
          }}>
            <i class="bi bi-x-circle" style={{color:'#fff',fontSize:'20px'}}></i>
          </button>&nbsp;
          <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px', width:'10rem'}}
            onClick={()=>{handleSearchBt()}}>
              <i class="bi bi-search" style={{color:'#fff',fontSize:'20px'}}></i>
          </button>
          </div>
          
          <div style={{display:'flex', flexDirection:'row', justifyContent: 'end', alignItems:'end', marginBottom:'10px'}}>
          <ButtonGroup style={{display:'flex'}}>
            <ToggleButton style={{ width:'auto'}}
            key="4"
            id={`radio-4`}
            type="radio"
            variant={radioValue === '4' ?'secondary' :'dark' }
            name="allstatus"
            value='4'
            checked={radioValue === '4'}
            onChange={(e) => {handleStatusToggle(e.currentTarget.value)
            console.log(e.currentTarget.value)}}>
              <i class="bi bi-x-diamond-fill text-white" style={{color:'#fff',fontSize:'20px'}}></i>
            </ToggleButton>&nbsp;

            <ToggleButton className="outline-dark" style={{ width:'auto'}}
            key="3"
            id={`radio-3`}
            type="radio"
            variant={radioValue === '3' ? 'secondary': 'success'}
            name="3"
            value='3'
            checked={radioValue === '3'}
            onChange={(e) => {handleStatusToggle(e.currentTarget.value)
            console.log(e.currentTarget.value)}}>
              <i class="bi bi-check-square-fill text-white" style={{color:'#fff',fontSize:'20px'}}></i>
            </ToggleButton>&nbsp;

            <ToggleButton className="outline-dark" style={{ width:'auto'}}
            key="2"
            id={`radio-2`}
            type="radio"
            variant={radioValue === '2' ?'secondary' :'warning' }
            name="2"
            value='2'
            checked={radioValue === '2'}
            onChange={(e) => {handleStatusToggle(e.currentTarget.value)
            console.log(e.currentTarget.value)}}>
              <i class="bi bi-hourglass-split text-white" style={{color:'#fff',fontSize:'20px'}}></i>
            </ToggleButton>&nbsp;

            <ToggleButton className="outline-dark" style={{ width:'auto'}}
            key="1"
            id={`radio-1`}
            type="radio"
            variant={radioValue === '1' ?'secondary' :'danger' }
            name="1"
            value='1'
            checked={radioValue === '1'}
            onChange={(e) => {handleStatusToggle(e.currentTarget.value)
            console.log(e.currentTarget.value)}}>
              <i class="bi bi-x-square-fill text-white" style={{color:'#fff',fontSize:'20px'}}></i>
            </ToggleButton>&nbsp;
          </ButtonGroup>
            



            <button type="button" class="btn btn-warning" style={{color:'#fff',fontSize:'20px', width:'10em'}}
            onClick={()=>fetchReportData()}>
              <i class="bi bi-arrow-repeat fw-bolder" style={{color:'#fff',fontSize:'20px'}}></i>
            </button>&nbsp;
            <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px', width:'10em'}}
            onClick={()=>handleEditBt()}>
              <i class="bi bi-pencil-square" style={{color:'#fff',fontSize:'20px'}}></i>
            </button>
          </div>

      </div>
      

      <div style={{display:'flex', flexDirection:'row', width:'100%', height:'83vh', backgroundColor:'#fff',overflowY: 'scroll'}}>
        {reportData.length <= 0  ?  <h2>กรุณากดปุ่ม "Refresh" เพื่อดึงข้อมูลล่าสุด</h2>:
        <ReportTable/>}
      </div>

      <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
        <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px'}}
        onClick={handleshowOffCanvasLeft}
        ><i class="bi bi-bell-fill" style={{color:'#fff',fontSize:'25px'}}></i></button>
        
        <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px'}}
        onClick={()=>window.location='/admin/map'}
        ><i class="bi bi-geo-alt-fill" style={{color:'#fff',fontSize:'25px'}}></i> </button>
        
        <button type="button" class="btn btn-light dashboard-nav" style={{color:'#fff',fontSize:'20px'}}
        onClick={handleshowOffCanvasRight}
        ><i class="bi bi-megaphone-fill" style={{color:'#fff',fontSize:'25px'}}></i> </button>
      </div>


    </div>
  );
};

export default AdminStatusScreen;