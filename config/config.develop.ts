import { defineConfig } from "umi";

export default defineConfig({
  define: {
    //BACK_API: "/api", //利用mock进行测试
    BACK_API: "http://115.156.196.83:8080", //利用局域网测试
  },
});
