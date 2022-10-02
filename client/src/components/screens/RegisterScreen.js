import React, { useState,useEffect, useRef} from 'react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Recaptcha from "react-google-recaptcha";

import "./RegisterScreen.css";
import dateList from '../password_list/date.txt';
import dictList from '../password_list/dict.txt';
import Alert from 'react-bootstrap/Alert';
import {Modal} from 'react-bootstrap';
import ProgressBar from 'react-bootstrap/ProgressBar';

const CAPTCHA_SITE_KEY = "6LfjBwgiAAAAABVCcDr1pa1L6eNGiE9MB2vbuO0b"

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [aalert,setAalert]= useState(false)
  const [aalertStrength,setAalertStrength]= useState(false)
  const [checkNumbers,setCheckNumbers] = useState(false)
  const [checkUpperCase,setCheckUpperCase] = useState(false)
  const [checkLowerCase,setCheckLowerCase] = useState(false)
  const [checkSymbols,setCheckSymbols] = useState(false)
  const [checkLength,setCheckLength] = useState(false)

  const [modalShow, setModalShow] = useState(false);
  const [modalCompleted, setCompletedShow] = useState(false);


  var percentChk = 0
  const freeze = 0
  const [processChk, setProcessChk] = useState(0);
 
  //location.reload()
  


  const sleep=(ms)=> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // useEffect(()=>{
  //   setProcessChk(percentChk)
  // },[percentChk])


  const  LoadingModal=(props)=> {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Proccessing
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Checking secure your password</h4>
          <img src={props.imgSrc}
          style={{width:"20em",height:"auto",display:"block",marginLeft:"auto",marginRight:"auto"}}/>
          <p>
            {props.textSign}  {processChk} %
          </p>
          
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>

      </Modal>
    );
  }
 
  useEffect(()=>{
    checkForLowerCase(password)
    checkForNumbers(password)
    checkForUpperCase(password)
    checkForSymbols(password)
    checkForLength(password)
    console.log('test');
  },[password])
      // check to see if there is any number
  const  checkForNumbers = (password)=>{
    //var matches = password.match(/\d+/g);
    setCheckNumbers(password.match(/\d+/g) ? true : false)
    console.log(`checkNumbers ${checkNumbers}`);
  }
  const checkForUpperCase =  (password)=>{
    //var matches = password.match(/[A-Z]/);
      setCheckUpperCase(password.match(/[A-Z]/) ? true : false)
    console.log(`checkUpperCase ${checkUpperCase}`);
  }
  const checkForLowerCase =  (password)=>{
    //var matches = password.match(/[A-Z]/);
    setCheckLowerCase(password.match(/[a-z]/) ? true : false)
    console.log(`checkLowerCase ${checkLowerCase}`);
  }
  const checkForSymbols =  (password)=>{
    var symbols = new RegExp(/[^A-Z a-z 0-9]/);
      setCheckSymbols(symbols.test(password) ? true : false)  
    console.log(`checkSymbols ${checkSymbols}`);
  }
  const checkForLength =  (password)=>{
    setCheckLength(password.length > 7 ? true : false)  
    console.log(`checkLength ${checkLength}`);
  }

  const captchaRef = useRef(null)
  let navigate  = useNavigate();
  let indexOfAll = -1
  const registerHandler = async (e) => {
  
  e.preventDefault();
  const config = {
    header: {
      "Content-Type": "application/json",
    },
  };
  setModalShow(true)



  if (password !== confirmpassword) {
    setModalShow(false)
    setProcessChk(0)
    setPassword("");
    setConfirmPassword("");
    setTimeout(() => {
      setError("");
    }, 5000);
    return setError("Passwords do not match");
  }

  try {

    //checkWeakPassword(password,dictList)

    indexOfAll = -1
      
    await fetch(dictList)
    .then(function(response){
        return response.text();
    }).then(async function (data) {
        const dictPass = data.split(/\r?\n/)
        if (dictPass.indexOf(password) != -1) {
          indexOfAll = dictPass.indexOf(password)
         
        }
        setProcessChk(20)
        await sleep(700);
        setProcessChk(30)
        await sleep(700);
        setProcessChk(40)
        await sleep(1000);
    })

    if(indexOfAll == -1) {
      await fetch(dateList)
      .then(function(response){
          return response.text();
      }).then(async function (data) {
          const datePass = data.split(/\r?\n/)
          if (datePass.indexOf(password) != -1) {
            indexOfAll = datePass.indexOf(password)
            
          }
          setProcessChk(80)
          await sleep(1000);
          
      })
    }

    console.log("indexOfAll",indexOfAll);
  
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    //ffff > ทำ
    //tttt > ไม่ทำ
    //tttf > ทำ
    if(!(checkLength && checkNumbers && checkUpperCase && checkSymbols && checkLowerCase)){
      setModalShow(false)
      setProcessChk(0)
      setAalertStrength(true)
    }
    else{ 

   
    
    const token = captchaRef.current.getValue();
    if (indexOfAll != -1  ) {
      //alert("Please use another password(please don't use date, dictionary word.)")
      setModalShow(false)
      setProcessChk(0)
      setAalert(true)
      captchaRef.current.reset();
    }
     if (token != "" && indexOfAll == -1) {
      
      //setProcessChk(0)
      setAalert(false)
      await axios.post("/api/auth/captcha", {token})
      .then(res =>  console.log(res))
      .catch((error) => {
      console.log(error);
      })
      //localStorage.removeItem("_grecaptcha")
      captchaRef.current.value = null
      navigate("/register")
      
    
      const { data } = await axios.post("/api/auth/register",
        {
          username,
          email,
          password,
        },
        config
      );

      localStorage.setItem("authToken", data.token);
      setProcessChk(100)
      await sleep(1000);
      setModalShow(false)
      setCompletedShow(true)
      await sleep(2000);
      setCompletedShow(false)

      navigate("/")
    }}

  } catch (error) {
    captchaRef.current.reset();
    setModalShow(false)
    setProcessChk(0)
    setCompletedShow(false)
    setError(error.response.data.error);
    setTimeout(() => {
      setError("");
    }, 5000);
  }
  



};

return (
  <div className="register-screen">
  
    <LoadingModal
      show={modalShow}
      onHide={() => setModalShow(false)}
      textSign="Waiting..."
      imgSrc="https://i.pinimg.com/originals/be/ce/0c/bece0c797cb134aefb2cb836578c9249.gif"
    />
    <LoadingModal
      show={modalCompleted}
      onHide={() => setCompletedShow(false)}
      textSign="Completed"
      imgSrc="https://i.pinimg.com/originals/8a/82/77/8a8277aee05372b142cadeafcdd101a7.gif"
    />
    <form onSubmit={registerHandler} className="register-screen__form" >
      <div>
      {(()=>{
       

      })}
     </div>
      <h3 className="register-screen__title">Register</h3>
      <div>
     
      {(()=>{
         if(processChk>0 && processChk!=100){
          return(<> 
          <ProgressBar now={processChk} />
          </>)
        }

        if(processChk===100){
          return(<> 
          <ProgressBar variant="success" now={processChk} />  
          </>)
        }

      if(aalertStrength){
        return(<>
          <Alert  key='warning' variant='warning' style={{size:"20px",color:"red"}}>Weak password, please try again </Alert>
        </>)
      }
      if(aalert){
        return(<>
          <Alert  key='danger' variant='danger' style={{size:"20px",color:"red"}}>weak password, please try again </Alert>
        </>)
      }
    })()}
    </div>
      
      
    
      
      {error && <span className="error-message">{error}</span>}
      <div className="form-group">
        <label htmlFor="name">Username:</label>
        <input
          type="text"
          required
          id="name"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          required
          id="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          required
          id="password"
          autoComplete="true"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirmpassword">Confirm Password:</label>
        <input
          type="password"
          required
          id="confirmpassword"
          autoComplete="true"
          placeholder="Confirm password"
          value={confirmpassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div class='status'>
        <label htmlFor="passwordcheck" style={{fontSize: "13px",color:'#2f3e46'}}>Password require:</label>
        {(()=>{
              if(!checkLength){
                  return (<>
                    <div className='a' style={{fontSize: "13px", color:checkLength ? 'green' : 'red'}}>
                      <i class="bi bi-8-circle-fill" style={{fontSize: "13px", color: 'red',paddingRight:'1em'}}/>
                          Contains More than 8 characters</div>
                  </>)
              }
              if(!checkNumbers){
                  return (<>
                    <div className='a0' style={{fontSize: "13px", color:checkNumbers ? 'green' : 'red'}}>
                      <i class="bi bi-123" style={{fontSize: "13px", color: 'red',paddingRight:'1em'}}/>
                      Contains numbers</div>
                  </>)
              }
              if(!checkUpperCase){
                return (<>
                  <div className='a1' style={{fontSize: "13px", color:checkUpperCase ? 'green' : 'red'}}>
                    <i class="bi bi-fonts" style={{fontSize: "13px", color: 'red',paddingRight:'1em'}}/>
                    Contains UpperCase</div>
                </>)
            }
            if(!checkLowerCase){
              return (<>
                <div className='a1' style={{fontSize: "13px", color:checkLowerCase ? 'green' : 'red'}}>
                  <i class="bi bi-fonts" style={{fontSize: "13px", color: 'red',paddingRight:'1em'}}/>
                  Contains LowerCase</div>
              </>)
          }
              if(!checkSymbols){
                return (<>
                <div className='a2' style={{fontSize: "13px", color:checkSymbols ? 'green' : 'red'}}>
                  <i class="bi bi-hash" style={{fontSize: "13px", color: 'red',paddingRight:'1em'}}/>
                  Contains Symbols</div>
                </>)
              }
              if(checkNumbers && checkUpperCase && checkSymbols && checkLowerCase){
                return (<>
                  <div className='a4' style={{fontSize: "13px", color:"green"}}>
                    <i class="bi bi-check" style={{fontSize: "13px", color: 'green',paddingRight:'1em'}}/>
                    This password is secured</div>
                  </>)
              }         
        })()}
      </div>

      <Recaptcha sitekey={CAPTCHA_SITE_KEY} ref={captchaRef} style={{paddingLeft: '1em'}}/>
      <button type="submit" className="btn btn-primary register-screen__bt">
        Register
      </button>

      <span className="register-screen__subtext">
        Already have an account? <Link onClick={()=>{ 
              window.location='/login'
             //console.log('login click');
            }} >Login</Link>
      </span>
    </form>
  </div>
);
};

export default RegisterScreen;