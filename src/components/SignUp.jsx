import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";

const SignUp = () => {
  const { signUp } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = signUp(formData.email, formData.password, formData.name);
    
    if (result.error) {
      setMessage({ type: "danger", text: result.error });
    } else {
      setMessage({ type: "success", text: result.success });
      setTimeout(() => navigate("/signin"), 2000);
    }
  };

  return (
    <Container>
      <h2>Sign Up</h2>
      {message && <Alert variant={message.type}>{message.text}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
        </Form.Group>

        <Button variant="primary" type="submit">Sign Up</Button>
      </Form>
    </Container>
  );
};

export default SignUp;
