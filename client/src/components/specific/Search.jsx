import { useInputValidation } from '6pp';
import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';
import { Dialog, DialogTitle, IconButton, InputAdornment, List, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncMutation } from '../../hooks/hook';
import { useLazySearchUserQuery, useSendFriendRequestMutation, } from '../../redux/api/api';
import { setIsSearch } from '../../redux/reducers/misc';
import UserItem from '../shared/UserItem';

const Search = () => {


    const { isSearch } = useSelector(state => state.misc);

    const [searchUser] = useLazySearchUserQuery();
    const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation);

    const dispatch = useDispatch();

    const [users, setUsers] = useState([])
    const [error, setError] = useState(null);

    const search = useInputValidation("");

    const handleCloseDialog = () => {
        dispatch(setIsSearch(false));
    }

    const handleClearIconClick = (event) => {
        event.stopPropagation();
        handleCloseDialog();
    }

    const addFriendHandler = async (id) => {
        try {
            await sendFriendRequest("sending friend request...", { userId: id });
            setError(null); // Clear any previous errors on success
        } catch (err) {
            setError(err.data ? err.data.message : "An error occurred");
        }
    }


    useEffect(() => {

        const timeOutId = setTimeout(() => {
            searchUser(search.value).then(({data}) => setUsers(data.users));
        }, 1000)

        return () => {
            clearTimeout(timeOutId)
        }

    }, [search.value])

    return (
        <Dialog open={isSearch} onClose={handleCloseDialog}>
            <Stack p={"2rem"} direction={"column"} position={"relative"}>
                <DialogTitle sx={{ textAlign: "center" }}>Find People</DialogTitle>

                <IconButton onClick={handleClearIconClick} style={{ cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }}>
                    <ClearIcon />
                </IconButton>

                <TextField
                    label=""
                    value={search.value}
                    onChange={search.changeHandler}
                    variant='outlined'
                    size='small'
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />

                <List>

                    {users.map((user) => (
                        <UserItem
                            user={user}
                            key={user._id}
                            handler={addFriendHandler}
                            handlerIsLoading={isLoadingSendFriendRequest}
                        />
                    ))}
                </List>
            </Stack>
        </Dialog>
    );
}

export default Search;
