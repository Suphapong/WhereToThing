import React, { useRef } from 'react';
import Recaptcha from "react-google-recaptcha";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./CaptchaScreen.css";


const CAPTCHA_SITE_KEY = "6LfjBwgiAAAAABVCcDr1pa1L6eNGiE9MB2vbuO0b"
const CaptchaScreen = () => {
  const captchaRef = useRef(null)
  let navigate = useNavigate()

  const handleSubmit = async (e) =>{
    e.preventDefault();

    const token = captchaRef.current.getValue();
    captchaRef.current.reset();
    console.log("token ",token);
    
    if (token != "") {
        await axios.post("/api/auth/captcha", {token})
        .then(res =>  console.log(res))
        .catch((error) => {
        console.log(error);
        })
        //localStorage.removeItem("_grecaptcha")
        captchaRef.current.value = ""
        navigate("/captcha")
    }
    captchaRef.current.reset();
  }


  return(
    <div>
        
    <form onSubmit={handleSubmit}>
    <label htmlFor="name">Name</label>
        <input type="text" id="name" className="input"/>
        <Recaptcha sitekey={CAPTCHA_SITE_KEY} ref={captchaRef}/>
    <button>Submit</button>
    </form>
    </div>
    )
};
export default CaptchaScreen;
