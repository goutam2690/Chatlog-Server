import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material';
import { memo } from 'react';
import { transformImage } from '../../lib/features';

const UserItem = ({ user, handler, handlerIsLoading, isAdded = false, styling }) => {
    const { name, _id, avatar } = user;

    return (
        <ListItem sx={styling}>
            <Stack
                direction="row"
                alignItems="center"
                width="100%"
                spacing="1rem"
            >
                <Avatar src={transformImage(avatar?.url)} alt={name} />

                <Stack direction="column" sx={{ flexGrow: 1 }}>
                    <Typography
                        variant="body1"
                        sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "100%",
                            whiteSpace: "nowrap"
                        }}
                    >
                        {name}
                    </Typography>
                </Stack>

                <Stack direction="row" alignItems="center">
                    <IconButton
                        onClick={() => handler(_id)}
                        disabled={handlerIsLoading}
                        size="small"
                        sx={{
                            bgcolor: isAdded ? "error.main" : "primary.main",
                            color: "white",
                            "&:hover": {
                                bgcolor: isAdded ? "error.dark" : "primary.dark"
                            },
                        }}
                    >
                        {isAdded ? <RemoveIcon /> : <AddIcon />}
                    </IconButton>
                </Stack>
            </Stack>
        </ListItem>
    );
}

export default memo(UserItem);
