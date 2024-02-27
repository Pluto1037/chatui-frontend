import React, { useState } from "react";
import { type Dispatch } from "umi";
import { connect } from "dva";
import Chat, { Bubble, useMessages, Icon } from "@chatui/core";
import { Avatar, List, Col, Row, Button } from "antd";
import withAuth from "@/hocs/withAuth";
import "@chatui/core/dist/index.css";
import "../assets/chatIcon";
import robotImg from "../assets/robot.jpg";
import { ChatType } from "@/models/chat";
import styles from "./chats.less";

interface InfoProps {
  dispatch: Dispatch;
  message?: any;
  messageLoading?: boolean;
  history?: any;
  historyLoading?: boolean;
}

const data = [
  {
    title: "History 1",
  },
  {
    title: "History 2",
  },
  {
    title: "History 3",
  },
  {
    title: "History 4",
  },
];

const initialMessages = [
  {
    type: "text",
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
    name: "服务1",
    isNew: true,
    isHighlight: true,
  },
  {
    name: "短语1",
    isNew: true,
  },
  {
    name: "短语2",
    isHighlight: true,
  },
  {
    name: "短语3",
  },
];

const Chats: React.FC<InfoProps> = ({
  message,
  messageLoading,
  history,
  historyLoading,
}) => {
  const { messages, appendMsg, setTyping, resetList } =
    useMessages(initialMessages);

  const handleSend = (type: any, val: any) => {
    if (type === "text" && val.trim()) {
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
      });

      setTyping(true);

      setTimeout(() => {
        appendMsg({
          type: "text",
          content: { text: "Bala bala" },
        });
      }, 1000);
    }
  };

  // 快捷短语回调，可根据 item 数据做出不同的操作，这里以发送文本消息为例
  const handleQuickReplyClick = (item: any) => {
    handleSend("text", item.name);
  };

  const renderMessageContent = (msg: any) => {
    const { content } = msg;
    return <Bubble content={content.text} />;
  };

  // console.log(messages);

  return (
    <>
      <Row>
        <Col span={4}>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={robotImg} />}
                  title={
                    <a onClick={() => resetList(initialMessages)}>
                      {item.title}
                    </a>
                  }
                  description="here is history"
                />
              </List.Item>
            )}
          />
          <div style={{ textAlign: "center" }}>
            <Button type="primary">新增对话</Button>
          </div>
        </Col>
        <Col span={20} style={{ height: 600 }}>
          <Chat
            navbar={{ title: "机器人1号" }}
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

const mapStateToProps = ({ chat }: { chat: ChatType }) => {
  return {
    message: chat.message,
    messageLoading: chat.messageLoading,
    history: chat.history,
    historyLoading: chat.historyLoading,
  };
};

export default withAuth(connect(mapStateToProps)(Chats));
