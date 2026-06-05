import { Close as CloseIcon, Dashboard as DashboardIcon, ExitToApp as ExitToAppIcon, Group as GroupIcon, ManageAccounts as ManageAccountsIcon, Menu as MenuIcon, Message as MessageIcon } from "@mui/icons-material";
import { Box, Drawer, Grid, IconButton, Stack, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as LinkComponent, useLocation, useNavigate } from 'react-router-dom';
import { adminLogout } from "../../redux/thunks/admin";


const Link = styled(LinkComponent)`
    text-decoration: none;
    border-radius: 2rem;
    padding: 0 1rem;
    color: black;
    transition: background-color 0.3s ease, color 0.3s ease;
`;

export const adminTabs = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: <DashboardIcon />,
    },
    {
        name: "Users",
        path: "/admin/user-management",
        icon: <ManageAccountsIcon />,
    },
    {
        name: "Chats",
        path: "/admin/chat-management",
        icon: <GroupIcon />,
    },
    {
        name: "Messages",
        path: "/admin/messages",
        icon: <MessageIcon />,
    },
];

const SideBar = ({ w = "100%" }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const logoutHandler = () => {
        dispatch(adminLogout());
    }


    return (
        <Stack width={w} direction={"column"} padding={"1rem"} spacing={"3rem"}>
            <Typography
                variant="h6"
                textTransform={"uppercase"}
                fontFamily={'revert-layer'}
                fontWeight={"600"}
            >
                Chatify
            </Typography>

            <Stack spacing={"1rem"}>
                {
                    adminTabs.map((tab) => (
                        <Link key={tab.path} to={tab.path} style={{ textDecoration: 'none' }}
                            sx={
                                location.pathname === tab.path && {
                                    bgcolor: "rgba(0,0,0,0.7)",
                                    color: "white",
                                    ":hover": {
                                        color: "white"
                                    }
                                }
                            }
                        >

                            <Stack
                                direction={"row"}
                                alignItems={"center"}
                                spacing={"1rem"}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        borderRadius: '4px',
                                    },
                                    padding: '8px',
                                    borderRadius: '4px',
                                }}
                            >
                                <Typography variant="body1" sx={{ textDecoration: 'none' }}>
                                    {tab.icon}
                                </Typography>
                                <Typography variant="body1" sx={{ textDecoration: 'none' }}>
                                    {tab.name}
                                </Typography>
                            </Stack>
                        </Link>

                    ))
                }

                <Link onClick={logoutHandler}>
                    <Stack
                        direction={"row"}
                        alignItems={"center"}
                        spacing={"1rem"}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                borderRadius: '4px',
                            },
                            padding: '8px',
                            borderRadius: '4px',
                        }}
                    >
                        <Typography variant="body1" sx={{ textDecoration: 'none' }}>
                            {<ExitToAppIcon />}
                        </Typography>
                        <Typography variant="body1" sx={{ textDecoration: 'none' }}>
                            Logout
                        </Typography>
                    </Stack>
                </Link>
            </Stack>
        </Stack>
    )
}

const AdminLayout = ({ children }) => {

    const navigate = useNavigate();

    const { isAdminAuthenticated } = useSelector((state) => state.auth);

    const [isMobile, setIsMobile] = useState(false);

    const handleMobile = () => {
        setIsMobile(!isMobile)
    }

    const handleClose = () => {
        setIsMobile(false)
    }

    if (!isAdminAuthenticated) navigate("/admin");

    return (
        <Grid container minHeight={"100vh"}>

            <Box
                sx={{
                    display: {
                        xs: "block",
                        md: "none"
                    },
                    position: "fixed",
                    right: "1rem",
                }}
            >
                <IconButton onClick={handleMobile}>
                    {
                        isMobile ? <CloseIcon /> : <MenuIcon />
                    }
                </IconButton>
            </Box>

            <Grid
                item
                md={4}
                lg={3}
                sx={{
                    display: {
                        xs: "none",
                        md: "block"
                    }
                }}
            >
                <SideBar />
            </Grid>

            <Grid
                item
                xs={12}
                md={8}
                lg={9}
                sx={{
                    bgcolor: "#f5f5f5"
                }}
            >
                {children}
            </Grid>

            <Drawer open={isMobile} onClose={handleClose}>
                <SideBar w="50vw" />
            </Drawer>

        </Grid>
    )
}

export default AdminLayout
