import React  from 'react';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate  } from "react-router-dom";
import "./LoginScreen.css";
import {Alert, Modal} from 'react-bootstrap';
import Recaptcha from "react-google-recaptcha";

const CAPTCHA_SITE_KEY = "6LfjBwgiAAAAABVCcDr1pa1L6eNGiE9MB2vbuO0b"

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const captchaRef = useRef(null)
  const [modalShow, setModalShow] = useState(false);
  const [modalCompleted, setCompletedShow] = useState(false);

  var percentChk = 0
  const [processChk, setProcessChk] = useState(0);



  let navigate  = useNavigate();
  // useEffect(()=>{
  //   navigate('/login');
  // })
  

  
  const sleep=(ms)=> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
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
            {props.textSign}
          </p>
        </Modal.Body>
        <Modal.Footer>
        <p>
          </p>
        </Modal.Footer>
      </Modal>
    );
  }
  
  

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/")
    }
  }, [navigate]);

  const loginHandler = async (e) => {
    e.preventDefault();
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    try {

      const token = captchaRef.current.getValue();
      console.log("token : ",token);
      if (token === "") {
        setError("Please confirm you're not robot");
      }
      else if (token != "") {
        setModalShow(true)
        await axios.post("/api/auth/captcha", {token})
        .then(async (res) => { 
          console.log(res)
          
          const { data } = await axios.post(
            "/api/auth/login",
            { email, password },
            config
          )

          console.log("data Login: ", data)

          if (data.message !== undefined && data.message === "Detect90DayChange") {
            navigate("/90dayresetpassword")
            return false
          }

          localStorage.setItem("authToken", data.token);
          setModalShow(false)
          setCompletedShow(true)
          await sleep(2000);
          setCompletedShow(false)
          navigate("/")
        })
      .catch((error) => {
        console.log(error);
        //navigate("/login")
        setError(error.response.data.error);
        setModalShow(false)
      })
      captchaRef.current.value = null
      captchaRef.current.reset();
    }

    } catch (error) {
      captchaRef.current.value = null
      captchaRef.current.reset();
      setModalShow(false)
      
      try {
        console.log("error ",error);
        setError(error.response.data.error);
      } catch (error) {
      }
      
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };


  

  return (
    <div className="login-screen">
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
      <form onSubmit={loginHandler} className="login-screen__form">
        <h3 className="login-labelMd"><i class="bi bi-person-circle"></i>  Login</h3>
        {error && <span className="error-message">{error}</span>}
        <div className="form-group">
          <label className="login-labelSm light-lb" htmlFor="email" style={{color: '#cad2c5'}}>
            <i class="bi bi-envelope-fill" style={{color:'#cad2c5'}}></i>  Email:</label>
          <input
            type="email"
            required
            id="email"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            tabIndex={1}
          />
        </div>
        <div className="form-group">
          <label className="login-labelSm" style={{color: '#cad2c5'}} htmlFor="password">
            <i class="bi bi-key-fill" style={{color:'#cad2c5'}}></i>  Password:{" "}
            <br/>
            <Link onClick={()=>{
              window.location="/forgotpassword"
            }} className="login-screen__forgotpassword" style={{color:"#84a98c"}}>
              Forgot Password?
            </Link>
          </label>
          
          <input
            type="password"
            required
            id="password"
            autoComplete="true"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            tabIndex={2}
          />
        </div>
        <Recaptcha sitekey={CAPTCHA_SITE_KEY} ref={captchaRef} style={{paddingLeft: '1em',marginBottom:'1em'}}/>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        
        <span className="login-labelSm">
            Don't have an account? <Link onClick={()=>{ 
              window.location='/register'
             //console.log('register click');
            }} 
              style={{color:"#84a98c"}}>Register</Link>
        </span>
      </form>
    </div>
    );
};

export default LoginScreen;