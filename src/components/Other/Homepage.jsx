import { Box, Paper, Typography } from '@mui/material';

function Homepage() {

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '50vh',
      p: 2
    }}>
      <Paper elevation={3} sx={{
        p: 4,
        minWidth: '650px',
        maxWidth: '800px',
        textAlign: 'center'
      }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to the University API
        </Typography>
        <Typography variant="body1">
          This is the homepage of the University API.
        </Typography>
        <Typography variant="body1">
          To navigate around the website, please use the navbar.
        </Typography>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
          <img alt="Loading" src={`${process.env.PUBLIC_URL}/Firefly.gif`}></img>
        </div>
      </Paper>
    </Box>
  );
}

export default Homepage;