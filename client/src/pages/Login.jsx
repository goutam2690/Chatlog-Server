import { useFileHandler, useInputValidation } from '6pp';
import { CameraAlt as CameraAltIcon } from '@mui/icons-material';
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { VisuallyHidden } from '../components/styles/StyledComponent';
import { server } from '../constants/config';
import { userExists } from '../redux/reducers/auth';
import { usernameValidator } from '../utils/Validators';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");

  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const toastId = toast.loading("Signing Up...")

    const formData = new FormData();

    formData.append("avatar", avatar.file)
    formData.append("name", name.value)
    formData.append("username", username.value)
    formData.append("password", password.value)
    formData.append("bio", bio.value)

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }

    try {
      const { data } = await axios.post(`${server}/api/v1/user/new`, formData, config);
      console.log(data)
      dispatch(userExists(data.user));
      toast.success(data?.message , { id: toastId })
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong ", { id:  toastId })
    } finally {
      setIsLoading(false);
    }

  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const toastId = toast.loading("Logging In...")

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };


    try {
      const { data } = await axios.post(`${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value
        },
        config
      );
      dispatch(userExists(data.user));
      toast.success(data?.message, { id: toastId })
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong ", { id: toastId })
    } finally {
      setIsLoading(false);
    }
  }



  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
        {isLogin ? (
          <>
            <Typography variant="h5">Login</Typography>
            <form onSubmit={handleLogin}>
              <TextField
                label="Username"
                required
                fullWidth
                margin="normal"
                variant="outlined"
                sx={{
                  marginBottom: 2,
                }}
                value={username.value}
                onChange={username.changeHandler}
              />
              <TextField
                label="Password"
                required
                fullWidth
                type="password"
                margin="normal"
                variant="outlined"
                sx={{
                  marginBottom: 2,
                }}
                value={password.value}
                onChange={password.changeHandler}
              />
              <Button
                sx={{
                  marginTop: 2,
                  width: '100%',
                }}
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading}
              >
                Log In
              </Button>
              <Typography sx={{ textAlign: 'center', marginTop: '1rem' }}>OR</Typography>
              <Button
                sx={{
                  marginTop: 2,
                  width: '100%',
                }}
                fullWidth
                variant="text"
                onClick={toggleLogin}
                disabled={isLoading}

              >
                Register Instead
              </Button>
            </form>
          </>
        ) : (
          <>
            <Typography variant="h5" sx={{ marginTop: "3rem" }}>Register</Typography>
            <form onSubmit={handleRegister}>
              <Stack position="relative" width="10rem" margin="auto">
                <Avatar sx={{ height: '6rem', width: '6rem', objectFit: 'cover', left: "19%", marginTop: "1rem" }} src={avatar.preview} />
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 24,
                    height: "2rem",
                    width: "2rem",
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.7) !important',
                    },
                  }}
                  component="label"
                >
                  <CameraAltIcon />
                  <VisuallyHidden type="file" onChange={avatar.changeHandler} />
                </IconButton>
              </Stack>
              {
                avatar.error && (
                  <Typography color='red' m={"1rem auto"} width={"fit-content"} display={"block"} variant='caption'>{avatar.error}</Typography>
                )
              }
              <TextField
                label="Name"
                required
                fullWidth
                margin="normal"
                variant="outlined"
                sx={{
                  marginBottom: 2,
                }}

                value={name.value}
                onChange={name.changeHandler}
              />
              <TextField
                label="Bio"
                required
                fullWidth
                margin="normal"
                variant="outlined"
                sx={{
                  marginBottom: 2,
                }}
                value={bio.value}
                onChange={bio.changeHandler}
              />
              <TextField
                label="Username"
                required
                fullWidth
                margin="normal"
                variant="outlined"
                sx={{
                  marginBottom: 2,
                }}
                value={username.value}
                onChange={username.changeHandler}
              />

              {
                username.error && (
                  <Typography color='red' variant='caption'>{username.error}</Typography>
                )
              }
              <TextField
                label="Password"
                required
                fullWidth
                type="password"
                margin="normal"
                variant="outlined"
                sx={{
                  marginBottom: 2,
                }}
                value={password.value}
                onChange={password.changeHandler}
              />
              <Button
                sx={{
                  marginTop: 2,
                  width: '100%',
                }}
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading}
              >
                Register
              </Button>
              <Typography sx={{ textAlign: 'center', marginTop: '1rem' }}>OR</Typography>
              <Button
                sx={{
                  marginTop: 2,
                  width: '100%',
                }}
                fullWidth
                variant="text"
                onClick={toggleLogin}
                disabled={isLoading}

              >
                Login Instead
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Login;
