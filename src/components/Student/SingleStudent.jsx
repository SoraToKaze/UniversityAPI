import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Typography, Button, Paper, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from "@mui/material";

function SingleStudentPage(){
    const [student, setStudent] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [grades, setGrades] = useState([]);
    const [cohortID, setCohortID] = useState("");
    const { id } = useParams();
    
    useEffect(() => {
        const fetchStudent = async () => {
        try{
            const studentResponse = await fetch(`http://127.0.0.1:8000/api/student/${id}`)
            const studentData = await studentResponse.json();
            setCohortID(studentData.cohort.split("/")[studentData.cohort.split("/").length - 2]);
            setStudent(studentData);

            const gradeResponse = await fetch(`http://127.0.0.1:8000/api/grade/?student=${id}`)
            const gradeData = await gradeResponse.json();
            setGrades(gradeData);
        }catch(error){
            setError(error);

        }
        finally{
            setLoading(false);
        }
        };
        fetchStudent();
    }, [id]);

    function getModuleLink(url) {
        let code = url.split("/")[url.split("/").length - 2];

        return (
            <Button component={Link} to={`/cohorts/${code}`} sx={{textTransform: "none", p : 0}}>
                {code}
            </Button>
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
        <Container maxWidth="lg" sx={{ pt: 8, pb: 4 }}>
            <Paper elevation={0} sx={{ 
                p: 3, 
                mb: 4, 
                border: '1px solid #e0e0e0',
                backgroundColor: 'background.paper'
            }}>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Student Details
                </Typography>
                <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            {student.first_name} {student.last_name}
                        </Typography>
                        <Typography color="text.secondary" gutterBottom>
                            Student ID: {student.student_id}
                        </Typography>
                        <Typography color="text.secondary" gutterBottom>
                            Cohort: {cohortID}
                        </Typography>
                        <Typography color="text.secondary">
                            Email: {student.email}
                        </Typography>
                    </CardContent>
                </Card>
            </Paper>

            <Paper elevation={0} sx={{ 
                p: 3, 
                border: '1px solid #e0e0e0',
                backgroundColor: 'background.paper'
            }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'medium', mb: 3 }}>
                    Grades & Modules
                </Typography>
                
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Module</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>CA Mark</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Exam Mark</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Final Grade</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {grades.map((grade) => (
                                <TableRow key={grade.id}>
                                    <TableCell>{getModuleLink(grade.module)}</TableCell>
                                    <TableCell>{grade.ca_mark}</TableCell>
                                    <TableCell>{grade.exam_mark}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{grade.total_grade}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, mt: 2 }}>
                <Button component={Link} to="edit" variant="contained">
                    Edit Grades
                </Button>
            </Box>
        </Container>
    );
}

export default SingleStudentPage;