// import React from 'react'
// import AppLayout from '../components/layouts/AppLayout';
import { Add as AddIcon, Close as CloseIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from '@mui/icons-material';
import { Backdrop, Box, Button, CircularProgress, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { Suspense, lazy, memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutLoader } from '../components/layouts/Loaders';
import AvatarCard from '../components/shared/AvatarCard';
import UserItem from '../components/shared/UserItem';
import { Link } from '../components/styles/StyledComponent';
import { matBlack } from '../constants/color';
import { useAsyncMutation, useErrors } from '../hooks/hook';
import { useChatDetailsQuery, useDeleteGroupMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api';
import { setIsAddMember } from '../redux/reducers/misc';

const ConfirmDeleteDialog = lazy(() => import('../components/dialogs/ConfirmDeleteDialog'));
const AddMemberDialog = lazy(() => import('../components/dialogs/AddMemberDialog'));


const Groups = () => {


    const navigate = useNavigate(true);
    const dispatch = useDispatch();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const chatId = searchParams.get("group");

    const myGroups = useMyGroupsQuery("")

    const { isAddMember } = useSelector((state) => state.misc);

    const groupDetails = useChatDetailsQuery(
        { chatId, populate: true },
        { skip: !chatId }
    )

    console.log("groupdetails.data", groupDetails?.data)

    console.log(groupDetails?.data)

    const [renameGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation);

    const [removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation);

    const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteGroupMutation);


    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

    const [groupName, setGroupName] = useState("");
    const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");


    const errors = [
        {
            isError: myGroups.isError,
            error: myGroups.error,
        },
        {
            isError: groupDetails.isError,
            error: groupDetails.error,
        }
    ]

    useErrors(errors)

    const navigateBack = () => {
        navigate("/");
    }

    const handleMobile = () => {
        setIsMobileMenuOpen((prev) => !prev)
    }

    const handleMobileClose = () => {
        setIsMobileMenuOpen((prev) => !prev)
    }

    const updateGroupName = () => {
        setIsEdit(false);
        renameGroup("updating...", {
            chatId,
            name: groupNameUpdatedValue
        })
        console.log("updateGropuName")
    }

    const openAddMemberHandler = () => {
        dispatch(setIsAddMember(true))
        console.log("add member");
    }

    const openConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(true);
    }

    const closeConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(false);
    }

    const deleteHandler = () => {
        deleteGroup("Deleting Group...", chatId); // Ensure chatId is a string
        closeConfirmDeleteHandler();
        navigate("/groups");
      };
      
      const removeMemberHandler = (userId) => {
        removeMember("Removing Member...", { chatId, userId });
      };
      
    useEffect(() => {
        if (chatId) {
            setGroupName(`Group Name ${chatId}`);
            setGroupNameUpdatedValue(`Group Name ${chatId}`);
        }

        return () => {
            setGroupName("");
            setGroupNameUpdatedValue("");
            setIsEdit(false);
        }
    }, [chatId]);

    const IconBtns = <>

        <Box sx={{
            display: {
                xs: "block",
                sm: "none"
            },
            position: "fixed",
            right: "1rem",
            top: "1rem",
        }}>
            <IconButton onClick={handleMobile}>
                {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>

        </Box>

        <Tooltip title="back">
            <IconButton sx={{
                position: "absolute",
                top: "2rem",
                left: "2rem",
                color: "white",
                bgcolor: matBlack,
                "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, .9)"
                },
            }}
                onClick={navigateBack}
            >
                <KeyboardBackspaceIcon />
            </IconButton>
        </Tooltip>
    </>

    const GroupName = (
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={3} >
            {
                isEdit ? (
                    <>
                        <TextField value={groupNameUpdatedValue} onChange={(e) => setGroupNameUpdatedValue(e.target.value)} />
                        <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}><DoneIcon /></IconButton>
                    </>
                ) : (
                    <>
                        <Typography variant='h5'>{groupDetails?.data?.data?.name}</Typography>
                        <IconButton onClick={() => setIsEdit(true)} disabled={isLoadingGroupName}><EditIcon /></IconButton>
                    </>
                )
            }
        </Stack>
    )

    const buttonGroup = (
        <Stack
            direction={{
                xs: "column-reverse",
                sm: "row"
            }}
            spacing={"1rem"}
            p={{
                xs: "0",
                sm: "1rem",
                md: "1rem 4rem"
            }}
        >
            <Button size='small' variant='contained' endIcon={<AddIcon />} onClick={openAddMemberHandler}>Add Member</Button>
            <Button size='small' variant='outlined' color='error' startIcon={<DeleteIcon />} onClick={openConfirmDeleteHandler}>Delete Group</Button>
        </Stack>
    )

    return myGroups.isLoading ? <LayoutLoader /> : (
        <Grid container height={"100vh"} >
            <Grid
                item
                sx={{
                    display: {
                        xs: "none",
                        sm: "block"
                    },
                    overflow: "auto",
                    height: "100%"
                }}

                sm={4}
            >
                <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
            </Grid>

            <Grid item xs={12} sm={8} sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                padding: "1rem 3rem"
            }}>
                {IconBtns}

                {
                    groupName && <>
                        {GroupName}
                        <Typography sx={{ marginTop: "2rem" }}>Members</Typography>

                        <Stack
                            maxWidth={"45rem"}
                            width={"100%"}
                            boxSizing={"border-box"}
                            padding={{
                                sm: "1rem",
                                xs: "0",
                                md: "1rem 4rem"
                            }}
                            spacing={"2rem"}
                            height={"50vh"}
                            overflow={"auto"}
                        >

                            {isLoadingRemoveMember ? (<CircularProgress />) :
                                groupDetails?.data?.data?.members?.map((i) => (
                                    <UserItem
                                        key={i._id}
                                        user={i}
                                        isAdded
                                        styling={{
                                            boxShadow: "0 0 10px",
                                            // padding: "0.2rem 0.6rem",
                                            borderRadius: "5px",
                                        }}
                                        handler={removeMemberHandler}

                                    />
                                ))
                            }
                        </Stack>

                        {buttonGroup}
                    </>

                }
            </Grid>
            {
                isAddMember && (
                    <Suspense fallback={<Backdrop open />}>
                        <AddMemberDialog chatId={chatId} />
                    </Suspense>
                )
            }

            {
                confirmDeleteDialog && (
                    <Suspense fallback={<Backdrop open />}>
                        <ConfirmDeleteDialog
                            open={confirmDeleteDialog}
                            handleClose={closeConfirmDeleteHandler}
                            deleteHandler={deleteHandler}
                        />
                    </Suspense>
                )
            }

            <Drawer sx={{
                display: {
                    xs: "block",
                    sm: "none"
                }
            }} open={isMobileMenuOpen} onClose={handleMobileClose}>
                <Typography sx={{
                    textAlign: "center",
                    padding: "1rem",
                    backgroundImage: "linear-gradient(#191714, #2234AE)",
                    color: "white",
                    fontSize: "20px",
                    fontWeight: 600,
                    fontFamily: "system-ui"
                }}>Group List</Typography>
                <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} w={"60vw"} />
            </Drawer>

        </Grid>
    )
}

const GroupList = ({ w = "100%", myGroups = [], chatId }) => (
    <Stack direction={"column"} sx={{
        height: "100%",
        overflowY: "auto",
        backgroundImage: "linear-gradient(#004FF9, #000000)",
    }}>
        {myGroups.length !== 0 ? (
            myGroups.map((group) => (
                <GroupListItem group={group} chatId={chatId} key={group._id} />
            ))
        ) : (
            <Typography sx={{
                textAlign: "center",
                padding: "1rem",
                bgcolor: 'black',
                color: "#fff",
                fontWeight: 600
            }}>No Group Available</Typography>
        )}
    </Stack>
);

const GroupListItem = memo(({ group, chatId }) => {
    const { name, _id, avatar } = group;

    return <Link to={`?group=${_id}`} onClick={
        (e) => {
            if (chatId === _id) e.preventDefault();
        }
    }>
        <Stack direction={"row"} spacing={"3rem"} alignItems="center" sx={{ color: "white" }}>
            <AvatarCard avatar={avatar} />
            <Typography>{name}</Typography>
        </Stack>
    </Link>
})


export default Groups;
