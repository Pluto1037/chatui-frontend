import { stringify } from "querystring";
import { history, Effect, Reducer } from "umi";
import { accountLogin, getPageQuery } from "@/services/login";
import { fetchUserInfo } from "@/services/manager";
import storeUtil from "@/utils/store";

export interface LoginType {
  data?: any;
  isWrong?: boolean;
  wrongMsg?: any;
}

export interface ModelType {
  state: LoginType;
  effects: {
    login: Effect;
    logout: Effect;
    refreshInfo: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<LoginType>;
    save: Reducer<LoginType>;
  };
}

const Model: ModelType = {
  state: {
    data: undefined,
    isWrong: false,
    wrongMsg: undefined,
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
            isWrong: false,
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
      } else {
        yield put({
          type: "save",
          payload: {
            isWrong: true,
            wrongMsg: response.response.data,
          },
        });
      }
    },
    *refreshInfo({ payload }, { call, put }): any {
      const response = yield call(fetchUserInfo, payload);
      console.log(response);

      if (response.status === 200) {
        // 更新用户信息
        yield put({
          type: "save",
          payload: {
            data: response.data.user,
            isWrong: false,
          },
        });
      }
    },

    logout() {
      storeUtil.remove("token");
      storeUtil.remove("level");
      //localStorage.removeItem("token");
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
      //localStorage.setItem("token", payload.data.user.token);
      storeUtil.set(
        "token",
        payload.data.user.token,
        Date.now() + 1000 * 60 * 60 * 5
      );
      // 利用localstorage记录用户等级，和token同样过期时间
      storeUtil.set(
        "level",
        payload.data.user.userlevel,
        Date.now() + 1000 * 60 * 60 * 5
      );
      return { ...state };
    },
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
