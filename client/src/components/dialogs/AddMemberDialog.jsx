import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useAsyncMutation, useErrors } from "../../hooks/hook"
import { useAddGroupMemberMutation, useAvailableFriendsQuery } from "../../redux/api/api"
import { setIsAddMember } from "../../redux/reducers/misc"
import UserItem from "../shared/UserItem"

const AddMemberDialog = ({ chatId }) => {

    const dispatch = useDispatch();

    const { isAddMember } = useSelector((state) => state.misc);

    const [addMember, isLoadingAddMember] = useAsyncMutation(useAddGroupMemberMutation);

    const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);

    const [selectedMembers, setSelectedMembers] = useState([]);

    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) => prev.includes(id) ? prev.filter((currElement) => currElement !== id) : [...prev, id])
    }
    const addMemberSubmitHandler = () => {
        addMember("Adding Member...", { members: selectedMembers, chatId })
        closeHandler();
    }

    const closeHandler = () => {
        dispatch(setIsAddMember(false))
    }

    useErrors([{ isError, error }])
    console.log(data)

    return (
        <Dialog open={isAddMember} onClose={closeHandler}>
            <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
                <DialogTitle textAlign={"center"} >Add Member</DialogTitle>
            </Stack>

            <Stack spacing={"0.5rem"}>
                {isLoading ? (<Skeleton />) :
                    data?.friends?.length > 0 ? (
                        data?.friends?.map((user) => (
                            <UserItem
                                key={user._id}
                                user={user}
                                handler={selectMemberHandler}
                                isAdded={selectedMembers.includes(user._id)}
                            />
                        ))
                    ) : (
                        <Typography textAlign={"center"}>No Friends</Typography>
                    )}
            </Stack>

            <Stack direction={"row"} p={"2rem"} justifyContent={"space-evenly"}>
                <Button color="error" onClick={closeHandler}>Cancel</Button>
                <Button variant="contained" disabled={isLoadingAddMember} onClick={addMemberSubmitHandler}>Submit Changes</Button>
            </Stack>
        </Dialog>
    )
}

export default AddMemberDialog