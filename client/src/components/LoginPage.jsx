import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok) {
                // Store token in localStorage or handle it accordingly
                localStorage.setItem('token', result.token);
                navigate('/home');
            } else {
                alert(result.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        }
    };

    return (
        <Container fluid>
            <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Col lg={3}>
                    <Form style={styles.form} onSubmit={handleLogin}>
                        <h2 className="text-center" style={styles.header}>Login</h2>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" style={styles.button}>
                            Login
                        </Button>
                        <div className="text-center" style={styles.signupText}>
                            Don't have an account? <Link to="/signup">Sign up</Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

const styles = {
    form: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    header: {
        marginBottom: '20px',
    },
    button: {
        width: '100%',
        marginTop: '10px',
    },
    signupText: {
        marginTop: '15px',
    }
};

export default LoginPage;
