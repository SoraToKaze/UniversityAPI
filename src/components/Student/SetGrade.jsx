import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText,Paper,Container,Divider } from '@mui/material';
import EmailOutlined from '@mui/icons-material/EmailOutlined';

function EditGrade() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    ca: '',
    exam: '',
    selectedGrade: null
  });

  const [errors, setErrors] = useState({
    ca: false,
    exam: false,
    selectedGrade: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, gradesRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/student/${id}`),
          fetch(`http://127.0.0.1:8000/api/grade/?student=${id}`)
        ]);
        
        setStudent(await studentRes.json());
        setGrades(await gradesRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleGradeSelect = (e) => {
    setFormData(prev => ({ ...prev, selectedGrade: e.target.value }));
    if (errors.selectedGrade) setErrors(prev => ({ ...prev, selectedGrade: false }));
  };

  const validateForm = () => {
    const newErrors = {
      ca: formData.ca.trim() === '',
      exam: formData.exam.trim() === '',
      selectedGrade: formData.selectedGrade === null
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { selectedGrade, ca, exam } = formData;
      const payload = {
        module: selectedGrade.module,
        ca_mark: ca,
        exam_mark: exam,
        cohort: selectedGrade.cohort,
        student: selectedGrade.student
      };

      const response = await fetch(`http://127.0.0.1:8000/api/grade/${selectedGrade.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Update failed');
      alert('Grades updated successfully!');
      window.location.reload();
    } catch (err) {
      setError(err.message);
      alert('Error updating grades');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <img alt="Loading" src={`${process.env.PUBLIC_URL}/loadingCat.gif`} />
      </Box>
    );
  }

  if (error) return <Typography color="error">{error}</Typography>;
  if (!student) return <Typography>Student not found</Typography>;

  return (
    <Container maxWidth="md" sx={{ pt: 8, pb: 4 }}>
      {/* Student Info Card */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Editing Grades for {student.first_name} {student.last_name}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography>Student ID: {student.student_id}</Typography>
          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
            <EmailOutlined sx={{ mr: 1 }} /> {student.email}
          </Typography>
          <Typography>
            Cohort: <Link to={`/cohorts/${student.cohort?.split('/').slice(-2, -1)}`}>
              {student.cohort?.split('/').slice(-2, -1)}
            </Link>
          </Typography>
        </Box>
      </Paper>

      {/* Grade Form */}
      <Paper elevation={3} sx={{ p: 3 }}>
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
          <FormControl fullWidth error={errors.selectedGrade}>
            <InputLabel>Module</InputLabel>
            <Select
              value={formData.selectedGrade}
              onChange={handleGradeSelect}
              label="Module"
            >
              {grades.map(grade => (
                <MenuItem key={grade.id} value={grade}>
                  {grade.module.split('/').slice(-2, -1)}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedGrade && <FormHelperText>Please select a module</FormHelperText>}
          </FormControl>

          <TextField
            required
            error={errors.ca}
            label="CA Mark"
            name="ca"
            value={formData.ca}
            onChange={handleInputChange}
            helperText={errors.ca && "CA mark is required"}
            type="number"
            inputProps={{ min: 0, max: 100 }}
          />

          <TextField
            required
            error={errors.exam}
            label="Exam Mark"
            name="exam"
            value={formData.exam}
            onChange={handleInputChange}
            helperText={errors.exam && "Exam mark is required"}
            type="number"
            inputProps={{ min: 0, max: 100 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              component={Link} 
              to={`/students/${id}`}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{ px: 4 }}
            >
              Update Grades
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default EditGrade;