import { stringify } from "querystring";
import { history, Effect, Reducer } from "umi";
import { accountLogin, getPageQuery } from "@/services/login";

export interface LoginType {
  data?: any;
}

export interface ModelType {
  state: LoginType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<LoginType>;
    save: Reducer<LoginType>;
  };
}

const Model: ModelType = {
  state: {
    data: undefined,
  },

  effects: {
    // 副作用 *的是异步方法
    *login({ payload }, { call, put }): any {
      const response = yield call(accountLogin, payload);
      //console.log("response:", response);

      if (response.status === 200) {
        yield put({
          type: "changeLoginStatus",
          payload: response,
        });
        // 记录用户信息
        yield put({
          type: "save",
          payload: {
            data: response.data.user,
          },
        });

        // 直接跳转至首页
        history.replace("/");

        // 该部分进行了登陆后重定向至原页面，简化为跳转至首页
        // const urlParams = new URL(window.location.href);
        // const params = getPageQuery();
        // let { redirect } = params;
        // let redir = redirect as string;
        // if (redir) {
        //   const redirectUrlParams = new URL(redir);
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redir = redir.substring(urlParams.origin.length);
        //     if (redir.match(/^\/.*#/)) {
        //       redir = redir.substring(redir.indexOf("#") + 1);
        //     }
        //   } else {
        //     window.location.href = "/";
        //     return;
        //   }
        // }
        // redir = redir === "login" || redir === "/user" ? "/" : redir;
        // history.replace(redir || "/");
      }
    },

    logout() {
      localStorage.removeItem("chatend_token");
      // 不是login界面的话跳转到login界面
      if (window.location.pathname !== "/login") {
        history.replace({
          pathname: "/login",
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    // effect获取数据处理方法
    changeLoginStatus(state, { payload }) {
      localStorage.setItem("chatend_token", payload.data.user.token);
      return { ...state };
    },
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
