import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import CohortsPage from './components/Cohort/AllCohorts';
import DegreesPage from './components/Degree/AllDegrees';
import ModulesPage from './components/Module/AllModules';
import SingleDegreePage from './components/Degree/SingleDegree';
import SingleCohortPage from './components/Cohort/SingleCohort';
import SingleModulePage from './components/Module/SingleModule';
import SingleStudentPage from './components/Student/SingleStudent';
import Navbar from './components/Other/Navbar';

function App() {
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/degrees" element={<DegreesPage />} />
        <Route path="/cohorts" element={<CohortsPage />} />
        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/degrees/:id" element={<SingleDegreePage />} />
        <Route path="/cohorts/:id" element={<SingleCohortPage />} /> 
        <Route path="/modules/:id" element={<SingleModulePage />} />
        <Route path="/students/:id" element={<SingleStudentPage />} />
      </Routes>
    </Router>
  )
}

export default App;
