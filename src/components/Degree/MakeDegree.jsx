import { useState } from 'react';
import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Container, 
    Paper,
    Divider
} from '@mui/material';

function NewDegree() {
    const [inputs, setInputs] = useState({
        full_name: '',
        shortcode: '',
    });

    const [errors, setErrors] = useState({
        full_name: false,
        shortcode: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
    };

    const validateForm = () => {
        const newErrors = {
            full_name: inputs.full_name.trim() === '',
            shortcode: inputs.shortcode.trim() === '',
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
            const response = await fetch('http://127.0.0.1:8000/api/degree/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputs),
            });

            if (!response.ok) throw new Error('Failed to create degree');
            
            alert('Degree created successfully!');
            window.location.reload();
        } catch (err) {
            setError(err.message);
            alert('Error creating degree');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ pt: 8, pb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Create New Degree
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
                        error={errors.full_name}
                        label="Full Name"
                        name="full_name"
                        value={inputs.full_name}
                        onChange={handleChange}
                        helperText={errors.full_name && "Full name is required"}
                        disabled={loading}
                    />

                    <TextField
                        required
                        error={errors.shortcode}
                        label="Shortcode"
                        name="shortcode"
                        value={inputs.shortcode}
                        onChange={handleChange}
                        helperText={errors.shortcode && "Shortcode is required"}
                        disabled={loading}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button 
                            variant="outlined" 
                            href="/degrees" 
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
                            {loading ? 'Creating...' : 'Create Degree'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default NewDegree;