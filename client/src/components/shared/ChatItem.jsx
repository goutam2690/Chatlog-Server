import { Box, Stack, Typography } from "@mui/material";
import { Link } from "../styles/StyledComponent";
import { memo } from "react";
import AvatarCard from "./AvatarCard";
import { motion } from 'framer-motion'

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat
}) => {
  return (
    <Link
      sx={{ padding: "0" }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}

        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem",
          backgroundColor: sameSender ? "#34495E" : "unset",
          color: sameSender ? "white" : "unset",
          position: "relative",
        }}>
        <AvatarCard avatar={avatar} />
        <Stack>
          <Typography>{name}</Typography>
          {
            newMessageAlert && (
              <Typography sx={{ fontSize: "12px", color: "#1A7FEA" }}>
                {newMessageAlert.count} New Message
              </Typography>
            )
          }
        </Stack>
        {
          isOnline && (
            <Box sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "40%",
              right: "1rem",
              transform: "translate(-50%)",
            }} />
          )
        }
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);
