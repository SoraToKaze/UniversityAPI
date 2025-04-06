import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static" style={{ background: 'maroon', color: "white"}}>
      <Toolbar>
        <Typography variant="h5" component={Link} to="/" style={{ flexGrow: 0.75, color: 'inherit', textDecoration: 'none' }}>
          University API
        </Typography>

        <Button color="inherit" component={Link} to="/degrees">Degrees</Button>
        <Button color="inherit" component={Link} to="/cohorts">Cohorts</Button>
        <Button color="inherit" component={Link} to="/modules">Modules</Button>
        <Button color="inherit" component={Link} to="/create_degree">Create Degree</Button>
        <Button color="inherit" component={Link} to="/create_cohort">Create Cohort</Button>
        <Button color="inherit" component={Link} to="/create_module">Create Module</Button>
        <Button color="inherit" component={Link} to="/create_student">Create Student</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
