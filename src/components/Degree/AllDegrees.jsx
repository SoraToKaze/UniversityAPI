import { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Container, List, ListItem, ListItemText, Divider, Typography, Button, Box } from '@mui/material';
function DegreesPage()
{   
    const [degrees, setDegrees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDegrees = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/degree/'); 
                const data = await response.json();
                setDegrees(data);
            }
            catch (error)
            {
                setError(error)
            }
            finally {
                setLoading(false);
            }
        };
        fetchDegrees();

    }, []);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
               <img alt="Loading" src={`${process.env.PUBLIC_URL}/Firefly.gif`}></img>
            </div>
        );
    }
    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <Container maxWidth="md" sx={{ pt: 8 }}> {/* Navbar spacing */}
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Degrees List
            </Typography>

            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {degrees.map((degree) => (
                    <Box key={degree.shortcode}>
                        <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                            <ListItemText primary={<Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                                {degree.shortcode} - {degree.full_name}
                            </Typography>
                                } sx={{ mb: 1 }}
                            />
                        <Button variant="outlined" component={Link} to={`/degrees/${degree.shortcode}`} size="small" sx={{ ml: 2 }}>
                            View
                        </Button>
                    </ListItem>
                <Divider component="li" />
            </Box>
            ))}
        </List>
    </Container>
    );
}

export default DegreesPage;