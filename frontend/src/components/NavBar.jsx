import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const navBtnSx = {
  color: '#fff',
  '&:hover': { backgroundColor: '#333' },
};

/**
 * Role-aware navigation.
 * Students never see provider tabs; providers never see student-only tabs.
 */
const NavBar = ({ isLoggedIn, role, onLogout }) => {
  const navigate = useNavigate();
  const isStudent = isLoggedIn && role === 'student';
  const isProvider = isLoggedIn && role === 'provider';

  const handleLogout = async () => {
    onLogout();
    navigate('/login');
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#212121',
        color: '#fff',
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button
            component={Link}
            to="/scholarships"
            sx={{ ...navBtnSx, fontWeight: 'bold' }}
          >
            Home
          </Button>
        </Box>

        {!isLoggedIn && (
          <>
            <Button component={Link} to="/login" sx={navBtnSx}>
              Login
            </Button>
            <Button component={Link} to="/register" sx={navBtnSx}>
              Register
            </Button>
          </>
        )}

        {isStudent && (
          <>
            <Button component={Link} to="/private-profile" sx={navBtnSx}>
              Private Profile
            </Button>
            <Button component={Link} to="/private-matches" sx={navBtnSx}>
              Private Matches
            </Button>
            <Button component={Link} to="/my-applications" sx={navBtnSx}>
              My Applications
            </Button>
            <Button component={Link} to="/dashboard" sx={navBtnSx}>
              Dashboard
            </Button>
          </>
        )}

        {isProvider && (
          <Button component={Link} to="/provider/applications" sx={navBtnSx}>
            Provider
          </Button>
        )}

        {isLoggedIn && (
          <Button onClick={handleLogout} sx={navBtnSx}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
