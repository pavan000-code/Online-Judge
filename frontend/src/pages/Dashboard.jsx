import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50",
    },
  },
});

const Dashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:8000/questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions", error);
        setError("Failed to load questions");
      }
    };

    fetchQuestions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleCardClick = (questionId) => {
    navigate(`/question/${questionId}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <Paper elevation={3} style={{ padding: "20px", marginTop: "30px" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography component="h1" variant="h5" color="primary" gutterBottom>
              Questions
            </Typography>
            <Button variant="contained" color="primary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
          {error && (
            <Typography color="error" variant="body2" align="center">
              {error}
            </Typography>
          )}
          <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={3}>
            {questions.map((question) => (
              <Card
                key={question._id}
                onClick={() => handleCardClick(question._id)}
                style={{ cursor: "pointer" }}
              >
                <CardContent>
                  <Typography variant="h6" component="div">
                    {question.questionName}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Difficulty: {question.difficulty}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Dashboard;
