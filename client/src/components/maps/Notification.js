import React, { useState, useEffect } from 'react';
import axios from "axios";

import {Offcanvas, Form, Button, Accordion, Badge, Stack} from 'react-bootstrap';

  const options = [
    {
      name: 'Enable body scrolling',
      scroll: true,
      backdrop: false,
    }
  ];

  const config = {
    header: {
      "Content-Type": "application/json",
    },
  };

  const timeOptions = {weekday:'long',day: 'numeric',month: 'short',year: 'numeric',hour:'numeric',minute:'numeric',timeZone:'Asia/Jakarta',timeZoneName:'short'};

export default function Notification({ name, callback, ...props }) {
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState([]);

  const fetchReportData = async () => {
    try {
      const { data } = await axios.get("/api/auth/getreport", config);
      setReportData(data.reverse());
      console.log("setReportData: ",data);
    } catch (error) {
      setError(error.response.data.error);
    }
  }

  useEffect(() => {
    fetchReportData();
  }, [refresh]);

  const AccordionItem = (props) => {
    const {bin,index} = props
    console.log("props",props);
    //const timestamp = new Date().getTime();
    const date = new Date(parseInt(bin.date));
    console.log("date",typeof bin.date);
    console.log("timestamp",typeof timestamp);
    return(
      <>
      <Accordion.Item eventKey={index} style={{width:'100%'}}>
        <Accordion.Header>
        <Stack direction="horizontal" gap={3}>
          <img width={bin.type !== "general" ? 40 : 70} height="50" 
          src={bin.type !== "general" ? require(`./binicon/binpng/${bin.type}.png`) : require(`./binicon/binpng/applogo.png`)}/>
          <Form.Label htmlFor="topic" className='me-auto fw-bold text-white'> {bin.topic}</Form.Label>
          <Badge bg={bin.status === '3' ? "success" : bin.status === '2' ? "warning" : "danger"} >
            {bin.status === '3' ? "สำเร็จ" : bin.status === '2' ? "กำลังดำเนินการ" : "ยังไม่ได้เเก้ปัญหา"}
          </Badge>
        </Stack>  
        </Accordion.Header>
        <Accordion.Body>
          <Form.Label htmlFor="topic" className='fw-bold'>หัวข้อ: {bin.topic} </Form.Label><br/>
          <Form.Label htmlFor="type" className=''>ID: {bin._id}</Form.Label><br/>
          <Form.Label htmlFor="type" className=''>ประเภทปัญหา: {bin.type}</Form.Label><br/>
          <Form.Label htmlFor="location" className=''>สถานที่ @ {bin.location !== "none" ? bin.location : "ไม่มี"}</Form.Label><br/>
          <Form.Label htmlFor="description" className=''>รายละเอียด: {bin.description}</Form.Label><br/>
          <div style={{display:'flex', justifyContent:'space-between'}}>
          <Form.Label htmlFor="status" className='fw-bold' style={{color: bin.status === '3' ? "green" : bin.status === '2' ? "warning" : "red"}}>
            สถานะ: {bin.status === '3' ? "สำเร็จ" : bin.status === '2' ? "กำลังดำเนินการ" : "ยังไม่ได้เเก้ปัญหา"}
          </Form.Label>
          
          {bin.type !== "general" ? <Button variant="success" style={{width:'auto'}} 
            onClick={(e)=>callback !== null ? callback(bin.position):window.location='/admin/map'}
          > <i class="bi bi-geo-alt-fill" style={{color:'#fff',fontSize:'25px'}}></i>
          </Button>:<></>}
          </div>
        </Accordion.Body>
      </Accordion.Item>
      <div style={{display:'flex',flexDirection:'row',justifyContent:'end',alignItems:'end'}}>
        <Form.Label htmlFor="type" >{date.toLocaleTimeString('th-TH')} {date.toLocaleDateString('th-TH')}</Form.Label>
        <br/>
      </div>
      </>
    )
  }

  const AccordionBin = () => {
    return(
      <Accordion>
        {reportData.map((bin,index) => {
          return(
            <AccordionItem bin={bin} index={index}/>
            )
        })}

      </Accordion>
      )
   
  }

  return (
    <Offcanvas 
    show={props.show} 
    onHide={props.onHide} 
    placement={'start'} 
    scroll={true}
    backdrop={false}
    {...props}>
    <Offcanvas.Header closeButton className="dashboard-nav2">
        <Offcanvas.Title style={{color:'#fff',fontSize:'20px'}}>
          <i class="bi bi-bell-fill" style={{color:'#fff',fontSize:'25px',marginRight:'1em'}}></i>
          Notification
        </Offcanvas.Title>
        {/* <img width="120" height="100" src={require('./binicon/applogo.png')} style={{backgroundColor:'#fff', width:'120px',height:'90px', borderRadius:'50%',marginRight:'1em'}}/> */}
    </Offcanvas.Header>
    <Offcanvas.Body>
      {error && <span className="error-message">{error}</span>}
      <Button variant="light" className="dashboard-nav2 text-white"
      onClick={()=>{setRefresh(!refresh)}}
      >
        <i class="bi bi-send-fill text-white"></i> Refresh
      </Button>
      <br/>
      <Form.Label htmlFor="headertopic" className='fw-bold'>การเเจ้งเตือนปัญหา:</Form.Label>
      <br/>
      {reportData.length <= 0  ?  <h5>กรุณากดปุ่ม "Refresh" เพื่อดึงข้อมูลล่าสุด</h5>:
      <AccordionBin/>}
      
      
    </Offcanvas.Body>
    </Offcanvas>
  );
}

