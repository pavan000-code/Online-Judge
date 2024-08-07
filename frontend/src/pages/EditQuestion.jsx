import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50",
    },
  },
});

const EditQuestion = () => {
  const { questionId } = useParams();
  const [questionName, setQuestionName] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [testCases, setTestCases] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://65.2.4.84:8000/questions/${questionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const question = response.data;
        setQuestionName(question.questionName);
        setDifficulty(question.difficulty);
        setDescription(question.description);
        setCode(question.code || "");
        setTestCases(question.testCases || []);
      } catch (error) {
        console.error("Error fetching question", error);
        setError("Failed to load question");
      }
    };

    fetchQuestion();
  }, [questionId]);

  const handleUpdateQuestion = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `http://65.1.64.51:8000/questions/${questionId}`,
        { questionName, difficulty, description, code, testCases },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating question", error);
      setError("Failed to update question");
    }
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index] = {
      ...updatedTestCases[index],
      [field]: value,
    };
    setTestCases(updatedTestCases);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <Paper elevation={3} style={{ padding: "20px", marginTop: "30px" }}>
          <Typography component="h1" variant="h5" color="primary" gutterBottom>
            Edit Question
          </Typography>
          {error && (
            <Typography color="error" variant="body2" align="center">
              {error}
            </Typography>
          )}
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Question Name"
              value={questionName}
              onChange={(e) => setQuestionName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              multiline
              rows={8}
              fullWidth
            />
            <Typography variant="h6" gutterBottom>
              Test Cases
            </Typography>
            {testCases.map((testCase, index) => (
              <Box
                key={index}
                display="flex"
                gap={2}
                alignItems="center"
                mb={2}
              >
                <TextField
                  label={`Input ${index + 1}`}
                  value={testCase.input}
                  onChange={(e) =>
                    handleTestCaseChange(index, "input", e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label={`Output ${index + 1}`}
                  value={testCase.output}
                  onChange={(e) =>
                    handleTestCaseChange(index, "output", e.target.value)
                  }
                  fullWidth
                />
              </Box>
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateQuestion}
            >
              Update Question
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default EditQuestion;
