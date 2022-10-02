import React from 'react';
import { Link } from 'react-router-dom';
import './pathFail.css'
const NotFound = () => (
<div className="pathFail-screen">
  {/* {localStorage.removeItem("refresh_token")} */}
  <div className='middle-frame'>
    <h1 style={{fontSize: '3em', fontWeight:'bold'}} >404 - Not Found!</h1>
    <div className='image-frame'>
      <img src="https://media2.giphy.com/media/HTSsuRrErs54g1Tqr5/giphy.gif?cid=6c09b952aetbtcxf7sqgi5lrag7hxyxy43epwkmvhsvqdf35&rid=giphy.gif&ct=s.gif" 
      style={{width:"35em",height:"30em",display:"block",marginLeft:"auto",marginRight:"auto"}}/>
    </div>
    <Link
    onClick={()=>{
        window.location ="/"
    }}
    >
        {/* <i class="bi bi-house-door-fill" style={{fontSize: "2em"}}></i> */}
        <img src="https://img.icons8.com/ios/500/home-button.png/"
        style={{marginTop:"1em",width:"3em",height:"3em"}}/>
    </Link>
  </div>
   
</div>);

export default NotFound;