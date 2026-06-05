import { Drawer, Grid, Skeleton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useErrors, useSocketHandler } from '../../hooks/hook';
import { useMyChatsQuery } from '../../redux/api/api';
import { setIsDeleteMenu, setIsMobile, setSetelectedDeleteChat } from '../../redux/reducers/misc';
import Title from '../shared/Title';
import ChatList from '../specific/ChatList';
import Profile from '../specific/Profile';
import Header from "./Header";
import { useCallback, useEffect, useState } from 'react';
import { getSocket } from '../../socket';
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../../constants/events';
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chatSlice';
import { getOrSaveFromStorage } from '../../lib/features';
import DeleteChatMenu from '../dialogs/DeleteChatMenu';

const AppLayout = () => (WrappedComponent) => (props) => {
    const params = useParams();
    const chatId = params.chatId;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const socket = getSocket();

    const [onlineUsers, setOnlineUsers] = useState([]);

    const { isMobile } = useSelector(state => state.misc);
    const { user } = useSelector(state => state.auth);
    const { newMessagesAlert } = useSelector(state => state.chat);

    const [deleteOptionAnchor, setDeleteOptionAnchor] = useState(null); // State for menu anchor element

    useEffect(() => {
        getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert])

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    useEffect(() => {
        if (isError) {
            console.error("Failed to fetch chats:", error);
            if (error.data && error.data.message) {
                console.error("Error details:", error.data.message);
            }
        }
    }, [isError, error]);

    useErrors([{ isError, error }]);

    const handleDeleteChat = (e, chatId, groupChat) => {
        setDeleteOptionAnchor(e.currentTarget); // Set the anchor element
        dispatch(setSetelectedDeleteChat({ chatId, groupChat }));
        dispatch(setIsDeleteMenu(true)); // Open the delete menu
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertListener = useCallback((data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
    }, [chatId]);

    const newRequestListener = useCallback(() => {
        dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
        refetch();
        navigate("/")
    }, [refetch, navigate])

    const onlineUsersListener = useCallback((data) => {
        setOnlineUsers(data);
    }, [])

    const eventHandlers = {
        [NEW_MESSAGE_ALERT]: newMessageAlertListener,
        [NEW_REQUEST]: newRequestListener,
        [REFETCH_CHATS]: refetchListener,
        [ONLINE_USERS]: onlineUsersListener
    };

    useSocketHandler(socket, eventHandlers);

    return (
        <>
            <Title />
            <Header />

            <DeleteChatMenu deleteOptionAnchor={deleteOptionAnchor} setDeleteOptionAnchor={setDeleteOptionAnchor} /> {/* Pass the anchor element */}

            {
                isLoading ? (<Skeleton />) : (
                    <Drawer open={isMobile} onClose={handleMobileClose}>
                        <ChatList
                            w='70vw'
                            chats={data?.chats}
                            chatId={chatId}
                            handleDeleteChat={handleDeleteChat} // Pass the handler
                            newMessagesAlert={newMessagesAlert}
                            onlineUsers={onlineUsers}
                        />
                    </Drawer>
                )
            }

            <Grid container height={"calc(100vh - 4rem)"}>
                <Grid item sm={4} md={3} sx={{ display: { xs: "none", sm: "block" } }} height={"100%"}>
                    {
                        isLoading ? (<Skeleton />) : (
                            <ChatList
                                chats={data?.chats}
                                chatId={chatId}
                                onlineUsers={["1", "2"]}
                                handleDeleteChat={handleDeleteChat} // Pass the handler
                                newMessagesAlert={newMessagesAlert}
                                onlineUsers={onlineUsers}

                            />
                        )
                    }
                </Grid>

                <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
                    <WrappedComponent {...props} chatId={chatId} user={user} />
                </Grid>

                <Grid item md={4} lg={3} height={"100%"} sx={{ display: { xs: "none", md: "block" }, padding: "2rem", bgcolor: "rgba(0,0,0,0.85)" }}>
                    <Profile user={user} />
                </Grid>
            </Grid>
        </>
    );
};

export default AppLayout;
