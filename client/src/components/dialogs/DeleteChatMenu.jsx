import { Delete as DeleteIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import { Menu, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAsyncMutation } from '../../hooks/hook';
import { useDeleteGroupMutation, useLeaveGroupMutation } from '../../redux/api/api';
import { setIsDeleteMenu } from '../../redux/reducers/misc';

const DeleteChatMenu = ({ deleteOptionAnchor, setDeleteOptionAnchor }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isDeleteMenu, selectedDeleteChat } = useSelector((state) => state.misc);

    const [deleteChat, _, deleteChatData] = useAsyncMutation(useDeleteGroupMutation)

    const [leaveGroup, __, leaveGroupData] = useAsyncMutation(useLeaveGroupMutation)

    const closeHandler = (e) => {
        dispatch(setIsDeleteMenu(false)); // Close the menu by setting isDeleteMenu to false
        setDeleteOptionAnchor(null)

    };

    const isGroup = selectedDeleteChat.groupChat;

    const LeaveGroupHandler = () => {
        closeHandler();
        leaveGroup("Leaving Group...", selectedDeleteChat.chatId)
    }

    const DeleteChatHandler = () => {
        closeHandler();
        deleteChat("Deleting...", selectedDeleteChat.chatId)
    }

    useEffect(() => {
        if (deleteChatData || leaveGroupData) navigate("/")
    }, [deleteChatData, leaveGroupData])

    return (
        <Menu
            open={isDeleteMenu}
            onClose={closeHandler}
            anchorEl={deleteOptionAnchor}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
            }}
            transformOrigin={{
                vertical: "center",
                horizontal: "center"
            }}
        >
            <Stack
                sx={{
                    width: "10rem",
                    padding: "0.5rem",
                    cursor: "pointer"
                }}
                direction={"row"}
                alignItems={"center"}
                spacing={"0.5rem"}

                onClick={isGroup ? LeaveGroupHandler : DeleteChatHandler}

            >

                {
                    isGroup ? <><ExitToAppIcon /> <Typography>Leave Group </Typography></> :
                        <><DeleteIcon /> <Typography>Delete Chat</Typography>
                        </>
                }

            </Stack>
        </Menu>
    );
};

export default DeleteChatMenu;
