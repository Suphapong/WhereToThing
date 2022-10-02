import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

  const options = [
    {
      name: 'Enable body scrolling',
      scroll: true,
      backdrop: false,
    }
  ];

export default function Report({ name, ...props }) {

  return (
    <Offcanvas 
    show={props.show} 
    onHide={props.onHide} 
    placement={'end'} 
    scroll={true}
    backdrop={false}
    {...props}>
    <Offcanvas.Header closeButton>
        <Offcanvas.Title>Report</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
        Some text as placeholder. In real life you can have the elements you
        have chosen. Like, text, images, lists, etc.
    </Offcanvas.Body>
    </Offcanvas>
  );
}

