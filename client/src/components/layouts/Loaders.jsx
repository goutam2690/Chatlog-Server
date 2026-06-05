import { Grid, Skeleton, Stack, CircularProgress, Typography, keyframes, Box} from '@mui/material'

export const LayoutLoader = () => {
    return <Grid
        container
        height={"calc(100vh - 4rem)"}
        spacing={"1rem"}
    >
        <Grid
            item
            sm={4}
            md={3}
            sx={{ display: { xs: "none", sm: "block" } }}
            height={"100%"}
        >
            <Skeleton variant='rectangular' height={"100vh"} />
        </Grid>

        <Grid
            item
            xs={12}
            sm={8}
            md={5}
            lg={6}
            height={"100%"}
        >
            <Stack spacing={"1rem"}>
                {
                    Array.from({ length: 10 }).map((_, index) => (
                        <Skeleton key={index} variant='rounded' height={"5rem"} />
                    ))
                }
            </Stack>

        </Grid>

        <Grid
            item
            md={4}
            lg={3}
            height={"100vh"}
            sx={{ display: { xs: "none", md: "block" } }}
        >
            <Skeleton variant='rectangular' height={"100vh"} />
        </Grid>

    </Grid>

}

// export const TypingLoader = () => {
//     return (
//         <Stack   direction="row" alignItems="center" spacing={1}>
//             <CircularProgress size={20} />
//             <Typography variant="body2" color="textSecondary">
//                 Typing...
//             </Typography>
//         </Stack>
//     );
// };

const styles = {
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#3D9DF2',
      margin: '0 2px',
      display: 'inline-block',
      animation: 'typingAnimation 1s infinite ease-in-out',
    },
    dotWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
  
  export const TypingLoader = () => {
    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={styles.dotWrapper}>
          <Box sx={{ ...styles.dot, animationDelay: '0s' }} />
          <Box sx={{ ...styles.dot, animationDelay: '0.2s' }} />
          <Box sx={{ ...styles.dot, animationDelay: '0.4s' }} />
        </Box>
        <Typography variant="body2" color="textSecondary">
          Typing...
        </Typography>
      </Stack>
    );
  };

