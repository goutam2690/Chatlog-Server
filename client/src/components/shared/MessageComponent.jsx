import { Box, Typography } from '@mui/material';
import moment from 'moment';
import { memo } from 'react';
import { fileFormat } from '../../lib/features';
import RenderAttachments from './RenderAttachments';
import { motion } from 'framer-motion'

const MessageComponent = ({ message, user }) => {
    const { sender, content, attachments = [], createdAt } = message;

    const sameSender = sender?._id === user?._id;

    const timeAgo = moment(createdAt).fromNow();

    return (
        <motion.div
        initial={{ opacity: 0, x: "-100%"}}
        whileInView={{ opacity: 1, x: 0}}

            style={{
                alignSelf: sameSender ? "flex-end" : "flex-start",
                marginBottom: "10px",
                padding: "0.5rem",
                backgroundColor: "#fff",
                color: "black",
                borderRadius: "5px",
                width: "fit-content",
                fontSize: "14px"
            }}
        >

            {
                !sameSender && <Typography sx={{ color: "#02D58B", fontWeight: "600" }} variant='caption'>{sender.name}</Typography>
            }
            {
                sameSender && <Typography sx={{ color: "#02D58B", fontWeight: "600" }} variant='caption'>me</Typography>
            }


            {
                content && <Typography>{content}</Typography>
            }

            {
                attachments.length > 0 && attachments.map((attachment, index) => {
                    const url = attachment.url;
                    const file = fileFormat(url);

                    return (
                        <Box key={index}>
                            <a
                                href={url}
                                target='_blank'
                                download
                                style={{
                                    color: "black",
                                }}
                            >
                                <RenderAttachments file={file} url={url} />
                            </a>
                        </Box>
                    )
                })
            }

            <Typography variant='caption' color={"text.secondary"}>{timeAgo}</Typography>

        </motion.div>
    )
}

export default memo(MessageComponent);