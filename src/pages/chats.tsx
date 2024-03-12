import React, { useEffect, useState } from "react";
import { type Dispatch } from "umi";
import { connect } from "dva";
import Chat, { Bubble, useMessages, Icon } from "@chatui/core";
import { Avatar, List, Col, Row, Button, Tooltip, message } from "antd";
import withAuth from "@/hocs/withAuth";
import "@chatui/core/dist/index.css";
import "../assets/chatIcon";
import robotImg from "../assets/robot.jpg";
import { ChatType } from "@/models/chat";
import { LoginType } from "@/models/login";
import styles from "./chats.less";
import storeUtil from "@/utils/store";

interface InfoProps {
  dispatch: Dispatch;
  chatMessage?: any;
  messageLoading?: boolean;
  history?: any;
  historyLoading?: boolean;
  curMessage?: any;
  curChat?: any;
  curUser?: any;
}

const initialMessages = [
  {
    type: "text",
    _id: "ori",
    content: { text: "我是智能助理，你的贴心小助手~" },
    user: {
      avatar: "//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg",
    },
  },
];

// 默认快捷短语，可选
const defaultQuickReplies = [
  {
    icon: "message",
    name: "你好",
    isNew: true,
    isHighlight: true,
  },
  {
    name: "药物查询",
    isNew: true,
  },
  {
    name: "和我闲聊",
    isHighlight: true,
  },
];

const Chats: React.FC<InfoProps> = ({
  chatMessage,
  messageLoading,
  history,
  historyLoading,
  dispatch,
  curMessage,
  curChat,
  curUser,
}) => {
  const { messages, appendMsg, setTyping, resetList } = useMessages();
  const [messageApi, contextHolder] = message.useMessage();
  const [waiting, setWaiting] = useState(false);

  const handleSend = (type: any, val: any) => {
    if (curChat === undefined) {
      messageApi.open({
        type: "info",
        content: "请选择对话或新增对话",
        duration: 2,
      });
      return;
    }
    if (messages.length > 0 && messages.slice(-1)[0]._id === "_TYPING_") {
      messageApi.open({
        type: "warning",
        content: "应答中请稍后",
        duration: 2,
      });
      return;
    }
    if (type === "text" && val.trim()) {
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
      });
      dispatch({
        type: "chat/updateMessage",
        payload: {
          question: { body: val },
          userlevel: Number(storeUtil.get("level").value),
        },
      });

      // setTyping(true);
      // setTimeout(() => {
      //   appendMsg({
      //     type: "text",
      //     content: { text: "Bala bala" },
      //   });
      // }, 1000);
    }
  };
  // 使用useEffect监听答案返回
  useEffect(() => {
    if (messageLoading) {
      setTyping(true);
      setWaiting(true);
    }
    if (waiting && !messageLoading) {
      appendMsg({
        type: "text",
        content: { text: curMessage },
      });
      setWaiting(false);
    }
  }, [messageLoading]);

  // 快捷短语回调，可根据 item 数据做出不同的操作，这里以发送文本消息为例
  const handleQuickReplyClick = (item: any) => {
    handleSend("text", item.name);
  };

  const renderMessageContent = (msg: any) => {
    const { content } = msg;
    return <Bubble content={content.text} />;
  };

  useEffect(() => {
    dispatch({
      type: "login/refreshInfo",
    });
  }, []);

  useEffect(() => {
    if (curUser) {
      dispatch({
        type: "chat/fetchHistory",
        payload: { author: curUser.username },
      });
    }
  }, [curUser]);

  useEffect(() => {
    if (chatMessage) {
      resetList(chatMessage);
    }
  }, [chatMessage]);

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={5}>
          <List
            itemLayout="horizontal"
            dataSource={history}
            style={{
              marginLeft: 12,
              height: 600,
              overflowY: "auto",
            }}
            renderItem={(item: any, index) => (
              <List.Item
                actions={[
                  <Button
                    type={item.dialogueId === curChat ? "primary" : "default"}
                    onClick={() =>
                      dispatch({
                        type: "chat/fetchMessage",
                        payload: item.dialogueId,
                      })
                    }
                  >
                    选择
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={robotImg} />}
                  title={
                    <Tooltip title={item.title?.length < 10 ? "" : item.title}>
                      <a
                        onClick={() => {
                          dispatch({
                            type: "chat/fetchMessage",
                            payload: item.dialogueId,
                          });
                        }}
                      >
                        {item.title?.length >= 10
                          ? item.title?.slice(0, 10) + "..."
                          : item.title}
                      </a>
                    </Tooltip>
                  }
                  description={item.updatedAt?.slice(0, 10)}
                />
              </List.Item>
            )}
          />
          <div style={{ textAlign: "center" }}>
            <Button
              type="primary"
              onClick={() =>
                dispatch({
                  type: "chat/createChat",
                  payload: { title: "test", tagList: [] },
                })
              }
            >
              新增对话
            </Button>
          </div>
        </Col>
        <Col span={19} style={{ height: 600 }}>
          <Chat
            navbar={{
              title:
                storeUtil.get("level").value === "1"
                  ? "机器人3.5"
                  : "机器人4.0",
            }}
            messages={messages}
            renderMessageContent={renderMessageContent}
            quickReplies={defaultQuickReplies}
            onQuickReplyClick={handleQuickReplyClick}
            onSend={handleSend}
            toolbar={[
              {
                type: "button",
                title: "new chat",
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = ({
  chat,
  login,
}: {
  chat: ChatType;
  login: LoginType;
}) => {
  return {
    chatMessage: chat.message,
    messageLoading: chat.messageLoading,
    history: chat.history,
    historyLoading: chat.historyLoading,
    curMessage: chat.curMessage,
    curChat: chat.curChat,
    curUser: login.data,
  };
};

export default withAuth(connect(mapStateToProps)(Chats));
