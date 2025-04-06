import { useState, useEffect} from 'react';
import { Link }from 'react-router-dom';
import { Container, List, ListItem, ListItemText, Divider, Typography, Button} from '@mui/material';

function ModulesPage()
{
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/module/'); 
                const data = await response.json();
                setModules(data);
            }
            catch (error)
            {
                setError(error)
            }
            finally {
                setLoading(false);
            }
        };
        fetchModules();

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
    <Container sx={{ pt: 2}}>
        <Typography align="center" variant="h4" gutterBottom>
            List of Modules
        </Typography>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {modules.map((module) => (
                <div key={module.code}>
                    <ListItem alignItems="flex-start">
                        <ListItemText
                            primary={ 
                                <Typography component={Link} to={`/modules/${module.code}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                                    {module.full_name}
                                </Typography>
                            }
                            secondary={`Code: ${module.code}`}
                        />
                        <Button variant="outlined" component={Link} to={`/modules/${module.code}`} size="small" sx={{ ml: 2 }}>
                            View
                        </Button>
                    </ListItem>
                    <Divider component="li" />
                </div>
            ))}
        </List>
    </Container>
    )
}

export default ModulesPage;