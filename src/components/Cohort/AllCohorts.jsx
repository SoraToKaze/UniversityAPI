import { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Container, List, ListItem, ListItemText, Divider, Typography, Button, Box } from '@mui/material';

function CohortsPage()
{
    const [cohorts, setCohorts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCohorts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/cohort/'); 
                const data = await response.json();
                setCohorts(data);
            }
            catch (error)
            {
                setError(error)
            }
            finally {
                setLoading(false);
            }
        };
        fetchCohorts();

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
        <Container maxWidth="md" sx={{ pt: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Cohorts List</Typography>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {cohorts.map((cohort) => (
            <Box key={cohort.id}>
                <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                    <ListItemText primary={<Typography variant="h6" sx={{ fontWeight: 'medium' }}>{cohort.id}: {cohort.name}</Typography>} sx={{ mb: 1 }}/>
                    <Button variant="outlined" component={Link} to={`/cohorts/${cohort.id}`} size="small" sx={{ ml: 2 }}>View</Button>
                </ListItem>
            <Divider component="li" />
            </Box>
            ))}                
            </List>
        </Container>
    )
}

export default CohortsPage;
