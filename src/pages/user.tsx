import React, { useEffect, useState } from "react";
import styles from "./user.less";
import { connect } from "dva";
import { LoginType } from "@/models/login";
import type { Dispatch } from "umi";
import { Button, Space, Form, Input, Modal, message } from "antd";
import { ProDescriptions } from "@ant-design/pro-components";
import withAuth from "@/hocs/withAuth";
import storeUtil from "@/utils/store";

interface LoginProps {
  dispatch: Dispatch;
  data?: any;
}

const userColumns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "username",
  },
  {
    title: "Type",
    dataIndex: "userlevel",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];

const User: React.FC<LoginProps> = (props) => {
  const { data, dispatch } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({
      type: "login/refreshInfo",
    });
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values: any) => {
    dispatch({
      type: "manager/updateUser",
      payload: { username: data.username, userlevel: 2 },
    });
    storeUtil.set("level", 2, Date.now() + 1000 * 60 * 60 * 5);
    setIsModalOpen(false);
    messageApi.success("升级成功");
  };

  return (
    <div style={{ margin: 20 }}>
      {contextHolder}
      <Modal
        title="兑换码"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="兑换码"
            name="vipCode"
            rules={[{ required: true, message: "请输入兑换码！" }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <h1>用户信息</h1>
      <ProDescriptions
        // title="Case1信息展示"
        dataSource={data}
        column={2}
        columns={userColumns}
      />
      <Space>
        <Button
          type="primary"
          disabled={storeUtil.get("level").value !== "1"}
          onClick={showModal}
        >
          {storeUtil.get("level").value === "1" ? "升级账户" : "已升级"}
        </Button>
        <Button
          onClick={() =>
            dispatch({
              type: "login/logout",
            })
          }
        >
          退出登录
        </Button>
      </Space>
    </div>
  );
};

const mapStateToProps = ({ login }: { login: LoginType }) => {
  return {
    data: login.data,
  };
};

export default withAuth(connect(mapStateToProps)(User));
