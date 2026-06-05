import { useFetchData } from '6pp';
import { AdminPanelSettings as AdminPanelSettingsIcon, Group as GroupIcon, Message as MessageIcon, Notifications as NotificationsIcon, Person as PersonIcon } from '@mui/icons-material';
import { Box, Container, Paper, Skeleton, Stack, Typography } from '@mui/material';
import moment from 'moment';
import AdminLayout from '../../components/layouts/AdminLayout';
import { DoughnutChart, LineChart } from '../../components/specific/Chart';
import { CurveButton, SearchField } from '../../components/styles/StyledComponent';
import { server } from '../../constants/config';
import { useErrors } from '../../hooks/hook';

const Dashboard = () => {

    const { loading, data, error } = useFetchData(`${server}/api/v1/admin/stats`, "dashboard-stats");

    const { stats } = data || {};


    useErrors([{
        isError: error,
        error: error
    }])

    const Appbar = <Paper
        elevation={3}
        sx={{
            padding: "2rem",
            margin: "2rem 0",
            borderRadius: "1rem"
        }}
    >
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <AdminPanelSettingsIcon sx={{ fontSize: "2rem" }} />

            <SearchField placeholder='search...' />

            <CurveButton>Search</CurveButton>

            <Box flexGrow={"1"} />
            <Typography sx={{
                display: {
                    xs: "none",
                    lg: "block",
                }
            }}>
                {moment().format("MMMM Do YYYY")}
                <NotificationsIcon />

            </Typography>
        </Stack>
    </Paper>

    const Widgets = <Stack
        direction={{
            xs: "column",
            sm: "row",

        }}
        spacing={"2rem"}
        justifyContent={"space-between"}
        alignItems={"center"}
        margin={"2rem 0"}
    >
        <Widget title={"Users"} value={stats?.userCount} icon={<PersonIcon />} />
        <Widget title={"Chats"} value={stats?.totalChatsCount} icon={<GroupIcon />} />
        <Widget title={"Messages"} value={stats?.messageCount} icon={<MessageIcon />} />
    </Stack>

    return (
        <AdminLayout>
            {
                loading ? ( <Skeleton /> ) : (
                    <Container component={"main"}>
                    {Appbar}
    
                    <Stack
                        direction={{ xs: "column", lg: "row" }}
                        flexWrap={"wrap"}
                        alignItems={{ xs: "center", lg: "stretch" }}
                        justifyContent={"center"}
                        sx={{
                            gap: "2rem"
                        }}
                    >
                        <Paper
                            elevation={3}
                            sx={{
                                padding: "2rem",
                                maxWidth: "45rem",
                                width: "100%",
                                borderRadius: "1rem",
                                // height: "25rem"
                            }}
                        >
                            <Typography margin={"2rem 0"} variant='h6'>Last Messages</Typography>
    
                            <LineChart value={stats?.messagesCharts || []} />
    
                        </Paper>
    
                        <Paper
                            elevation={3}
                            sx={{
                                padding: "1rem",
                                borderRadius: "1rem",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: { xs: "100%", sm: "50%" },
                                position: "relative",
                                maxWidth: "20rem",
                                // height: "25rem"
                            }}
                        >
                            <DoughnutChart
                                labels={["Single Chats", "Group Chats"]}
                                value={[stats?.totalChatsCount - stats?.groupCount || 0, stats?.groupCount || 0]}
                            />
    
                            <Stack
                                position={"absolute"}
                                direction={"row"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                spacing={"0.5rem"}
                                width={"100%"}
                                height={"100%"}
                            >
                                <GroupIcon /> <Typography>Vs</Typography>
                                <PersonIcon />
                            </Stack>
                        </Paper>
                    </Stack>
    
                    {Widgets}
    
                </Container>
                )
            }
        </AdminLayout>
    )
}

const Widget = ({ title, value, icon }) => <Paper
    elevation={3}
    sx={{
        padding: "2rem",
        margin: "2rem 0",
        borderRadius: "1rem",
        width: "20rem"
    }}
>
    <Stack alignItems={"center"} spacing={"1rem"}>
        <Typography
            sx={{
                color: "rgba(0,0,0,0.5)",
                borderRadius: "50%",
                border: "5px solid rgba(0,0,0,0.7)",
                width: "5rem",
                height: "5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            {value}
        </Typography>
        <Stack sx={{
            color: "rgba(0,0,0,0.9)",
            width: "5rem",
            height: "5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            {icon}
            <Typography sx={{ fontWeight: "bold" }}>{title}</Typography>
        </Stack>
    </Stack>
</Paper>

export default Dashboard
