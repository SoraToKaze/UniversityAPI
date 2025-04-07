import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Homepage from './components/Other/Homepage';
import CohortsPage from './components/Cohort/AllCohorts';
import DegreesPage from './components/Degree/AllDegrees';
import ModulesPage from './components/Module/AllModules';
import SingleDegreePage from './components/Degree/SingleDegree';
import SingleCohortPage from './components/Cohort/SingleCohort';
import SingleModulePage from './components/Module/SingleModule';
import SingleStudentPage from './components/Student/SingleStudent';
import MakeDegree from './components/Degree/MakeDegree';
import MakeCohort from './components/Cohort/MakeCohort';
import MakeModule from './components/Module/MakeModule';
import MakeStudent from './components/Student/MakeStudent';
import GradeEditor from './components/Student/SetGrade';
import Navbar from './components/Other/Navbar';

function App() {
  
  return (
    <Router>     
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/degrees" element={<DegreesPage />} />
        <Route path="/cohorts" element={<CohortsPage />} />
        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/degrees/:id" element={<SingleDegreePage />} />
        <Route path="/cohorts/:id" element={<SingleCohortPage />} /> 
        <Route path="/modules/:id" element={<SingleModulePage />} />
        <Route path="/create_degree" element={<MakeDegree />} />
        <Route path="/create_cohort" element={<MakeCohort />} />
        <Route path="/create_module" element={<MakeModule />} />
        <Route path="/create_student" element={<MakeStudent />} /> 
        <Route path="/students/:id" element={<SingleStudentPage />} />
        <Route path="/students/:id/edit" element={<GradeEditor />} />
      </Routes>
    </Router>
  )
}

export default App;
