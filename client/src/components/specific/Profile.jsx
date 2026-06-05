import moment from 'moment'
import { Avatar, Stack, Typography } from '@mui/material';
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { transformImage } from '../../lib/features';

const Profile = ({ user }) => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        src={transformImage(user?.avatar?.url)}
        sx={{
          width: 160,
          height: 160,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white"
        }}
      />
      <ProfileCrad heading={"Name"} text={user?.name} Icon={FaceIcon} />


      <ProfileCrad heading={"Username"} text={user?.username} Icon={UserNameIcon} />
      <ProfileCrad heading={"Joined"} text={moment(user?.createdAt).fromNow()} Icon={CalendarIcon} />
      <ProfileCrad heading={"Bio"} text={user?.bio || "No  bio available"} />



    </Stack>
  )
}

const ProfileCrad = ({ text, Icon, heading }) =>
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
  >
    {Icon && <Icon />}

    <Stack>
      <Typography variant='body1'>{text}</Typography>
      <Typography color={"gray"} variant='caption'>{heading}</Typography>

    </Stack>

  </Stack>

export default Profile;