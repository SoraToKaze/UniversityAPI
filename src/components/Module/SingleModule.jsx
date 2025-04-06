import {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Container, Typography, Card, CardContent, Divider, Button} from '@mui/material';

function SingleModulePage()
{
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [module, setModule] = useState([]);

    useEffect(() => {
        const fetchModuleStudents = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/module/${id}`);
                const data = await response.json();
                setModule(data);
            }
            catch (error)
            {
                setError(error)
            }
            finally {
                setLoading(false);
            }
        }
        fetchModuleStudents();
    }, [id]);

    function getCohortLink(url) {
        let code = url.split("/")[url.split("/").length - 2];

        return (
            <Button component={Link} to={`/cohorts/${code}`} sx={{textTransform: "none", p : 0}}>
                {code}
            </Button>
        )
    }
    
    function renderCohortList(module) {
        return (
            <div>
                {(module).map((cohort ) => (
                    <div key={cohort}>
                        {getCohortLink(cohort)}
                    </div>
                ))}
            </div>
        )
    }

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
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Module Code: {module.code}
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                        Module Name: {module.full_name}
                    </Typography>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
                        Delivered To These Cohorts:
                    </Typography>
                        {renderCohortList(module.delivered_to)}
                </CardContent>
            </Card>
        </Container>
    );
}
export default SingleModulePage;