import React, { useEffect, useState } from "react";
import { Launcher } from "react-chat-window";
import Sockette from "sockette";
let ws = null;

const ChatWindow = props => {
  const [messageList, setMessageList] = useState([]);
  const [badge, setBadge] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { username } = props.authData;

  useEffect(
    () => {
      if (props.authData)
        console.log(props.authData.signInUserSession.accessToken.jwtToken)
        ws = new Sockette(
          "wss://sxaylxqkbj.execute-api.ap-southeast-1.amazonaws.com/dev?token=" +
            'eyJraWQiOiJZd0NuWXlYRm5pM2M0bDNOOHRXbFZHaExqNEJ3cVNNSXdEc05JYW1HK0l3PSIsImFsZyI6IlJTMjU2In0.eyJvcmlnaW5fanRpIjoiYTAzZTcxNGYtYzAyNC00YzFkLTkwNTktZjMyNjA2OTdjNzk1Iiwic3ViIjoiMTljN2MyY2QtYTQ0Yi00NzE0LTk5ODAtNWY2NmM1ZDQ4NjRkIiwiZXZlbnRfaWQiOiIyYzgwNGY2Yi1iMTdjLTQxNTItYWJhYy04OGY4ZDMwZGU0MzUiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNjM1NTU4NDcwLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTFfUUtxcm1ZcTJkIiwiZXhwIjoxNjM1NTY2MzU0LCJpYXQiOjE2MzU1NjI3NTQsImp0aSI6IjZhNjdlNjEwLTc4ZWYtNGIzOS1iNzkwLWEzNDE0OTdhNzkxYyIsImNsaWVudF9pZCI6IjV1MHE5NTRuZW1hbThkYmIycjNybHNpODZhIiwidXNlcm5hbWUiOiIxOWM3YzJjZC1hNDRiLTQ3MTQtOTk4MC01ZjY2YzVkNDg2NGQifQ.oCLrdm9PRssN62fPCBq8Bie1DxOxOwfu8-3BO1YY0qULWNiNS6ZtKk-Qu-bvLf_BvhvvWmHjri_xnod3aENKWOURDZroi3PHJveqQfr3r-FJCJYWvkn2k5nnSZfMab-R38GgmKbewo6DbqVXbyA_AM8pb6jmzzW-fgtmZ1jJPh5kP1JXtSoWlSEeqqreYWgs4QrLF1Qhow1dxL31PWjgGhTkFAqM4UFxWAKMVGNaNl49JX8SmX5UmjDqyPC36vjq1fwl9Exk9jn_KOtouA3cYbjG0qUIw3L8AQj2OBc4qkItFBQqdwHBbKGEa8uCIDFs4vRPLLIKCbs5g6qi6zXwEA',
          {
            timeout: 5e3,
            maxAttempts: 1,
            onopen: e => console.log("connected:", e),
            onmessage: e => onMessageReceied(e),
            onreconnect: e => console.log("Reconnecting...", e),
            onmaximum: e => console.log("Stop Attempting!", e),
            onclose: e => console.log("Closed!", e),
            onerror: e => console.log("Error:", e)
          }
        );
      return function cleanup() {
        ws && ws.close();
        ws = null;
      };
    },
    [messageList]
  );

  const handleClick = () => {
    setIsOpen(!isOpen);
    setBadge(0);
  };

  const onMessageWasSent = message => {
    const newMessage = { ...message, author: username };
    ws.json({
      action: "sendMessage",
      data: JSON.stringify(newMessage)
    });
  };

  const onMessageReceied = ({ data }) => {
    const { author, type, data: messageData } = JSON.parse(data);
    const isMe = username === author ? "me" : "them";
    if (!isOpen) {
      setBadge(+badge + 1);
    }
    setMessageList([
      ...messageList,
      {
        author: isMe,
        type,
        data: messageData
      }
    ]);
  };
  return (
    <div>
      <Launcher
        agentProfile={{
          teamName: "react-live-chat",
          imageUrl:
            "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png"
        }}
        onMessageWasSent={onMessageWasSent}
        messageList={messageList}
        handleClick={handleClick}
        isOpen={isOpen}
        showEmoji
        newMessagesCount={badge}
      />
    </div>
  );
};

export default ChatWindow;
