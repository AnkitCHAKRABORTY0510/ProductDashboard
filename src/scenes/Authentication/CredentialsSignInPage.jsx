import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Alert } from "@mui/material";

const providers = [{ id: 'credentials', name: 'Email and Password' }];

const CredentialsSignInPage = ({ setToken, setUser }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const signIn = async (provider, formData) => {
    const username = formData.get('email');
    const password = formData.get('password');
    // const username = 'sophiab'
    // const password = 'sophiabpass'

    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password,
          expiresInMins: 30,
        }),
        //Removed credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.accessToken); // You can use this for authorization headers later

       // Fetch full user details using returned user ID
        const userResponse = await fetch(`https://dummyjson.com/users/${data.id}`);
        const userDetails = await userResponse.json();

        // Store full user info
        localStorage.setItem('user', JSON.stringify(userDetails));
        setUser(userDetails);//update user state

       
        navigate('/');
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      alert(`Login Error: ${error.message}`);
    }
  };

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={signIn}
        providers={providers}
        slotProps={{
          emailField: { label: 'Username', autoFocus: true },
          passwordField: { label: 'Password' },
          form: { noValidate: true },
        }}
      />
     {/* Message Box */}
    <Box mt={4} px={2}>
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body1">
          You can log in with the following test users:
        </Typography>
        <Typography variant="body2" fontWeight="bold" mt={1}>
          • Username: <code>emilys</code> | Password: <code>emilyspass</code><br />
          • Username: <code>michaelw</code> | Password: <code>michaelwpass</code>
          • Username: <code>sophiab</code> | Password: <code>sophiabpass</code>
        </Typography>
        <Typography variant="body2" mt={1}>
          For more users, visit:{" "}
          <a
            href="https://dummyjson.com/docs/users"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1976d2", textDecoration: "underline" }}
          >
            dummyjson.com/docs/users
          </a>
        </Typography>
      </Alert>
    </Box>
    </AppProvider>
  );
};

export default CredentialsSignInPage;
