import { Clear as ClearIcon } from '@mui/icons-material';
import { Avatar, Button, Dialog, DialogTitle, IconButton, ListItem, Skeleton, Stack, Typography } from '@mui/material';
import { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api';
import { setIsNotification } from '../../redux/reducers/misc';
import toast from 'react-hot-toast';

const Notification = () => {

  const { isNotification } = useSelector((state) => state.misc);

  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const dispatch = useDispatch();

  const { isLoading, data, error, isError } = useGetNotificationsQuery()

  const [isDialogOpen, setDialogOpen] = useState(true);

  const handleCloseDialog = () => {
    setDialogOpen(false);
  }

  const closeHandler = () => dispatch(setIsNotification(false))

  const handleClearIconClick = (event) => {
    event.stopPropagation();
    handleCloseDialog();
  }

  const friendRequestHandler = async(_id, accept) => {

    dispatch(setIsNotification(false));
    await acceptRequest("Accepting Friend Request...", { requestId: _id , accept})
    
  }

  useErrors([{ isError, error }]);

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }}>
        <DialogTitle>Notification</DialogTitle>
        <IconButton onClick={handleClearIconClick} style={{ cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }}>
          <ClearIcon />
        </IconButton>

        {
          isLoading ? <Skeleton /> : (
            data?.allRequests?.length > 0 ?
              (
                data?.allRequests?.map((notification) => (
                  <NotificationItem
                    key={notification._id} // Add a unique key prop for each item
                    sender={notification.sender}
                    _id={notification._id} // Corrected prop name
                    handler={friendRequestHandler}
                  />
                ))
              ) :
              (<Typography textAlign={"center"}>No Notifications</Typography>)
          )
        }
      </Stack>
    </Dialog>
  )
}

const NotificationItem = memo(({ sender, _id, handler }) => {

  const { name, avatar } = sender;

  const acceptHandler = () => {
    handler(_id, true); // Call the handler function with the correct parameters
  };

  const declineHandler = () => {
    handler(_id, false); // Call the handler function with the correct parameters
  };

  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        width={"100%"}
        spacing={"1rem"}
      >
        <Avatar src={avatar} />

        <Typography
          variant='body1'
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%"
          }}
        >
          {`${name} sent you a friend request`}
        </Typography>

        <Stack direction={{
          xs: "column",
          sm: "row"
        }}>
          <Button variant='text' onClick={acceptHandler}>Accept</Button>
          <Button variant='text' color='error' onClick={declineHandler}>Decline</Button>
        </Stack>

      </Stack>
    </ListItem>
  )
})

export default Notification;
