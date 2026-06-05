import { Stack } from '@mui/material';
import ChatItem from '../shared/ChatItem';

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [],
  handleDeleteChat // Ensure this matches with the passed prop name
}) => {
  return (
    <Stack width={w} direction={"column"} sx={{ overflow: "auto", height: "100%" }}>
      {
        chats.map((data, index) => {
          const { avatar, name, _id, groupChat, members } = data;

          const newMessageAlertItem = newMessagesAlert.find(
            ({ chatId }) => chatId === _id
          );

          const isOnline = members?.some((member) => onlineUsers.includes(member));

          return <ChatItem
            key={_id}
            index={index}
            newMessageAlert={newMessageAlertItem}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            _id={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat} // Pass the handler
          />;
        })
      }
    </Stack>
  );
};

export default ChatList;
