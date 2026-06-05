import { useInfiniteScrollTop } from '6pp';
import { Attachment as AttachmentIcon, Send as SendIcon } from '@mui/icons-material';
import { IconButton, Skeleton, Stack } from '@mui/material';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import FileMenu from '../components/dialogs/FileMenu';
import AppLayout from '../components/layouts/AppLayout';
import MessageComponent from '../components/shared/MessageComponent';
import { InputBox } from '../components/styles/StyledComponent';
import { grayColor } from '../constants/color';
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events';
import { useErrors, useSocketHandler } from '../hooks/hook';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { setIsFileMenu } from '../redux/reducers/misc';
import { getSocket } from '../socket';
import { removeNewMessagesAlert } from '../redux/reducers/chatSlice';
import { TypingLoader } from '../components/layouts/Loaders';
import { useNavigate } from 'react-router-dom';

const Chat = ({ chatId, user }) => {
    const containerRef = useRef();
    const socket = getSocket(); // Retrieve socket instance from context

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const bottomRef = useRef(null)

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
    const [page, setPage] = useState(1);

    const [iAmTyping, setIAmTyping] = useState(false);
    const [userTyping, setUserTyping] = useState({});
    const typingTimeOut = useRef(null);

    const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
    const oldMessagesChunk = useGetMessagesQuery({ chatId, page });
    console.log("chatdetails", chatDetails)
    const { data: oldmessages, setData: setOldMessages } = useInfiniteScrollTop(
        containerRef,
        oldMessagesChunk?.data?.totalPages,
        page,
        setPage,
        oldMessagesChunk?.data?.messages
    );

    const errors = [
        {
            isError: chatDetails.isError,
            error: chatDetails.error,
        },
        {
            isError: oldMessagesChunk.isError,
            error: oldMessagesChunk.error,
        },
    ];

    const members = chatDetails?.data?.chat?.members;

    const handleFileOpen = (e) => {
        dispatch(setIsFileMenu(true));
        setFileMenuAnchor(e.currentTarget);
    };

    const messageOnChange = (e) => {
        setMessage(e.target.value);

        if (!iAmTyping) {
            console.log("Emitting START_TYPING");
            socket.emit(START_TYPING, { members, chatId, userId: user._id });
            setIAmTyping(true);
        }

        if (typingTimeOut.current) clearTimeout(typingTimeOut.current);

        typingTimeOut.current = setTimeout(() => {
            console.log("Emitting STOP_TYPING");
            socket.emit(STOP_TYPING, { members, chatId, userId: user._id });
            setIAmTyping(false);
        }, 2000);
    }

    const submitHandler = (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        if (socket) {
            socket.emit(NEW_MESSAGE, { chatId, members, message });
            console.log("chatId, members, message", { chatId, members, message })
        } else {
            console.error('Socket is not initialized');
        }

        setMessage("");
    };

    useEffect(() => {
        socket.emit(CHAT_JOINED, { userId: user._id, members })
        dispatch(removeNewMessagesAlert(chatId));

        return () => {
            setMessage("");
            setOldMessages([]);
            setMessages([]);
            setPage(1);
            socket.emit(CHAT_LEAVED, { userId: user._id, members })
        };
    }, [chatId, dispatch]);

    useEffect(() => {
        if (bottomRef.current)
            bottomRef.current.scrollIntoView({
                behavior: "smooth"
            })
    }, [messages])

    useEffect(() => {
        if (chatDetails?.isError) return navigate("/");
    }, [chatDetails?.isError])



    const newMessageListener = useCallback((data) => {
        if (data.chatId !== chatId) return;
        setMessages((prev) => [...prev, data.message]);
    }, [chatId]);

    const startTypingListener = useCallback((data) => {
        if (data.chatId !== chatId) return;
        console.log("Received START_TYPING", data);
        setUserTyping((prev) => ({ ...prev, [data.userId]: true }));
    }, [chatId]);

    const stopTypingListener = useCallback((data) => {
        if (data.chatId !== chatId) return;
        console.log("Received STOP_TYPING", data);
        setUserTyping((prev) => ({ ...prev, [data.userId]: false }));
    }, [chatId]);

    const alertListener = useCallback((data) => {
        if (data.chatId !== chatId) return;
        const messageForAlert = {
            content: data.message,
            sender: {
                _id: "system", // or any unique identifier for system messages
                name: "Admin",
            },
            chat: chatId,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, messageForAlert]);
    }, [chatId]);


    const eventHandler = {
        [ALERT]: alertListener,
        [NEW_MESSAGE]: newMessageListener,
        [START_TYPING]: startTypingListener,
        [STOP_TYPING]: stopTypingListener
    };

    useSocketHandler(socket, eventHandler);
    useErrors(errors);

    const allmembers = [...oldmessages, ...messages];
    const isAnyUserTyping = Object.values(userTyping).some(isTyping => isTyping);

    return chatDetails.isLoading ? <Skeleton /> : (
        <Fragment>
            <Stack
                ref={containerRef}
                boxSizing={"border-box"}
                padding={"1rem"}
                spacing={"1rem"}
                bgcolor={grayColor}
                height={"90%"}
                sx={{
                    overflowX: "hidden",
                    overflowY: "auto",
                }}
            >
                {allmembers.map((message) => (
                    <MessageComponent key={message._id} message={message} user={user} />
                ))}

                {
                    isAnyUserTyping && <TypingLoader />
                }

                <div ref={bottomRef} />

            </Stack>

            <form style={{ height: "10%" }} onSubmit={submitHandler}>
                <Stack direction={"row"} height={"100%"} padding={"1rem"} alignItems={"center"} position={"relative"}>
                    <IconButton
                        sx={{
                            position: "absolute",
                            left: "1.5rem",
                            rotate: "-30deg",
                        }}
                        onClick={handleFileOpen}
                    >
                        <AttachmentIcon />
                    </IconButton>

                    <InputBox
                        placeholder='Type Message Here...'
                        value={message}
                        onChange={messageOnChange} />

                    <IconButton
                        type='submit'
                        sx={{
                            backgroundColor: "#3D9DF2",
                            color: "white",
                            marginLeft: "0.5rem",
                            "&:hover": {
                                backgroundColor: "#1A7FEA",
                            },
                        }}
                    >
                        <SendIcon />
                    </IconButton>
                </Stack>
            </form>

            <FileMenu anchorEl={fileMenuAnchor} chatId={chatId} />
        </Fragment>
    );
};

export default AppLayout()(Chat);
