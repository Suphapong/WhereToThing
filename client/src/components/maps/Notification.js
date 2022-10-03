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

export default function Notification({ name, ...props }) {
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState([{}]);

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
    // const interval = setInterval(() => {
    //   console.log('This will be called every 2 seconds');
    //    fetchReportData();
    // }, 1000);

    //return () => clearInterval(interval);
   
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
          <Form.Label htmlFor="topic" className='me-auto fw-bold text-white'> {bin.topic}</Form.Label>
          <Badge bg={bin.status === true ? "success" : "danger"} >
            {bin.status === true ? "สำเร็จ" : "รอการเเก้ปัญหา"} 
          </Badge>
        </Stack>  
        </Accordion.Header>
        <Accordion.Body>
          <Form.Label htmlFor="topic" className='fw-bold'>หัวข้อ: {bin.topic}</Form.Label><br/>
          <Form.Label htmlFor="type" className=''>ประเภทปัญหา: {bin.type}</Form.Label><br/>
          <Form.Label htmlFor="location" className=''>สถานที่ @ {bin.location !== "none" ? bin.location : "ไม่มี"}</Form.Label><br/>
          <Form.Label htmlFor="description" className=''>รายละเอียด: {bin.description}</Form.Label><br/>
          <Form.Label htmlFor="status" style={{color: bin.status === true ? "green" : "red"}}>
            สถานะ: {bin.status === true ? "สำเร็จ" : "ยังไม่ได้เเก้ปัญหา"}
          </Form.Label>
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
          //console.log("bin :",bin)
          //console.log("index :",index)
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
      <AccordionBin/>
      
      
    </Offcanvas.Body>
    </Offcanvas>
  );
}

