import { useInputValidation } from '6pp';
import { Button, Container, Paper, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogin, getAdmin } from '../../redux/thunks/admin';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAdminAuthenticated } = useSelector((state) => state.auth);
  const secretKey = useInputValidation("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(adminLogin(secretKey.value));
  };

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAdminAuthenticated, navigate]);

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
        <Typography variant="h5">Admin Login</Typography>
        <form onSubmit={submitHandler}>
          <TextField
            label="Secret Key"
            required
            fullWidth
            type="password"
            margin="normal"
            variant="outlined"
            sx={{ marginBottom: 2 }}
            value={secretKey.value}
            onChange={secretKey.changeHandler}
          />
          <Button
            sx={{ marginTop: 2, width: '100%' }}
            variant="contained"
            color="primary"
            type="submit"
          >
            Log In
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AdminLogin;
