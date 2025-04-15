import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Chip,
    CircularProgress,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getAllTestResults } from '../services/testService';

const Result = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadResults = async () => {
            try {
                setLoading(true);
                const response = await getAllTestResults();
                console.log('API Response:', response);
                
                if (response && response.success) {
                    if (response.data && Array.isArray(response.data)) {
                        console.log('Setting results:', response.data);
                        setResults(response.data);
                    } else {
                        console.log('No data array in response');
                        setResults([]);
                    }
                } else {
                    setResults([]);
                }
            } catch (err) {
                console.error('Error loading results:', err);
                setError(err.message || 'Failed to load test results');
            } finally {
                setLoading(false);
            }
        };

        loadResults();
    }, []);

    if (loading) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                    <Typography color="error" variant="h6">
                        Error: {error}
                    </Typography>
                </Paper>
            </Container>
        );
    }

    if (!results || results.length === 0) {
        return (
            <Container>
                <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                    <Typography variant="h6" align="center">
                        No test results found
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container>
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Test Results
                </Typography>
                {results.map((result) => (
                    <Accordion key={result._id} sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">
                                    {result.testId.title}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Chip 
                                        label={`Score: ${result.totalMarks}/${result.testId.totalQuestions * result.testId.rightMarks}`}
                                        color="primary"
                                    />
                                    <Chip 
                                        label={`Percentage: ${result.percentage}%`}
                                        color={parseFloat(result.percentage) >= 50 ? "success" : "error"}
                                    />
                                </Box>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Question</TableCell>
                                            <TableCell>Your Answer</TableCell>
                                            <TableCell>Correct Answer</TableCell>
                                            <TableCell>Marks</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {result.questionResults.map((question, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{question.question}</TableCell>
                                                <TableCell>{question.studentAnswer || 'Not Attempted'}</TableCell>
                                                <TableCell>{question.correctAnswer}</TableCell>
                                                <TableCell>{question.marksObtained}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={question.isCorrect ? "Correct" : "Wrong"}
                                                        color={question.isCorrect ? "success" : "error"}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Subject: {result.testId.subject}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Class: {result.testId.class}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Date: {new Date(result.submittedAt).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Paper>
        </Container>
    );
};

export default Result; 