import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import loginbg from '/public/assets/loginbg.svg';

const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50",
    },
  },
});

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "/api/login",
        formData
      );
      const { token } = response.data;

      // Store the token in localStorage
      localStorage.setItem("authToken", token);

      // Redirect to dashboard page after successful login
      navigate("/dashboard");
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data === "User not found"
      ) {
        // Redirect to register page if account does not exist
        navigate("/register");
      } else {
        console.error("Login error", error);
        setError("Login failed. Please check your email and password.");
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            backgroundImage: `url(${loginbg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: "20px", marginTop: "30px" }}>
              <Typography
                component="h1"
                variant="h5"
                align="center"
                color="primary"
              >
                Login
              </Typography>
              {error && (
                <Typography color="error" variant="body2" align="center">
                  {error}
                </Typography>
              )}
              <form onSubmit={handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "20px" }}
                >
                  Login
                </Button>
              </form>
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
