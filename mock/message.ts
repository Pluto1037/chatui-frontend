import { defineMock } from "umi";

type UserInfo = {
  id: string;
  name: string;
  type: string;
};

let user: UserInfo = {
  id: "0",
  name: "user",
  type: "Advanced User",
};

export default defineMock({
  "POST /api/message": (_, res) => {
    // 登录必成功（
    res.send({
      status: "success",
      data: { userInfo: user, token: "chat_token" },
    });
  },
});
