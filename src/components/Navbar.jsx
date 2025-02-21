import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { Navbar, Nav, Form, FormControl, Button, Container } from "react-bootstrap";
import { FaShoppingCart, FaUserCircle, FaSearch } from "react-icons/fa";

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="px-3">
      <Navbar.Brand as={Link} to="/" className="fw-bold">🛒 AuctionKart</Navbar.Brand>
      <Form className="d-flex mx-auto w-50">
        <FormControl type="search" placeholder="Search for products..." className="me-2" />
        <Button variant="light"><FaSearch /></Button>
      </Form>
      <Nav>
        {!user ? (
          <>
            <Nav.Link as={Link} to="/signin"><FaUserCircle /> Sign In</Nav.Link>
            <Nav.Link as={Link} to="/signup">Register</Nav.Link>
          </>
        ) : (
          <>
            <Nav.Link as={Link} to="/dashboard">My Auctions</Nav.Link>
            <Nav.Link as={Link} to="/post-auction">Post Auction</Nav.Link>
            <Nav.Link as={Link} to="/cart"><FaShoppingCart /> Cart</Nav.Link>
            <Button variant="light" className="ms-2" onClick={logout}>Logout</Button>
          </>
        )}
      </Nav>
    </Navbar>
  );
};

export default Navigation;
