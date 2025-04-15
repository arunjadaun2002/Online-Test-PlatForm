import {
    Box,
    Chip,
    CircularProgress,
    Container,
    Grid,
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

const StudentTestResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await getAllTestResults();
                if (data && Array.isArray(data)) {
                    setResults(data);
                } else {
                    setResults([]);
                }
            } catch (err) {
                setError('Failed to fetch test results');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
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
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
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
                <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4">
                            My Test Results
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
                        {results[0]?.testId?.class && (
                            <Chip 
                                label={results[0].testId.class} 
                                color="primary" 
                                sx={{ fontSize: '1.1rem', padding: '8px 16px' }}
                            />
                        )}
                    </Grid>
                </Grid>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Test Title</TableCell>
                                <TableCell>Subject</TableCell>
                                <TableCell>Score</TableCell>
                                <TableCell>Percentage</TableCell>
                                <TableCell>Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.map((result) => (
                                <TableRow key={result._id}>
                                    <TableCell>{result.testId?.title || 'N/A'}</TableCell>
                                    <TableCell>{result.testId?.subject || 'N/A'}</TableCell>
                                    <TableCell>
                                        {result.totalMarks} / {result.testId?.totalQuestions * result.testId?.rightMarks}
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={`${result.percentage}%`}
                                            color={result.percentage >= 60 ? 'success' : 'error'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(result.submittedAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default StudentTestResults; 