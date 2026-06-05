import { Box, Typography } from "@mui/material";
import AppLayout from "../components/layouts/AppLayout";

const Home = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={"100%"}
      padding={4}
      bgcolor="#f0f0f0" 
    >
      <Typography variant="h4" gutterBottom style={{ fontFamily: "cursive", color: "#333" }}>
        Welcome to Chatify!
      </Typography>
      <Typography variant="body1" paragraph align="center" style={{ color: "#666" }}>
        Connect with your friends and start chatting.
      </Typography>
      {/* <Button variant="contained" color="primary" size="large" style={{ marginTop: 20 }}>
        Find Friends
      </Button> */}
    </Box>
  );
};

export default AppLayout()(Home);
