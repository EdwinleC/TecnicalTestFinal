import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('data',email,password);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                email, 
                password
            });
            console.log(response.data);
            navigate('/login'); 
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || 'Failed to register. Please try again.');
            } else {
                setError('Failed to register. Please try again.');
            }
            console.error(err);
        }
    };

    return (
        <Container fluid>
            <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Col lg={3}>
                    <Form onSubmit={handleSubmit} style={styles.form}>
                        <h2 className="text-center" style={styles.header}>Sign Up</h2>
                        {error && <div style={styles.error}>{error}</div>}
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" style={styles.button}>
                            Sign Up
                        </Button>
                        <div className="text-center" style={styles.loginText}>
                            Already have an account? <Link to="/login">Login</Link>
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
    loginText: {
        marginTop: '15px',
    },
    error: {
        color: 'red',
        marginBottom: '15px',
    }
};

export default SignupPage;
