import React from 'react';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';

const auctions = [
  { id: 1, title: "Phone", price: 5000, image: "https://via.placeholder.com/150?text=Phone" },
  { id: 2, title: "Laptop", price: 30000, image: "https://via.placeholder.com/150?text=Laptop" },
];

const Dashboard = () => {
  return (
    <div className="container mt-5">
      <h2>Active Auctions</h2>
      <Row>
        {auctions.map((auction) => (
          <Col md={4} key={auction.id}>
            <Card className="mb-3">
              <Card.Img variant="top" src={auction.image} />
              <Card.Body>
                <Card.Title>{auction.title}</Card.Title>
                <Card.Text>Current Price: ₹{auction.price}</Card.Text>
                <Button variant="success">Bid Now</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;
