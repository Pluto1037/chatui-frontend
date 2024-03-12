import React, { useEffect } from "react";
import { type Dispatch } from "umi";
import { connect } from "dva";
import { Space, Table, Tag, Empty } from "antd";
import type { TableProps } from "antd";
import withAuth from "@/hocs/withAuth";
import storeUtil from "@/utils/store";
import { ManaType } from "@/models/manager";

interface InfoProps {
  users?: any;
  dispatch: Dispatch;
}

interface DataType {
  user_id: string;
  key: string;
  username: string;
  email: string;
  lastTime: string;
  quesNum: number;
  userlevel: number;
}

const Manager: React.FC<InfoProps> = ({ users, dispatch }) => {
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "账号",
      dataIndex: "username",
      key: "username",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "最近登录",
      dataIndex: "lastTime",
      key: "lastTime",
    },
    {
      title: "提问次数",
      dataIndex: "quesNum",
      key: "quesNum",
    },
    {
      title: "类型",
      key: "tag",
      dataIndex: "tag",
      render: (_, { userlevel }) => {
        let color = "geekblue";
        let tag = "NORMAL";
        if (userlevel === 2) {
          color = "green";
          tag = "VIP";
        }
        if (userlevel === 3) {
          color = "red";
          tag = "MANAGER";
        }
        return <Tag color={color}>{tag}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_, { userlevel, username }) => (
        <>
          {userlevel === 1 ? (
            <a
              onClick={() =>
                dispatch({
                  type: "manager/updateUser",
                  payload: { username, userlevel: 2 },
                })
              }
            >
              升级
            </a>
          ) : userlevel === 2 ? (
            <a
              style={{ color: "red" }}
              onClick={() =>
                dispatch({
                  type: "manager/updateUser",
                  payload: { username, userlevel: 1 },
                })
              }
            >
              降级
            </a>
          ) : (
            <span>管理员</span>
          )}
        </>
      ),
    },
  ];
  useEffect(() => {
    dispatch({
      type: "manager/fetchUsers",
    });
  }, []);

  return (
    <>
      <div style={{ margin: 25 }}>
        {storeUtil.get("level").value === "3" ? (
          <Table columns={columns} dataSource={users} rowKey={"user_id"} />
        ) : (
          <Empty description={<span>管理界面，暂无权限</span>} />
        )}
      </div>
    </>
  );
};

const mapStateToProps = ({ manager }: { manager: ManaType }) => {
  return { users: manager.users };
};

export default withAuth(connect(mapStateToProps)(Manager));
