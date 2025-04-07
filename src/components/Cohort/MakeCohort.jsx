import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Container, Paper, Divider, FormControl,InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

function MakeCohort() {
    const [inputs, setInputs] = useState({
        id: '',
        year: '',
    });

    const [degrees, setDegrees] = useState([]);
    const [selectedDegree, setSelectedDegree] = useState('');
    const [errors, setErrors] = useState({
        id: false,
        year: false,
        degree: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDegrees = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/degree/');
                const data = await response.json();
                setDegrees(data);
            } catch (err) {
                console.error("Error fetching degrees:", err);
            }
        };
        fetchDegrees();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
    };

    const handleDegreeChange = (e) => {
        setSelectedDegree(e.target.value);
        if (errors.degree) setErrors(prev => ({ ...prev, degree: false }));
    };

    const validateForm = () => {
        const newErrors = {
            id: inputs.id.trim() === '',
            year: inputs.year.trim() === '',
            degree: selectedDegree === ''
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
                id: inputs.id,
                year: parseInt(inputs.year),
                degree: selectedDegree
            };

            const response = await fetch('http://127.0.0.1:8000/api/cohort/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to create cohort');
            
            alert('Cohort created successfully!');
            window.location.href = '/cohorts';
        } catch (err) {
            setError(err.message);
            alert('Error creating cohort');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ pt: 8, pb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Create New Cohort
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
                        error={errors.id}
                        label="Cohort ID"
                        name="id"
                        value={inputs.id}
                        onChange={handleInputChange}
                        helperText={errors.id && "Cohort ID is required"}
                        disabled={loading}
                    />

                    <TextField
                        required
                        error={errors.year}
                        label="Year"
                        name="year"
                        value={inputs.year}
                        onChange={handleInputChange}
                        helperText={errors.year && "Year is required"}
                        type="number"
                        inputProps={{ min: 1, max: 4 }}
                        disabled={loading}
                    />

                    <FormControl fullWidth error={errors.degree} disabled={loading}>
                        <InputLabel>Degree</InputLabel>
                        <Select
                            value={selectedDegree}
                            onChange={handleDegreeChange}
                            label="Degree"
                        >
                            {degrees.map((degree) => (
                                <MenuItem 
                                    key={degree.shortcode} 
                                    value={`http://127.0.0.1:8000/api/degree/${degree.shortcode}/`}
                                >
                                    {degree.full_name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.degree && (
                            <FormHelperText>Please select a degree</FormHelperText>
                        )}
                    </FormControl>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button 
                            variant="outlined" 
                            href="/cohorts" 
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
                            {loading ? 'Creating...' : 'Create Cohort'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default MakeCohort;