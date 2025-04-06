import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Grid, Typography, Button, Paper, Card, CardContent, Divider } from '@mui/material';

function SingleDegreePage()
{
    const { id } = useParams();
    const [degree, setDegree ] = useState([]);
    const [loading, setLoading ] = useState(true)
    const [error, setError ] = useState(null);
    const [cohort, setCohort] = useState([]);

    useEffect(() => {
        const fetchDegree = async () => {
            try {
                const degreeResponse = await fetch(`http://127.0.0.1:8000/api/degree/${id}`); 
                const degreeData = await degreeResponse.json();
                setDegree(degreeData);

                const cohortResponse = await fetch(`http://127.0.0.1:8000/api/cohort/?degree=${id}`)
                const cohortData = await cohortResponse.json();
                setCohort(cohortData);
            }   
            catch (error)
            {
                setError(error)
            }
            finally {
                setLoading(false);
            };
        };
        fetchDegree();
    }, [id]);

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
        <Container maxWidth="lg" sx={{ pt: 8, pb: 4 }}>
            <Paper elevation={0} sx={{ 
                p: 3, 
                mb: 4, 
                border: '1px solid #e0e0e0',
                backgroundColor: 'background.paper'
            }}>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Degree Cohorts Map for {degree.full_name}
                </Typography>
                <Typography variant="h4" color="text.secondary" sx={{ mb: 2 }}>
                    {degree.shortcode}
                </Typography>
                <Divider sx={{ my: 2 }} />
            </Paper>

            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h4" gutterBottom sx={{ 
                        fontWeight: 'medium',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        Cohorts
                        <Typography component="span" sx={{ 
                            ml: 2,
                            fontSize: '0.8em',
                            color: 'text.secondary'
                        }}>
                            ({cohort.length} total)
                        </Typography>
                    </Typography>

                    <Grid container spacing={3}>
                        {cohort.map(cohort => (
                            <Grid item xs={12} sm={6} md={4} key={cohort.id}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {cohort.name}
                                        </Typography>
                                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                                            Cohort ID: {cohort.id}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            component={Link}
                                            to={`/cohorts/${cohort.id}`}
                                            fullWidth
                                            sx={{ mt: 1 }}
                                        >
                                            View Cohort
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
}

export default SingleDegreePage;