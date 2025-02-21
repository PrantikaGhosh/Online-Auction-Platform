import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";

const SignIn = () => {
  const { signIn } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = signIn(formData.email, formData.password);
    
    if (result.error) {
      setMessage({ type: "danger", text: result.error });
    } else {
      setMessage({ type: "success", text: result.success });
      
      // Redirect to Landing Page ("/") after sign-in
      setTimeout(() => {
        navigate("/");
        window.location.reload(); // Ensures proper state update
      }, 2000);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Sign In</h2>
      {message && <Alert variant={message.type}>{message.text}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </Form.Group>

        <Button className="mt-3 w-100" variant="primary" type="submit">
          Sign In
        </Button>
      </Form>
    </Container>
  );
};

export default SignIn;
