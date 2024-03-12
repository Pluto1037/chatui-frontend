import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Layout, Modal, message } from "antd";
import style from "./login.less";
import { connect } from "dva";
import { LoginType } from "@/models/login";
import { accountRegister } from "@/services/login";
import type { Dispatch } from "umi";
import { useEffect, useState } from "react";

const { Content } = Layout;

interface LoginProps {
  dispatch: Dispatch;
  data?: any;
  isWrong?: boolean;
  wrongMsg?: any;
}

const Login: React.FC<LoginProps> = (props) => {
  const { data, isWrong, wrongMsg, dispatch } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

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
      type: "login/login",
      payload: { ...values },
    });
  };

  useEffect(() => {
    if (isWrong) {
      // messageApi.error(wrongMsg);
      messageApi.error("账户名或密码错误！");
    }
  }, [isWrong]);

  const onRegister = async (values: any) => {
    const res = await accountRegister(values);
    if (res.status === 200) {
      setIsModalOpen(false);
      messageApi.success("注册成功");
      form.resetFields();
    } else {
      messageApi.warning(JSON.stringify(res.response.data.errors));
    }
    console.log("register res:", res);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="注册信息"
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
          onFinish={onRegister}
          autoComplete="off"
        >
          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true, message: "请输入账号！" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码！" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, message: "请输入邮箱！" }]}
          >
            <Input />
          </Form.Item>

          {/* <Form.Item label="兑换码" name="vipCode">
            <Input placeholder="可选填" />
          </Form.Item> */}

          <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div className={style.login_bg}>
        <Content className={style.bodyContent}>
          <div className={style.form_title}>智能问答机器人</div>
          <Form
            className={style.login_form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                size="large"
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Button
              size="large"
              className={style.login_form_button}
              type="primary"
              htmlType="submit"
            >
              登录
            </Button>
            <br />
            <br />
            <Button
              className={style.login_form_button}
              type="link"
              onClick={showModal}
            >
              注册
            </Button>
          </Form>
        </Content>
        <div className={style.footer}>
          <span>Work In Process</span>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ login }: { login: LoginType }) => {
  return {
    data: login.data,
    isWrong: login.isWrong,
    wrongMsg: login.wrongMsg,
  };
};

export default connect(mapStateToProps)(Login);
