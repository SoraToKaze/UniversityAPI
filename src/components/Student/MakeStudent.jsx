import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Container, Paper, Divider, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

function NewStudent() {
    const [inputs, setInputs] = useState({
        student_id: '',
        first_name: '',
        last_name: ''
    });

    const [cohorts, setCohorts] = useState([]);
    const [selectedCohort, setSelectedCohort] = useState('');
    const [errors, setErrors] = useState({
        student_id: false,
        first_name: false,
        last_name: false,
        cohort: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCohorts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/cohort/');
                const data = await response.json();
                setCohorts(data);
            } catch (err) {
                console.error("Error fetching cohorts:", err);
            }
        };
        fetchCohorts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
    };

    const handleCohortChange = (e) => {
        setSelectedCohort(e.target.value);
        if (errors.cohort) setErrors(prev => ({ ...prev, cohort: false }));
    };

    const validateForm = () => {
        const newErrors = {
            student_id: inputs.student_id.trim() === '',
            first_name: inputs.first_name.trim() === '',
            last_name: inputs.last_name.trim() === '',
            cohort: selectedCohort === ''
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
            const payload = {
                student_id: inputs.student_id,
                first_name: inputs.first_name,
                last_name: inputs.last_name,
                cohort: selectedCohort
            };

            const response = await fetch('http://127.0.0.1:8000/api/student/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to create student');
            }

            alert('Student created successfully!');
            window.location.href = `/students/${inputs.student_id}`;
        } catch (err) {
            setError(err.message);
            alert(`Error creating student: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ pt: 8, pb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Create New Student
                </Typography>
                <Divider sx={{ my: 2 }} />

                {error && (
                    <Typography color="error" align="center" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <Box 
                    component="form" 
                    onSubmit={handleSubmit}
                    sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        '& .MuiTextField-root': { width: '100%' }
                    }}
                >
                    <TextField
                        required
                        error={errors.student_id}
                        label="Student ID"
                        name="student_id"
                        value={inputs.student_id}
                        onChange={handleInputChange}
                        helperText={errors.student_id && "Student ID is required"}
                        disabled={loading}
                    />

                    <TextField
                        required
                        error={errors.first_name}
                        label="First Name"
                        name="first_name"
                        value={inputs.first_name}
                        onChange={handleInputChange}
                        helperText={errors.first_name && "First name is required"}
                        disabled={loading}
                    />

                    <TextField
                        required
                        error={errors.last_name}
                        label="Last Name"
                        name="last_name"
                        value={inputs.last_name}
                        onChange={handleInputChange}
                        helperText={errors.last_name && "Last name is required"}
                        disabled={loading}
                    />

                    <FormControl fullWidth error={errors.cohort} disabled={loading}>
                        <InputLabel>Cohort</InputLabel>
                        <Select
                            value={selectedCohort}
                            onChange={handleCohortChange}
                            label="Cohort"
                        >
                            {cohorts.map((cohort) => (
                                <MenuItem 
                                    key={cohort.id} 
                                    value={`http://127.0.0.1:8000/api/cohort/${cohort.id}/`}
                                >
                                    {cohort.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.cohort && (
                            <FormHelperText>Please select a cohort</FormHelperText>
                        )}
                    </FormControl>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button 
                            variant="outlined" 
                            href="/students" 
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained"
                            disabled={loading}
                            sx={{ px: 4 }}
                        >
                            {loading ? 'Creating...' : 'Create Student'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default NewStudent;