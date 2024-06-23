import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import {Editor} from '@monaco-editor/react';


const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50",
    },
  },
});

const QuestionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [userInput, setUserInput] = useState("");
  const [submissionResult, setSubmissionResult] = useState("");

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`http://localhost:8000/questions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuestion(response.data);
        setCode(response.data.code); // Set the initial code if any
      } catch (error) {
        console.error("Error fetching question", error);
        setError("Failed to load question");
      }
    };

    fetchQuestion();
  }, [id]);

  const handleRunCode = async () => {
    setOutput(""); // Clear the output box
    setSubmissionResult(""); // Clear the submission result
    try {
      const response = await axios.post(
        `http://localhost:8000/run`,
        {
          language,
          code,
          input: userInput,
        }
      );
      setOutput(response.data.output);
    } catch (error) {
      console.error("Error running code", error);
      setOutput("Failed to run code");
    }
  };

  const handleSubmitCode = async () => {
    setOutput(""); // Clear the output box
    setSubmissionResult(""); // Clear the submission result
    try {
      console.log("Submitting code...");
      const response = await axios.post(
        `http://localhost:8000/submit`,
        {
          language,
          code,
          questionId: id,
          input: userInput,
        }
      );
      console.log("Submission response:", response.data);
      const passedAllTestCases = response.data.passedAllTestCases;
      if (passedAllTestCases) {
        setSubmissionResult("Code submitted successfully");
      } else {
        setSubmissionResult("Please check your code. It did not pass all the test cases.");
      }
      setOutput(response.data.output);
    } catch (error) {
      console.error("Error submitting code", error);
      setSubmissionResult("Failed to submit code");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  if (error) {
    return (
      <Typography color="error" variant="body2" align="center">
        {error}
      </Typography>
    );
  }

  if (!question) {
    return <Typography align="center">Loading...</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg">
        <Paper elevation={3} style={{ padding: "20px", marginTop: "30px" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleGoBack}
                style={{ marginRight: "10px" }}
              >
                Go Back
              </Button>
              <Box>
                <Typography component="h1" variant="h5" color="primary" gutterBottom>
                  {question.questionName}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center">
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ marginRight: "10px" }}
              >
                <MenuItem value="cpp">C++</MenuItem>
                <MenuItem value="java">Java</MenuItem>
                <MenuItem value="python">Python</MenuItem>
                <MenuItem value="javascript">JavaScript</MenuItem>
              </Select>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Box>
          <Typography color="textSecondary" gutterBottom>
            Difficulty: {question.difficulty}
          </Typography>
          <Typography variant="body1" component="p" style={{ whiteSpace: "pre-line" }}>
            {question.description}
          </Typography>
          {question.testCases && question.testCases.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Test Cases:
              </Typography>
              {question.testCases.map((testCase, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="body2">
                    <strong>Input:</strong> {testCase.input}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Output:</strong> {testCase.output}
                  </Typography>
                </Box>
              ))}
            </>
          )}
          <Box mt={2}>
            <Typography variant="h6">Code Editor</Typography>
            <Editor
              height="400px"
              language={language}
              value={code}
              onChange={(newValue) => setCode(newValue)}
              theme="vs-dark"
            />
          </Box>
          <Box mt={2}>
            <TextField
              fullWidth
              label="Input"
              variant="outlined"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleRunCode}>
              Run
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmitCode}>
              Submit
            </Button>
          </Box>
          <Box mt={2}>
            <Typography variant="h6">Output:</Typography>
            <Paper elevation={1} style={{ padding: "10px", backgroundColor: "#f5f5f5" }}>
              <pre>{submissionResult}</pre>
              <pre>{output}</pre>
            </Paper>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default QuestionDetails;
