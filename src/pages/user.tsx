import React from "react";
import styles from "./user.less";
import { connect } from "dva";
import { LoginType } from "@/models/login";
import type { Dispatch } from "umi";
import { Button } from "antd";
import { ProDescriptions } from "@ant-design/pro-components";
import withAuth from "@/hocs/withAuth";

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
    dataIndex: "type",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];

const User: React.FC<LoginProps> = (props) => {
  const { data, dispatch } = props;
  console.log(data);
  return (
    <div>
      <h1>用户信息</h1>
      <ProDescriptions
        // title="Case1信息展示"
        request={async () => {
          return Promise.resolve({
            success: true,
            data: data,
          });
        }}
        column={2}
        columns={userColumns}
      />
      <Button
        onClick={() =>
          dispatch({
            type: "login/logout",
          })
        }
      >
        退出登录
      </Button>
    </div>
  );
};

const mapStateToProps = ({ login }: { login: LoginType }) => {
  return {
    data: login.data,
  };
};

export default withAuth(connect(mapStateToProps)(User));
