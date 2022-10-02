import React, { useRef, useState, useEffect } from 'react';
import Recaptcha from "react-google-recaptcha";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./DashboardScreen.css";

import {Navbar, Nav, Container, Table, Stack, NavDropdown} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';



const DashboardScreen = () => {
  const [counter, setCounter] = useState(0);
  const [error, setError] = useState("");
  const [data,setData] = useState({})
  const [page,setPage] = useState(1)
  const [logData, setLogData] = useState([{_id:"",dateLog:"",email:"",message:"Fetch data again!!!"}]);
  const [privateData, setPrivateData] = useState({message: "", user: {username: "", email: ""}});

  const { ExportCSVButton } = CSVExport;

  let navigate  = useNavigate();
  const dateNow = Date.now()
  const timeOptions = {weekday:'long',day: 'numeric',month: 'short',year: 'numeric',hour:'numeric',minute:'numeric',timeZone:'Asia/Jakarta',timeZoneName:'short'};
  
  const MyExportCSV = (props) => {
    const handleClick = () => {
      props.onExport()
    }
    return(
      <div style={{marginBottom: '1em', marginTop: '1em', justifyContent:'flex-end', display:'flex'}}>
        <button className="btn btn-warning" style={{width:'150px', marginRight:'2em'}} 
          onClick={fetchLogData}><i class="bi bi-arrow-repeat" style={{fontSize: "1em",color:'#fff'}} ></i> Fetch Log</button>
        <button className="btn btn-success" style={{width:'200px', marginRight:'2em'}} 
          onClick={handleClick}><i class="bi bi-box-arrow-up-right" style={{fontSize: "1em",color:'#fff'}}></i> Export to CSV</button>
      </div>
    )
      
  }
  const columns = [
    {dataField: '_id', text: 'ID', sort: true, filter: textFilter()},
    {dataField: 'dateLog', text: 'Date', sort: true, filter: textFilter()},
    {dataField: 'email', text: 'Email', sort: true, filter: textFilter()},
    {dataField: 'message', text: 'Message', sort: true, filter: textFilter()},
  ]
  
  const pagination = paginationFactory({
    page: 1,
    sizePerPageList:[ {
      text: '10', value: 10
    }, {
      text: '25', value: 25
    }, {
      text: '50', value: 50
    }, {
      text: '100', value: 100
    }, {
      text: 'All', value: logData.length
    } ],
    lastPageText: '>>',
    firstPageText: '<<',
    nextPageText: '>',
    prePageText: '<',
    showTotal: true,
    alwaysShowAllBtns: true,
    onPageChange: function (page, sizePerPage) {
      console.log('page', page);
      console.log('sizePerpage', sizePerPage);
    },
    onSizePerPageChange: function (page, sizePerPage) {
      console.log('page', page);
      console.log('sizePerpage', sizePerPage);
    },
  })

  const fetchPrivateData = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.get("/api/private", config);
      setPrivateData(data.data);
      console.log(data.data.user.username);
    } catch (error) {
      localStorage.removeItem("authToken");
      setError("You are not authorized please login");
    }
  };

  const fetchLogData = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.get("/api/private/getlog", config);
      setLogData(data);
      console.log("setLogData: ",data);
    } catch (error) {
      localStorage.removeItem("authToken");
      setError("You are not authorized please login");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter);
    }, 1000);
  
    fetchLogData();
    fetchPrivateData();
    return () => clearInterval(interval);
  }, []);

  const listItems = logData.map((event, index) => {
    const date = event.dateLog
    let date2 = date.toString()
    return (
        <tr>
          <td>{index+1}</td>
          <td>{event.dateLog}</td>
          <td>{event.email}</td>
          <td>{event.message}</td>
        </tr>
    )}
  );

  const logoutHandler = async () => {
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    await axios.post("/api/auth/addlog", {
      email: privateData.user.email,
      message: `Logout Successfully (${ new Date(dateNow).toLocaleString('en-US',timeOptions)})`,
    })
      .then(res => {
         console.log(res)
          localStorage.removeItem("authToken");
          navigate("/login")
      })
      .catch((error) => {
      console.log(error);
      })
  }

  
  return(
    <div>
      <Navbar collapseOnSelect expand="lg" className='dashboard-nav'>
        <Container>
          <i class="bi bi-clipboard-data" style={{fontSize: "2em",color:'#fff', paddingRight:'1em'}}></i>  <h1>Counter: {counter}</h1>
          <Navbar.Brand href="#home">Log Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Nav.Link href="/login" onClick={logoutHandler}>Sign out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <ToolkitProvider
        bootstrap4
        keyField='id'
        data={logData}
        columns={columns}
        exportCSV={ {
          noAutoBOM: false,
          blobType: 'text/plain;charset=utf-8', 
        } }
      >
        {
          props => (
          <React.Fragment>
            <MyExportCSV {...props.csvProps}/>
            <BootstrapTable 
            // keyField='id' 
            // columns={columns} 
            // data={logData}
            pagination={pagination}
            filter={filterFactory()}
            {...props.baseProps}
            />
          </React.Fragment>
          )
        }
      </ToolkitProvider>

    </div>
    )
};
export default DashboardScreen;
