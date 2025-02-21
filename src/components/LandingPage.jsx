import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import "./LandingPage.css";

const initialAuctions = [
  { id: 1, name: "iPhone", image: "/images/iphone.webp", price: 75999, highestBid: 75999, timeLeft: 172800 }, 
  { id: 2, name: "Laptop", image: "/images/laptop.jpg", price: 69999, highestBid: 69999, timeLeft: 259200 }, 
  { id: 3, name: "Watch", image: "/images/watch1.webp", price: 4999, highestBid: 4999, timeLeft: 86400 }, 
  { id: 4, name: "Headphone", image: "/images/headphone.jpg", price: 6999, highestBid: 6999, timeLeft: 43200 }, 
];

const formatTimeLeft = (timeLeft) => {
  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  return timeLeft <= 0 ? "Auction Closed" : `${days}d ${hours}h ${minutes}m`;
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [auctions, setAuctions] = useState(() => {
    const savedAuctions = JSON.parse(localStorage.getItem("auctions"));
    return savedAuctions || initialAuctions;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [newAuction, setNewAuction] = useState({ name: "", image: "", price: "", timeLeft: 86400 });
  const postAuctionRef = useRef(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setIsAuthenticated(true);

    const timer = setInterval(() => {
      setAuctions((prevAuctions) => {
        const updatedAuctions = prevAuctions.map((auction) => ({
          ...auction,
          timeLeft: auction.timeLeft > 0 ? auction.timeLeft - 60 : 0,
        }));
        localStorage.setItem("auctions", JSON.stringify(updatedAuctions));
        return updatedAuctions;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleBid = (id, bidAmount) => {
    setAuctions((prev) => {
      const updatedAuctions = prev.map((auction) =>
        auction.id === id && bidAmount > auction.highestBid
          ? { ...auction, highestBid: bidAmount }
          : auction
      );
      localStorage.setItem("auctions", JSON.stringify(updatedAuctions));
      return updatedAuctions;
    });
  };

  const handlePostAuction = () => {
    if (!newAuction.name || !newAuction.image || !newAuction.price) {
      alert("Please fill all fields.");
      return;
    }

    const newItem = {
      id: auctions.length + 1,
      name: newAuction.name,
      image: newAuction.image,
      price: parseInt(newAuction.price),
      highestBid: parseInt(newAuction.price),
      timeLeft: parseInt(newAuction.timeLeft),
    };

    const updatedAuctions = [...auctions, newItem];
    setAuctions(updatedAuctions);
    localStorage.setItem("auctions", JSON.stringify(updatedAuctions));
    setNewAuction({ name: "", image: "", price: "", timeLeft: 86400 });
  };

  const scrollToPostAuction = () => {
    postAuctionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredAuctions = auctions.filter((auction) =>
    auction.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container className="mt-4">
      {/* Header Section */}
      <Row className="d-flex justify-content-between align-items-center mb-3">
        <Col>
          <h1 className="fw-bold">Welcome to <span className="brand">AuctionKart</span></h1>
        </Col>
        <Col className="text-end">
          {isAuthenticated ? (
            <>
              <Button
                variant="danger"
                className="me-3"
                onClick={() => {
                  localStorage.removeItem("user");
                  setIsAuthenticated(false);
                  navigate("/signin");
                }}
              >
                Logout
              </Button>
              <Button variant="warning" onClick={scrollToPostAuction}>
                Post Auction
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" as={Link} to="/signup" className="me-2">
                Sign Up
              </Button>
              <Button variant="success" as={Link} to="/signin">
                Sign In
              </Button>
            </>
          )}
        </Col>
      </Row>

      {/* Search Bar */}
      <Row className="mt-3">
        <Col md={6} className="mx-auto">
          <Form.Control
            type="text"
            placeholder="🔍 Search Auctions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
      </Row>

      {/* Auctions List */}
      <h2 className="mt-4">🔥 Trending Auctions</h2>
      <Row className="mt-3">
        {filteredAuctions.map((item) => (
          <Col md={3} key={item.id}>
            <Card className="product-card">
              <Card.Img variant="top" src={item.image} className="auction-img" />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                  <strong>Starting Price:</strong> ₹{item.price} <br />
                  <strong>Highest Bid:</strong> ₹{item.highestBid} <br />
                  <strong>Time Left:</strong> {formatTimeLeft(item.timeLeft)}
                </Card.Text>
                {isAuthenticated && item.timeLeft > 0 ? (
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleBid(item.id, parseInt(e.target.bid.value));
                      e.target.reset();
                    }}
                  >
                    <Form.Control type="number" name="bid" min={item.highestBid + 1} placeholder="Enter bid" required />
                    <Button type="submit" variant="success" className="mt-2">Place Bid</Button>
                  </Form>
                ) : (
                  <Button variant="secondary" disabled>Bid Now</Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Post Auction Section */}
      <div ref={postAuctionRef} className="mt-5">
        <h3 className="text-center">📝 Post a New Auction</h3>
        <Form className="mt-3">
          <Form.Control type="text" placeholder="Item Name" value={newAuction.name} onChange={(e) => setNewAuction({ ...newAuction, name: e.target.value })} className="mb-2" />
          <Form.Control type="text" placeholder="Image URL" value={newAuction.image} onChange={(e) => setNewAuction({ ...newAuction, image: e.target.value })} className="mb-2" />
          <Form.Control type="number" placeholder="Starting Price (₹)" value={newAuction.price} onChange={(e) => setNewAuction({ ...newAuction, price: e.target.value })} className="mb-2" />
          <Button variant="success" onClick={handlePostAuction}>Post Auction</Button>
        </Form>
      </div>
    </Container>
  );
};

export default LandingPage;
