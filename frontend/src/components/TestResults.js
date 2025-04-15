import { Box, CircularProgress, Container, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTestResults } from '../services/testService';

const TestResults = () => {
    const { testId } = useParams();
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await getTestResults(testId);
                setResults(data);
            } catch (err) {
                setError('Failed to fetch test results');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [testId]);

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
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
            </Container>
        );
    }

    if (!results) {
        return (
            <Container>
                <Typography variant="h6">
                    No results found for this test
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Test Results
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">
                        Score: {results.score} / {results.totalQuestions}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Time Taken: {results.timeTaken} minutes
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Date: {new Date(results.submittedAt).toLocaleDateString()}
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default TestResults; 