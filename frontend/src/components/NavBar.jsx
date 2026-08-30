import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

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

  const profileName = !isLoggedIn
    ? 'Guest'
    : isProvider
      ? 'Provider account'
      : 'Student account';

  const profileRole = !isLoggedIn
    ? 'Not signed in'
    : role === 'provider'
      ? 'Scholarship provider'
      : 'Applicant';

  return (
    <aside className="app-sidebar">
      <div className="sidebar-profile">
        <p className="sidebar-profile-label">Profile</p>
        <p className="sidebar-profile-name">{profileName}</p>
        <p className="sidebar-profile-role">{profileRole}</p>
      </div>

      <nav className="sidebar-nav" aria-label="Main">
        <NavLink
          to="/scholarships"
          end
          className={({ isActive }) =>
            isActive ? 'nav-link nav-link-active' : 'nav-link'
          }
        >
          Home
        </NavLink>

        {!isLoggedIn && (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              Register
            </NavLink>
          </>
        )}

        {isStudent && (
          <>
            <NavLink
              to="/private-profile"
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              Private Profile
            </NavLink>
            <NavLink
              to="/private-matches"
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              Private Matches
            </NavLink>
            <NavLink
              to="/my-applications"
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              My Applications
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              Dashboard
            </NavLink>
          </>
        )}

        {isProvider && (
          <NavLink
            to="/provider/applications"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            Provider
          </NavLink>
        )}
      </nav>

      {isLoggedIn && (
        <button type="button" className="nav-logout" onClick={handleLogout}>
          Logout
        </button>
      )}
    </aside>
  );
};

export default NavBar;
