import React, { useState } from 'react';
import axios from "axios";


import {Offcanvas, Form, Button} from 'react-bootstrap';

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

export default function Report({ name, ...props }) {
  const [error, setError] = useState("");
  const [topic, setTopic] = useState("");
  const [writer, setWriter] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false);

  const sendSubmit = async () => {
    try {
      await axios.post("/api/auth/addreport", {
        type: 'general',
        topic,
        writer,
        description,
        location: 'none',
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
  
  return (
    <Offcanvas 
    show={props.show} 
    onHide={props.onHide} 
    placement={'end'} 
    scroll={true}
    backdrop={false}
    {...props}>
    <Offcanvas.Header closeButton className="dashboard-nav2">
        <Offcanvas.Title style={{color:'#fff',fontSize:'20px'}}>
          <i class="bi bi-megaphone-fill" style={{color:'#fff',fontSize:'25px',marginRight:'1em'}}></i>
          Report
        </Offcanvas.Title>
        {/* <img width="120" height="100" src={require('./binicon/applogo.png')} style={{backgroundColor:'#fff', width:'120px',height:'90px', borderRadius:'50%',marginRight:'1em'}}/> */}
    </Offcanvas.Header>
    <Offcanvas.Body>
      {error && <span className="error-message">{error}</span>}
      <Form.Label htmlFor="headertopic" className='fw-bold'>เเจ้งปัญหาการจัดการถังขยะเเละข้อเสนอเเนะ:</Form.Label>
      <br/><br/>
      <Form.Label htmlFor="topic" className='fw-bold'>หัวข้อ:</Form.Label>
      <Form.Control type="text" placeholder="หัวข้อ..." value={topic} onChange={(e)=>setTopic(e.target.value)} required/>
      <br/>
      <Form.Label htmlFor="by" className='fw-bold'>โดย:</Form.Label>
      <Form.Control type="text" placeholder="ชื่อเล่น..." value={writer} onChange={(e)=>setWriter(e.target.value)} required/>
      <br/>
      <Form.Label htmlFor="description" className='fw-bold'>รายละอียด:</Form.Label>
      <Form.Control as="textarea" rows={8} placeholder="อธิบายลานละเอียด..." value={description} onChange={(e)=>setDescription(e.target.value)} required/>
      <br/>
      <Button variant="light" className="dashboard-nav2 text-white"
      onClick={()=>{sendSubmit()}}
      >
        <i class="bi bi-send-fill text-white"></i> Send
      </Button>
    
    </Offcanvas.Body>
    </Offcanvas>
  );
}

