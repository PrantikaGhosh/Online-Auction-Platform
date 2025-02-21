import React from 'react';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';

const PostAuction = () => {
  return (
    <div className="container mt-5">
      <h2>Post a New Auction</h2>
      <Form>
        <Form.Group controlId="productName">
          <Form.Label>Product Name</Form.Label>
          <Form.Control type="text" placeholder="Enter product name" />
        </Form.Group>

        <Form.Group controlId="productImage">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control type="file" />
        </Form.Group>

        <Form.Group controlId="startingBid">
          <Form.Label>Starting Bid</Form.Label>
          <Form.Control type="number" placeholder="Enter starting bid amount" />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Post Auction
        </Button>
      </Form>
    </div>
  );
};

export default PostAuction;
