import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import "./LandingPage.css";

const initialAuctions = [
  { id: 1, name: "iPhone", image: "/images/iphone.webp", price: 75999, highestBid: 75999, timeLeft: 172800 }, // 2 days
  { id: 2, name: "Laptop", image: "/images/laptop.jpg", price: 69999, highestBid: 69999, timeLeft: 259200 }, // 3 days
  { id: 3, name: "Watch", image: "/images/watch1.webp", price: 4999, highestBid: 4999, timeLeft: 86400 }, // 1 day
  { id: 4, name: "Headphone", image: "/images/headphone.jpg", price: 6999, highestBid: 6999, timeLeft: 43200 }, // 12 hours
];

// Utility function to format time
const formatTimeLeft = (timeLeft) => {
  const days = Math.floor(timeLeft / 86400); // 1 day = 86400 seconds
  const hours = Math.floor((timeLeft % 86400) / 3600); // Remaining hours
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  if (timeLeft <= 0) return "Auction Closed";
  
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
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
          timeLeft: auction.timeLeft > 0 ? auction.timeLeft - 1 : 0,
          status: auction.timeLeft <= 1 ? "Closed" : "Active",
        }));
        localStorage.setItem("auctions", JSON.stringify(updatedAuctions));
        return updatedAuctions;
      });
    }, 1000);

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
    if (newAuction.name && newAuction.image && newAuction.price) {
      const newItem = {
        id: auctions.length + 1,
        name: newAuction.name,
        image: newAuction.image,
        price: parseInt(newAuction.price),
        highestBid: parseInt(newAuction.price),
        timeLeft: parseInt(newAuction.timeLeft),
        status: "Active",
      };
      const updatedAuctions = [...auctions, newItem];
      setAuctions(updatedAuctions);
      localStorage.setItem("auctions", JSON.stringify(updatedAuctions));
      setNewAuction({ name: "", image: "", price: "", timeLeft: 86400 });
    }
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
          <h1 className="fw-bold">
            Welcome to <span className="brand">AuctionKart</span>
          </h1>
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

      {/* Trending Auctions */}
      <h2 className="mt-4">🔥 Trending Auctions</h2>
      <Row className="mt-3">
        {filteredAuctions.length > 0 ? (
          filteredAuctions.map((item, index) => (
            <Col md={3} key={index}>
              <Card className="product-card">
                <Card.Img variant="top" src={item.image} className="auction-img" />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    <strong>Starting Price:</strong> ₹{item.price} <br />
                    <strong>Highest Bid:</strong> ₹{item.highestBid} <br />
                    <strong>Status:</strong> {item.timeLeft > 0 ? "Active" : "Closed"} <br />
                    {item.timeLeft > 0 ? (
                      <small>Time Left: {formatTimeLeft(item.timeLeft)}</small>
                    ) : (
                      <span className="text-danger">Auction Closed</span>
                    )}
                  </Card.Text>
                  {isAuthenticated && item.timeLeft > 0 ? (
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleBid(item.id, parseInt(e.target.bid.value));
                        e.target.reset();
                      }}
                    >
                      <Form.Group>
                        <Form.Control type="number" name="bid" min={item.highestBid + 1} placeholder="Enter bid" required />
                      </Form.Group>
                      <Button type="submit" variant="success" className="mt-2">Place Bid</Button>
                    </Form>
                  ) : (
                    <Button variant="secondary" disabled>Bid Now</Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center">
            <h4 className="text-danger mt-3">❌ No auctions found!</h4>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default LandingPage;
