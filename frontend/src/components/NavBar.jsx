import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    onLogout();
    navigate('/login');
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#212121', // dark gray background
        color: '#fff', // white text color for navbar
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button
            component={Link}
            to="/scholarships"
            sx={{
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
          >
            Home
          </Button>
        </Box>

        {!isLoggedIn && (
          <>
            <Button
              component={Link}
              to="/login"
              sx={{
                color: '#fff',
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              sx={{
                color: '#fff',
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              Register
            </Button>
          </>
        )}

        {isLoggedIn && (
          <>
            <Button
              component={Link}
              to="/recommendations"
              sx={{
                color: '#fff',
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              Recommendations
            </Button>
            <Button
              component={Link}
              to="/dashboard"
              sx={{
                color: '#fff',
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              Dashboard
            </Button>
            <Button
              onClick={handleLogout}
              sx={{
                color: '#fff',
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
