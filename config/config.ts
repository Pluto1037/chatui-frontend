import { defineConfig } from "umi";

export default defineConfig({
  plugins: [
    "@umijs/plugins/dist/antd",
    "@umijs/plugins/dist/dva",
    "@umijs/plugins/dist/request",
  ],
  antd: {},
  dva: {},
  request: { dataField: "data" },
  routes: [
    { path: "/", component: "chats" },
    { path: "/login", component: "login" },
    { path: "/chats", component: "chats", name: "聊天" },
    // { path: "/prochats", component: "prochats", name: "测试聊天" },
    { path: "/user", component: "user", name: "用户" },
    { path: "/manager", component: "manager", name: "管理用户" },
  ],
  npmClient: "yarn",
});
