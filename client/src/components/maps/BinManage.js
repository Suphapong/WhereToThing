import React, { useState } from 'react';
import axios from "axios";
import "./BinManage.css"

import * as BIN_TYPE from "./bintype.json"

import {Offcanvas, Form, Button, ButtonGroup, ToggleButton} from 'react-bootstrap';

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

export default function BinManage({ name, ...props }) {
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [position, setPosition] = useState("");
  const [schedule, setSchedule] = useState("");

  const [checked, setChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('Red_A');

  
  let toggleBinArr = [];
  BIN_TYPE.default.forEach((item, index) => {;
    if ((index+1) % 4 == 0) {
      toggleBinArr.push([BIN_TYPE.default[index - 3],BIN_TYPE.default[index - 2],BIN_TYPE.default[index - 1], BIN_TYPE.default[index]]);
    }
  });
  //console.log("albums",albums);
  //console.log("toggleBinArr",toggleBinArr);

  const sendSubmit = async () => {
    let sep = position.split(', ');
    try {
        console.log("sep:",sep);
        await axios.post("/api/auth/addbin", {
        type: radioValue,
        location,
        lat: sep[0],
        long: sep[1],
        schedule
        })
        .then(res => {
            console.log(res)
            setType("")
            setLocation("")
            setPosition("")
            alert("เเจ้งปัญหาได้สำเร็จ")
            props.callback()
            //navigate("/login")
        })
        .catch((error) => {
        console.log(error);
        })
    } catch (error) {
      setError(error.response.data.error);
    }

    try {
      await axios.post("/api/auth/addreport", {
      type: radioValue,
      topic: `เพิ่มถังขยะ ${radioValue}`,
      writer: `admin`,
      description: `เพิ่มถังขยะ ${radioValue}\nบริเวณ @${location}\nlat: ${sep[0]}\nlong: ${sep[1]}`,
      location,
      status: '3',
      position: {lat: parseFloat(sep[0]), lng: parseFloat(sep[1])}
      })
      .then(res => {
          console.log(res)
          setType("")
          setLocation("")
          setPosition("")
          alert("เพิ่มถังขยะได้สำเร็จ")
          props.callback()
          //navigate("/login")
      })
      .catch((error) => {
      console.log(error);
      })

  } catch (error) {
    setError(error.response.data.error);
  }
  }
  
  const BinTypeItem = ({data}, idx) => {;
    return(
    <ToggleButton
      key={data.id}
      id={`radio-${data.id}`}
      type="radio"
      variant={'outline-success'}
      name="radio"
      value={data.type}
      checked={radioValue === data.type}
      onChange={(e) => {
        setRadioValue(e.currentTarget.value)
        console.log(e.currentTarget.value);
      }}
      style={{height:'100px', fontSize:'10px'}}
      ><img width="50px" height="70" src={require(`./binicon/binpng/${data.type}.png`)}/>
      {data.type}
    </ToggleButton>)
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
          <i class="bi bi-trash-fill" style={{color:'#fff',fontSize:'25px',marginRight:'1em'}}></i>
          Add Bin
        </Offcanvas.Title>
        {/* <img width="120" height="100" src={require('./binicon/applogo.png')} style={{backgroundColor:'#fff', width:'120px',height:'90px', borderRadius:'50%',marginRight:'1em'}}/> */}
    </Offcanvas.Header>
    <Offcanvas.Body>
      {error && <span className="error-message">{error}</span>}
      <h3 htmlFor="headertopic" className='fw-bold'>การเพิ่มถังขยะ</h3>
      <Form.Label htmlFor="type" className='fw-bold'>เวลาเก็บขยะ:</Form.Label>
      <Form.Control type="text" placeholder="เวลาเก็บขยะ..." value={schedule} onChange={(e)=>setSchedule(e.target.value)} required/>
      <br/>
      <Form.Label htmlFor="by" className='fw-bold'>สถานที่:</Form.Label>
      <Form.Control type="text" placeholder="สถานที่..." value={location} onChange={(e)=>setLocation(e.target.value)} required/>
      <br/>
      <Form.Label htmlFor="description" className='fw-bold'>ตำเเหน่ง (lat, long 13.xxx, 100.xxx):</Form.Label>
      <Form.Control type="text" placeholder="เช่น 13.xxx, 100.xxx" value={position} onChange={(e)=>setPosition(e.target.value)} required/>
      <br/>
        <ButtonGroup style={{display:'flex', flexDirection:'column'}}>
          {toggleBinArr.map((item) => {
          return(
          <div style={{display:'flex', flexDirection:'row'}}>
            <BinTypeItem data={item[0]}/>
            <BinTypeItem data={item[1]}/>
            <BinTypeItem data={item[2]}/>
            <BinTypeItem data={item[3]}/>
          </div>
          )})}
        </ButtonGroup><br/>
      <Button variant="light" className="dashboard-nav2 text-white"
      onClick={()=>{sendSubmit()}}
      >
        <i class="bi bi-plus-square-fill text-white"></i> Add
      </Button>
    
    </Offcanvas.Body>
    </Offcanvas>
  );
}

