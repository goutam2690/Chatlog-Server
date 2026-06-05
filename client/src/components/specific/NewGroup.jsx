import { useInputValidation } from '6pp';
import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api';
import { setIsNewGroup } from '../../redux/reducers/misc';
import UserItem from '../shared/UserItem';

const NewGroup = () => {

  const dispatch = useDispatch();

  const { isNewGroup } = useSelector((state) => state.misc);

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();

  const [ newGroup, isLoadingNewGroup ] = useAsyncMutation(useNewGroupMutation)

  const groupName = useInputValidation("");

  const [selectedMembers, setSelectedMembers] = useState([]);


  const errors = [
    {
      isError,
      error
    }
  ]

  useErrors(errors)

   const selectMemberHandler = (id) => {
    setSelectedMembers((prev) => prev.includes(id) ? prev.filter((currElement) => currElement !== id) : [...prev, id])
  }

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required!");
    if (selectedMembers.length < 1) return toast.error("Please select at least 1 member");
  
    newGroup("Creating new group..",{ name: groupName.value, members: selectedMembers });
  
    closeHandler();
  }
  

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  }

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "3rem", sm: "2rem" }} width={"auto"} height={"auto"} spacing={"1rem"} textAlign={'center'}>
        <DialogTitle>New Group</DialogTitle>


        <TextField label='Group Name' value={groupName.value} onChange={groupName.changeHandler} />

        <Typography variant='body1' sx={{ mt: "0.75rem", textAlign: "center", backgroundColor: "whitesmoke", p: "0.75rem" }}>Members - List</Typography>

        <Stack>
          {
            isLoading ? (<Skeleton />) :
              (data?.friends?.map((user) => (
                <UserItem
                  user={user}
                  key={user._id}
                  handler={selectMemberHandler}
                  isAdded={selectedMembers.includes(user._id)}
                // handlerIsLoading={isLoadingSendFriendRequest}
                />
              )))}
        </Stack>

        <Stack direction={"row"} sx={{
          justifyContent: "space-between",
          mt: "0.75rem"
        }}>
          <Button variant='outlined' color='error' onClick={closeHandler}>Cancel</Button>
          <Button variant='contained' onClick={submitHandler} disabled={isLoadingNewGroup}>Create</Button >
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup