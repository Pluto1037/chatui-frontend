import React, { useState } from "react";
import { type Dispatch } from "umi";
import { connect } from "dva";
import { message, Empty, Button } from "antd";
import Chat, { Bubble, useMessages, Icon } from "@chatui/core";
import "@chatui/core/dist/index.css";
import "../assets/chatIcon";
import withAuth from "@/hocs/withAuth";
import storeUtil from "@/utils/store";

interface InfoProps {
  dispatch: Dispatch;
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

const ProChats: React.FC<InfoProps> = () => {
  const { messages, appendMsg, setTyping, resetList } =
    useMessages(initialMessages);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSend = (type: any, val: any) => {
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

  return (
    <>
      {contextHolder}
      <div style={{ margin: 25, height: 600, marginLeft: 40, marginRight: 40 }}>
        {storeUtil.get("level").value === "1" ? (
          <div style={{ textAlign: "center" }}>
            <Empty description={<span>请升级账户！</span>} />
            <br />
            <Button type="primary">升级账户</Button>
          </div>
        ) : (
          <Chat
            navbar={{ title: "机器人4.0" }}
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
        )}
      </div>
    </>
  );
};

const mapStateToProps = ({}: {}) => {
  return {};
};

export default withAuth(connect(mapStateToProps)(ProChats));
