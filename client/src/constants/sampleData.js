export const sampleChats = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "John Doe",
    _id: "1",
    groupChat: "false",
    members: ["1", "2"],
  },
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "Goutam Shaw ",
    _id: "2",
    groupChat: "false",
    members: ["1", "2"],
  },
];

export const sampleUsers = [
  {
    _id: "1",
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "Goutam Shaw",
  },
  {
    _id: "2",
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "John Devin",
  },
];

export const sampleNotification = [
  {
    _id: "1",
    sender: {
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      name: "Goutam Shaw",
    },
  },
  {
    _id: "2",
    sender: {
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      name: "John Devin",
    },
  },
];

export const sampleMessage = [
  {
    attachments: [
      {
        public_id: "asasasas",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],
    content: "my name is goutam shaw",
    _id: "gaffdbcgdterwfadsejf",
    sender: {
      _id: "user._id",
      name: "ayush",
    },
    chat: "chatId",
    createdAt: "2024-02-12T10:41:30.630Z",
  },
  {
    attachments: [
      {
        public_id: "asasasas",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],
    content: "my name is goutam shaw",
    _id: "gaffdbcgdterwfadsef",
    sender: {
      _id: "agfgfj",
      name: "ayush",
    },
    chat: "chatId",
    createdAt: "2024-02-12T10:41:30.630Z",
  },
];

export const DashboardData = {
  users: [
    {
      name: "Goutam Shaw",
      _id: "1",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      username: "Goutam_2690",
      friends: "20",
      groups: "5",
    },
    {
      name: "Ayush Kumar",
      _id: "2",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      username: "ayush_2690",
      friends: "234",
      groups: "8",
    },
  ],

  Chats: [
    {
      name: "asansol",
      _id: "1",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      groupChat: false,
      members: [
        {
          _id: "1",
          avatar: "https://www.w3schools.com/howto/img_avatar.png",
        },
        {
          _id: "2",
          avatar: "https://www.w3schools.com/howto/img_avatar.png",
        },
      ],
      totalMembers: 2,
      totalMessages: 20,
      creator: {
        name: "Goutam Shaw",
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
      },
    },
    {
      name: "aparichit",
      _id: "2",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      groupChat: false,
      members: [
        {
          _id: "2",
          avatar: "https://www.w3schools.com/howto/img_avatar.png",
        },
        {
          _id: "2",
          avatar: "https://www.w3schools.com/howto/img_avatar.png",
        },
      ],
      totalMembers: 5,
      totalMessages: 50,
      creator: {
        name: "Goutam Shaw",
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
      },
    },
  ],

  messages: [
    {
      attachments: [
        {
          public_id: "asasasas",
          url: "https://www.w3schools.com/howto/img_avatar.png",
        },
      ],
      content: "this is a test message",
      groupChat: false,
      _id: "gagagagagaga",
      sender: {
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
        name: "goutam shaw"
      },
      chat: "chatId",
      createdAt: "2024-02-12T10:41:30.630Z",
    },

    {
      attachments: [
        {
          public_id: "asasasasws",
          url: "https://www.w3schools.com/howto/img_avatar.png",
        },
      ],
      content: "this is a test message",
      groupChat: true,
      _id: "gagagagagagaa",
      sender: {
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
        name: "goutam shaw"
      },
      chat: "chatId",
      createdAt: "2024-02-12T10:41:30.630Z",
    },
  ],
};
