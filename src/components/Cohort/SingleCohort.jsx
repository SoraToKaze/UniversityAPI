import {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Container, List, ListItem, ListItemText, Divider, Typography, Button, Box, Paper, Card, CardContent} from '@mui/material';

function SingleCohortPage()
{
    const { id } = useParams();
    const [cohort, setCohort] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [students, setStudents] = useState([]);
    const [deliveredTo, setDeliveredTo] = useState([]);

    useEffect(() => {
        const fetchCohortStudents = async () => {
            try {
                const cohortResponse = await fetch(`http://127.0.0.1:8000/api/cohort/${id}`); 
                const cohortData = await cohortResponse.json();
                setCohort(cohortData);

                const studentResponse = await fetch(`http://127.0.0.1:8000/api/student/?cohort=${id}`);
                const studentData = await studentResponse.json();
                setStudents(studentData);
                
                const deliveredToResponse = await fetch(`http://127.0.0.1:8000/api/module/?delivered_to=${id}`);
                const deliveredToData = await deliveredToResponse.json();
                setDeliveredTo(deliveredToData);
            }
            catch (error)
            {
                setError(error)
            }
            finally {
                setLoading(false);
            }
        }
        fetchCohortStudents();
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
        <Container sx={{ pt: 4, pb: 5 }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                Cohort {cohort.id}: {cohort.name}
            </Typography>

            <Box sx={{ display: 'grid', gap: 4 }}>
                {/* Modules Section */}
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'medium', mb: 3 }}>
                        Modules Delivered to This Cohort
                    </Typography>
                    <List sx={{ width: '100%' }}>
                        {deliveredTo.map(module => (
                            <Box key={module.code}>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6">
                                                <Button 
                                                    component={Link} 
                                                    to={`/modules/${module.code}`}
                                                    sx={{ textTransform: 'none', p: 0 }}
                                                >
                                                    {module.code}: {module.full_name}
                                                </Button>
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                <Divider component="li" sx={{ my: 1 }} />
                            </Box>
                        ))}
                    </List>
                </Paper>

                {/* Students Section */}
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'medium', mb: 3 }}>
                        Students in This Cohort
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                        {students.map(student => (
                            <Card key={student.id} variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {student.first_name} {student.last_name}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        ID: {student.student_id}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Email: {student.email}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        component={Link}
                                        to={`/students/${student.student_id}`}
                                        size="small"
                                        fullWidth
                                    >
                                            View Student
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default SingleCohortPage;