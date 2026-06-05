// import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
// // import orange from '../../constants/color';
// import { Add as AddIcon, Menu as MenuIcon, Search as SearchIcon } from '@mui/icons-material'

// const Header = () => {

//     const handleMobile = () => {
//         console.log("mobile")
//     }

//     const openSearchDialog = () => {
//         console.log("openSearchDialog")
//     }

//     const openNewGroup = () => {
//         console.log("openNewGroup")
//     }


//     return (
//         <>
//             <Box sx={{ flexGrow: 1 }} height={"4rem"}>
//                 <AppBar position="static" sx={{
//                     bgcolor: "",
//                     // padding: "0.6rem"
//                 }}>

//                     <Toolbar variant="h6" sx={{ display: { xs: "none", sm: "block" } }}>
//                         <Typography>CHATIFY</Typography>
//                     </Toolbar>

//                     <Box sx={{
//                         display: { xs: "block", sm: "none" }
//                     }}>
//                         <IconButton color="inherit" onClick={handleMobile}></IconButton>
//                         <MenuIcon />
//                     </Box>

//                     <Box sx={{flexGrow: 1}} />

//                     <Box>
//                         <IconButton color="inherit" size="large" onClick={openSearchDialog} >
//                             <SearchIcon />
//                         </IconButton>

//                         <Tooltip title="Create a new chat group">
//                             <IconButton color="inherit" size="large" onClick={openNewGroup}>
//                                 <AddIcon />
//                             </IconButton>
//                         </Tooltip>
//                     </Box>

//                 </AppBar>
//             </Box>
//         </>
//     )
// }

// export default Header


// import React from 'react';
import { Add as AddIcon, Group as GroupIcon, Logout as LogoutIcon, Menu as MenuIcon, Notifications as NotificationsIcon, Search as SearchIcon } from '@mui/icons-material';
import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import axios from 'axios';
import { Suspense, lazy } from "react";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { server } from '../../constants/config';
import { userNotExists } from '../../redux/reducers/auth';
import { resetNotificationCount } from '../../redux/reducers/chatSlice';
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc';

const SearchDialog = lazy(() => import("../specific/Search"));
const NotificationDialog = lazy(() => import("../specific/Notification"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"))

const Header = () => {

    const { isSearch, isNotification, isNewGroup } = useSelector(state => state.misc);
    const { notificationCount } = useSelector(state => state.chat);


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleMobile = () => {
        dispatch(setIsMobile(true));
        console.log("mobile")
    };

    const redirectToHome = () => {
        navigate("/")
    }

    const openSearch = () => {
        console.log("openSearchDialog");
        dispatch(setIsSearch(true));
    };

    const openNewGroup = () => {
        console.log("openNewGroup");
       dispatch(setIsNewGroup(true))
    };

    const openNotification = () => {
        dispatch(setIsNotification(true))
        dispatch(resetNotificationCount())
    } 

    const navigateToGroup = () => {
        navigate("/groups");
    }

    const logoutHandler = async () => {
        try {
            const { data } = await axios.post(
                `${server}/api/v1/user/logout`,
                {}, // Empty object for data if there's no payload
                {
                    withCredentials: true
                }
            );
            dispatch(userNotExists());
            toast.success(data?.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || "something went wrong");
        }
    };





    return (
        <>
            <Box sx={{ flexGrow: 1 }} height={"4rem"}>
                <AppBar position="static" sx={{ backgroundColor: "#2D68C4" }}>
                    <Toolbar variant="h6">
                        <Typography
                            sx={{
                                padding: "1.25rem",
                                cursor: "pointer",
                                fontWeight: "600",
                                display: {
                                    xs: "none", // Hide on extra small screens
                                    sm: "block", // Hide on small screens
                                    md: "block", // Hide on medium screens
                                    lg: "block", // Show on large screens
                                    xl: "block"  // Show on extra-large screens
                                }
                            }}
                            onClick={redirectToHome}
                        >
                            CHATIFY
                        </Typography>


                        <Box sx={{
                            display: { xs: "block", sm: "none", md: "none", lg: "none", xl: "none" },
                            position: "fixed",
                            right: "2rem",
                            position: "absolute",
                            left: "0"

                        }}>
                            <IconButton color="inherit" onClick={handleMobile}></IconButton>
                            <MenuIcon />

                        </Box>

                        <Box sx={{ flexGrow: 1 }} /> {/* Pushes the icons to the right */}

                        <Box sx={{
                            display: {
                                xs: "block",
                                sm: "block"
                            }
                        }}>
                            <IconBtn title="Search" icon={<SearchIcon />} onClick={openSearch} />
                            <IconBtn title="Create a new chat group" icon={<AddIcon />} onClick={openNewGroup} />
                            <IconBtn title="Manage Group" icon={<GroupIcon />} onClick={navigateToGroup} />
                            <IconBtn title="Notifications" icon={<NotificationsIcon />} onClick={openNotification} value={notificationCount} />
                            <IconBtn title="Logout" icon={<LogoutIcon />} onClick={logoutHandler} />
                        </Box>

                    </Toolbar>
                </AppBar>
            </Box>

            {
                isSearch && (
                    <Suspense fallback={<Backdrop open />} >
                        <SearchDialog />
                    </Suspense>
                )
            }
            {
                isNotification && (
                    <Suspense fallback={<Backdrop open />} >
                        <NotificationDialog />
                    </Suspense>
                )
            }
            {
                isNewGroup && (
                    <Suspense fallback={<Backdrop open />} >
                        <NewGroupDialog />
                    </Suspense>
                )
            }
        </>
    );
};

const IconBtn = ({ title, icon, onClick, value }) => {
    return (
        <Tooltip title={title}>
            <IconButton color="inherit" size="large" onClick={onClick}>
                {
                    value ? <Badge badgeContent={value} color="error"> {icon}</Badge> : icon
                }
 
            </IconButton>
        </Tooltip>
    )
}

export default Header;
