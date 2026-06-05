const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.FRONTED_URL,
  ],
  credentials: true,
};

const CHATIFY_TOKEN = "Chatify-token";

export { corsOptions, CHATIFY_TOKEN };
