import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
//import BootstrapTable from 'react-bootstrap-table-next';
import "./DashboardScreen.css";
import Accordion from 'react-bootstrap/Accordion';


import {Navbar, Nav, Container, Table, Stack, NavDropdown} from 'react-bootstrap';

// const img = ["https://reg.src.ku.ac.th/picnisit/6230300141.jpg",
// "https://scontent.fbkk11-1.fna.fbcdn.net/v/t1.6435-9/131928663_3454181011365096_4621079628178206031_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Vctc20hQOwwAX9AVjtV&tn=3R4TRMyMy9CrltMF&_nc_ht=scontent.fbkk11-1.fna&oh=00_AT_yGQvPnlXowhdv1vJMZTUlH3WR7wWIrmBxmwf-in-fAQ&oe=635C61D1",
// "https://reg.src.ku.ac.th/picnisit/6230300613.jpg",
// "https://scontent.fbkk11-1.fna.fbcdn.net/v/t31.18172-8/26026119_1517198738365928_3367443923681997490_o.jpg?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=BgelMjrsCO0AX-Y3CF-&_nc_ht=scontent.fbkk11-1.fna&oh=00_AT-Nw17Eb2ipLy7tF-F0CDpn4QsgbvTrW40Bg5aGY1cGFQ&oe=635CCE34",
// "https://reg.src.ku.ac.th/picnisit/6230300940.jpg"
// ]

const img = ["https://scontent.fbkk11-1.fna.fbcdn.net/v/t1.15752-9/309988707_617878566445361_1570679125544972732_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=ae9488&_nc_ohc=qHNyOSdd6WgAX9B2rOu&_nc_ht=scontent.fbkk11-1.fna&oh=03_AVJPfIbKSopASTuUfQMOjWeTKV0B6xG_nehLWQgWP-6HGg&oe=635F2D7A",
"https://scontent.fbkk11-1.fna.fbcdn.net/v/t1.6435-9/131928663_3454181011365096_4621079628178206031_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Vctc20hQOwwAX9AVjtV&tn=3R4TRMyMy9CrltMF&_nc_ht=scontent.fbkk11-1.fna&oh=00_AT_yGQvPnlXowhdv1vJMZTUlH3WR7wWIrmBxmwf-in-fAQ&oe=635C61D1",
"https://scontent.fbkk11-1.fna.fbcdn.net/v/t1.6435-9/31295219_1198077813662142_6706158766288535552_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=zid6i6WSTv8AX9lSLts&_nc_ht=scontent.fbkk11-1.fna&oh=00_AT_9asHNnKAMiuxIt4iLuCVQk3kW-81nW4iWrhblWwhUsg&oe=635E95CD",
"https://scontent.fbkk11-1.fna.fbcdn.net/v/t31.18172-8/26026119_1517198738365928_3367443923681997490_o.jpg?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=BgelMjrsCO0AX-Y3CF-&_nc_ht=scontent.fbkk11-1.fna&oh=00_AT-Nw17Eb2ipLy7tF-F0CDpn4QsgbvTrW40Bg5aGY1cGFQ&oe=635CCE34",
"https://scontent.fbkk11-1.fna.fbcdn.net/v/t1.6435-9/67400578_2432857260325031_7507000511489376256_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=a7IKphIvShMAX8ygu-s&_nc_ht=scontent.fbkk11-1.fna&oh=00_AT_L8Eg6hxdywrDDVS3YrR3ymvw7jXYRPg6uFEDgQEb_6A&oe=635F028C"
]

const TestScreen = () => {

  return (
    <div>
      <Navbar className="dashboard-nav" collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <i class="bi bi-person-square" style={{fontSize: "2em",color:'#fff', paddingRight:'1em'}}></i>
          <Navbar.Brand href="#home">ohmza</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Nav.Link></Nav.Link>
              <Nav.Link>Log Out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
        <div  style={{display:'flex', flexDirection:'column'}}>
            <h2  style={{color:'#52796f',alignSelf:'center'}}>Login success! You have permission to see our website.</h2>
            <h4  style={{color:'#52796f',alignSelf:'center'}}> zxohm2543@gmail.com</h4>
            
            <div style={{display:'flex', flexDirection:'column', alignSelf:'flex-end'}}>
                <button className="dashboard-nav" style={{width:'100vw', height:'5em',display:'flex'
                ,flexDirection:'row',justifyContent:'center',alignItems:'center',borderColor:'transparent'}}>
                   
                        <i class="bi bi-journal-text" style={{fontSize: "3em",color:'#cad2c5'}}></i> 
                        <h2 style={{color:'#cad2c5'}}>Logs</h2>

                </button>
            </div>

        <Accordion defaultActiveKey="0" flush >
            <Accordion.Item eventKey="0" >
                <Accordion.Header>Member</Accordion.Header>
                <Accordion.Body>
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>

                        <img src={img[0]} style={{borderRadius:'50%',height:'10em',margin: '1em'}} alt="Avatar"/>
                        <img src={img[1]} style={{borderRadius:'50%',height:'10em',margin: '1em'}} alt="Avatar"/>
                        <img src={img[2]} style={{borderRadius:'50%',height:'10em',margin: '1em'}} alt="Avatar"/>
                        <img src={img[3]} style={{borderRadius:'50%',height:'10em',margin: '1em'}} alt="Avatar"/>
                        <img src={img[4]} style={{borderRadius:'50%',height:'10em',margin: '1em'}} alt="Avatar"/>

                    </div>
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>
                    <h7 style={{color:"#52796f"}}>6230300141	นายคุณภัทร มีเจริญ</h7>
                    <h7 style={{color:"#52796f"}}>6230300583	นายประภวิษณุ์ ปัทมาสวิน	</h7>
                    <h7 style={{color:"#52796f"}}>6230300613	นายปุณยวีร์ โสมาบุตร</h7>
                    <h7 style={{color:"#52796f"}}>6230300923	นายศุภพงษ์ บุญปัญญา	</h7>
                    <h7 style={{color:"#52796f"}}>6230300940	นายสพล มหาวงศ์</h7>
                    
                    
                    
                    
                    </div>
                    
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Feature!!!</Accordion.Header>
                <Accordion.Body>
                <i class="bi bi-ui-checks-grid">&nbsp;Form validation</i><br/><br/>
                <i class="bi bi-person-bounding-box">&nbsp;Captcha authentication</i><br/><br/>
                <i class="bi bi-123">&nbsp;&nbsp;Passwork weakness checker</i><br/><br/>
                <h>&nbsp;&nbsp;&nbsp;</h><i class="bi bi-book">&nbsp;&nbsp;Dictionary attack</i><br/><br/>
                <h>&nbsp;&nbsp;&nbsp;</h><i class="bi bi-calendar-date">&nbsp;&nbsp;Birthday attack</i><br/><br/>
                
                <i class="bi bi-journal-text"> Logging</i><br/>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>


        </div>

    </div>
  );
};

export default TestScreen;