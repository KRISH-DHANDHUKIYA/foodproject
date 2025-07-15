// import { useState } from "react";
// import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
// import { Link } from "react-router-dom";

// function Login({ show, handleClose, switchToSignup }) {
//     const [form, setForm] = useState({ email: "", password: "" });
//     const [alertMessage, setAlertMessage] = useState("");
//     const [errors, setErrors] = useState({});

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//         setErrors({ ...errors, [e.target.name]: "" });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const newErrors = {};

//         if (!form.email.trim()) newErrors.email = "Email is required";
//         if (!form.password.trim()) newErrors.password = "Password is required";

//         if (Object.keys(newErrors).length > 0) {
//             setErrors(newErrors);
//             return;
//         }

//         console.log("Login Data:", form);
//         setAlertMessage("");
//         setErrors({});
//         handleClose();
//     };

//     return (
//         <>
//             <Modal show={show} onHide={handleClose} size="md" centered>
//                 <Modal.Body className="p-0">
//                     <Row className="g-0">
//                         <Col xs={12} className="p-4">
//                             {/* Modal Header */}
//                             <div className="d-flex justify-content-between align-items-center mb-3">
//                                 <h4 className="mb-0 fw-semibold">Login</h4>
//                                 <Button variant="light" size="sm" onClick={handleClose}>✕</Button>
//                             </div>

//                             {/* Alert Message */}
//                             {alertMessage && <Alert variant="info">{alertMessage}</Alert>}

//                             {/* Login Form */}
//                             <Form onSubmit={handleSubmit}>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Email</Form.Label>
//                                     <Form.Control type="email" name="email" placeholder="Enter your email" value={form.email} onChange={handleChange} isInvalid={!!errors.email} />
//                                     <Form.Control.Feedback type="invalid">
//                                         {errors.email}
//                                     </Form.Control.Feedback>
//                                 </Form.Group>

//                                 <Form.Group className="mb-4">
//                                     <Form.Label>Password</Form.Label>
//                                     <Form.Control type="password" name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} isInvalid={!!errors.password} />
//                                     <Form.Control.Feedback type="invalid">
//                                         {errors.password}
//                                     </Form.Control.Feedback>
//                                 </Form.Group>

//                                 <div className="text-end mb-3">
//                                     <Link to="/" style={{ fontSize: "0.9rem" }}>
//                                         Forgot Password?
//                                     </Link>
//                                 </div>

//                                 <Button type="submit" variant="primary" className="w-100 py-2">
//                                     Login
//                                 </Button>
//                             </Form>

//                             {/* Switch to Sign Up */}
//                             <div className="text-center mt-4">
//                                 Don’t have an account?{" "}
//                                 <span
//                                     onClick={switchToSignup}
//                                     style={{ cursor: "pointer", color: "#0d6efd", fontWeight: "500" }}>
//                                     Sign Up
//                                 </span>
//                             </div>
//                         </Col>
//                     </Row>
//                 </Modal.Body>
//             </Modal>
//         </>
//     );
// }

// export default Login;



import { useContext, useState, useEffect } from "react";
import { Button, Col, Container, Form, Row, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";
import loginimg from "../Assets/login.png";

const Login = () => {
    const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

    const [currState, setCurrState] = useState("Login"); // or "Sign Up"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            if (currState === "Sign Up") {
                const response = await axios.post(`${backendUrl}/api/register`, {
                    name,
                    email,
                    password,
                });

                // Check response data structure carefully
                if (response.data?.status) {
                    const tokenReceived = response.data.token || response.data.data?.token;
                    if (tokenReceived) {
                        setToken(tokenReceived);
                        localStorage.setItem("token", tokenReceived);
                        toast.success("Signup successful!");
                    } else {
                        toast.error("Signup failed: No token received");
                    }
                } else {
                    toast.error(response.data.message || "Signup failed");
                }
            } else {
                // Login flow
                const response = await axios.post(`${backendUrl}/api/login`, {
                    email,
                    password,
                });

                if (response.data?.status) {
                    const tokenReceived = response.data.token || response.data.data?.token;
                    if (tokenReceived) {
                        setToken(tokenReceived);
                        localStorage.setItem("token", tokenReceived);
                        toast.success("Login successful!");
                    } else {
                        toast.error("Login failed: No token received");
                    }
                } else {
                    toast.error(response.data.message || "Login failed");
                }
            }
        } catch (error) {
            console.error(error);
            if (error.response?.status === 409) {
                toast.error("Email already registered. Please login instead.");
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        }
    };

    useEffect(() => {
        // Redirect if token exists
        if (token) {
            navigate("/");
        }
    }, [token]);

    return (
        <section className="bg-white vh-100 d-flex align-items-center">
            <Container fluid>
                <Row className="h-100">
                    {/* Image side */}
                    <Col md={6} className="d-none d-md-block p-0">
                        <Image
                            src={loginimg}
                            alt="Login"
                            fluid
                            className="h-100 w-100 object-fit-cover"
                        />
                    </Col>

                    {/* Form side */}
                    <Col
                        xs={12}
                        md={6}
                        className="d-flex align-items-center justify-content-center"
                    >
                        <div className="w-100 px-4" style={{ maxWidth: "400px" }}>
                            <h3 className="text-center mb-4 fw-bold">{currState}</h3>

                            <Form onSubmit={onSubmitHandler}>
                                {currState === "Sign Up" && (
                                    <Form.Group className="mb-3" controlId="formName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            autoComplete="name"
                                        />
                                    </Form.Group>
                                )}

                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete={currState === "Sign Up" ? "new-password" : "current-password"}
                                    />
                                </Form.Group>

                                <Button type="submit" variant="primary" className="w-100 mb-3">
                                    {currState === "Sign Up" ? "Sign Up" : "Login"}
                                </Button>
                            </Form>

                            <div className="text-center">
                                {currState === "Login" ? (
                                    <p>
                                        Don’t have an account?{" "}
                                        <span
                                            className="text-primary fw-semibold"
                                            role="button"
                                            onClick={() => setCurrState("Sign Up")}
                                        >
                                            Create Account
                                        </span>
                                    </p>
                                ) : (
                                    <p>
                                        Already have an account?{" "}
                                        <span
                                            className="text-primary fw-semibold"
                                            role="button"
                                            onClick={() => setCurrState("Login")}
                                        >
                                            Login
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Login;
