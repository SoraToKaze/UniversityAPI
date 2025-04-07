import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Container, Paper, Divider, FormControl, InputLabel, Select, MenuItem, FormHelperText, Chip, OutlinedInput } from '@mui/material';

function NewModule() {
    const [inputs, setInputs] = useState({
        code: '',
        full_name: '',
        ca_split: '',
    });

    const [cohorts, setCohorts] = useState([]);
    const [selectedCohorts, setSelectedCohorts] = useState([]);
    const [errors, setErrors] = useState({
        code: false,
        full_name: false,
        delivered_to: false,
        ca_split: false
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

    const handleCohortChange = (event) => {
        const { value } = event.target;
        setSelectedCohorts(typeof value === 'string' ? value.split(',') : value);
        if (errors.delivered_to) setErrors(prev => ({ ...prev, delivered_to: false }));
    };

    const getCohortName = (url) => {
        const id = url.split('/')[url.split('/').length - 2];
        const cohort = cohorts.find(c => c.id === id);
        return cohort ? cohort.name : '';
    };

    const validateForm = () => {
        const newErrors = {
            code: inputs.code.trim() === '',
            full_name: inputs.full_name.trim() === '',
            delivered_to: selectedCohorts.length === 0,
            ca_split: inputs.ca_split.trim() === ''
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
                code: inputs.code,
                full_name: inputs.full_name,
                delivered_to: selectedCohorts,
                ca_split: parseInt(inputs.ca_split)
            };

            const response = await fetch('http://127.0.0.1:8000/api/module/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to create module');
            
            alert('Module created successfully!');
            window.location.reload();
        } catch (err) {
            setError(err.message);
            alert('Error creating module');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ pt: 8, pb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Create New Module
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
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                            required
                            error={errors.code}
                            label="Module Code"
                            name="code"
                            value={inputs.code}
                            onChange={handleInputChange}
                            helperText={errors.code && "Module code is required"}
                            disabled={loading}
                        />
                        <TextField
                            required
                            error={errors.full_name}
                            label="Full Name"
                            name="full_name"
                            value={inputs.full_name}
                            onChange={handleInputChange}
                            helperText={errors.full_name && "Full name is required"}
                            disabled={loading}
                        />
                        <TextField
                            required
                            error={errors.ca_split}
                            label="CA Split"
                            name="ca_split"
                            value={inputs.ca_split}
                            onChange={handleInputChange}
                            helperText={errors.ca_split && "CA split is required"}
                            type="number"
                            inputProps={{ min: 0, max: 100 }}
                            disabled={loading}
                        />
                    </Box>

                    <FormControl fullWidth error={errors.delivered_to} disabled={loading}>
                        <InputLabel>Delivered To Cohorts</InputLabel>
                        <Select
                            multiple
                            value={selectedCohorts}
                            onChange={handleCohortChange}
                            input={<OutlinedInput label="Delivered To Cohorts" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={getCohortName(value)} />
                                    ))}
                                </Box>
                            )}
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
                        {errors.delivered_to && (
                            <FormHelperText>Please select at least one cohort</FormHelperText>
                        )}
                    </FormControl>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button 
                            variant="outlined" 
                            href="/modules" 
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
                            {loading ? 'Creating...' : 'Create Module'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default NewModule;