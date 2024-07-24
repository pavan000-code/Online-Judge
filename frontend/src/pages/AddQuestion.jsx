import React, { useState } from "react";
import axios from "axios";
import { Container, Paper, Typography, TextField, Button, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50",
    },
  },
});

const AddQuestion = () => {
  const [formData, setFormData] = useState({
    questionName: "",
    difficulty: "",
    code: "",
    description: "",
    testCaseInput: "",
    testCaseOutput: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token is missing");
        return;
      }

      const response = await axios.post("http://65.2.4.84:8000/questions", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        navigate("/dashboard");
      } else {
        setError("Failed to add question");
      }
    } catch (error) {
      console.error("Error adding question", error);
      setError("Failed to add question");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <Paper elevation={3} style={{ padding: "20px", marginTop: "30px" }}>
          <Typography component="h1" variant="h5" color="primary" gutterBottom>
            Add Question
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
              id="questionName"
              label="Question Name"
              name="questionName"
              autoFocus
              value={formData.questionName}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="difficulty"
              label="Difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="code"
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="testCaseInput"
              label="Test Case Input"
              name="testCaseInput"
              multiline
              rows={2}
              value={formData.testCaseInput}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="testCaseOutput"
              label="Test Case Output"
              name="testCaseOutput"
              multiline
              rows={2}
              value={formData.testCaseOutput}
              onChange={handleChange}
            />
            <Box display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained" color="primary">
                Add Question
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default AddQuestion;
