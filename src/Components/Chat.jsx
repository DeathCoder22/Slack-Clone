import { InfoOutlined, StarBorderOutlined } from "@material-ui/icons";
import React, { useEffect, useRef } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { selectChannelId } from "../features/appSlice";
import ChatInput from "./ChatInput";
import { db } from "../firebase";
import Message from "./Message";

const Chat = () => {
  const chatRef = useRef(null);
  const channelId = useSelector(selectChannelId);
  const [channelDetails] = useDocument(
    channelId && db.collection("channels").doc(channelId)
  );
  const [channelMessages, loading] = useCollection(
    channelId &&
      db
        .collection("channels")
        .doc(channelId)
        .collection("messages")
        .orderBy("timestamp", "asc")
  );

  useEffect(() => {
    chatRef?.current?.scrollIntoView({
      behaviour: "smooth",
    });
  }, [chatRef, channelId, loading]);

  return (
    <ChatContainer>
      {channelDetails ? (
        <>
          <ChatHeader>
            <ChatHeaderLeft>
              <h4>
                <strong>#{channelDetails?.data().name}</strong>
                <StarBorderOutlined />
              </h4>
            </ChatHeaderLeft>
            <ChatHeaderRight>
              <p>
                <InfoOutlined /> Details
              </p>
            </ChatHeaderRight>
          </ChatHeader>

          <ChatMessages>
            {channelMessages?.docs.map((doc) => {
              const { message, timestamp, user, userImage } = doc.data();

              return (
                <Message
                  key={doc.id}
                  message={message}
                  timestamp={timestamp}
                  user={user}
                  userImage={userImage}
                />
              );
            })}

            <ChatBottom ref={chatRef} />
          </ChatMessages>

          <ChatInput
            chatRef={chatRef}
            channelName={channelDetails?.data().name}
            channelId={channelId}
          />
        </>
      ) : (
        <div>select a channel</div>
      )}
    </ChatContainer>
  );
};

export default Chat;

const ChatContainer = styled.div`
  flex: 0.7;
  flex-grow: 1;
  overflow-y: scroll;
  margin-top: 4em;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid lightgray;
`;

const ChatHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  > h4 {
    display: flex;
    text-transform: lowercase;
    margin-right: 10px;
  }
  > h4 > .MuiSvgIcon-root {
    margin-left: 10px;
    font-size: 18px;
  }
`;
const ChatHeaderRight = styled.div`
  > p {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  > p > .MuiSvgIcon--root {
    margin-right: 5px !important;
    font-size: 16px;
  }
`;

const ChatMessages = styled.div``;

const ChatBottom = styled.div`
  padding-bottom: 200px;
`;
