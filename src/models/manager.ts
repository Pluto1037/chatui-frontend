import { Effect, Reducer } from "umi";
import { fetchAllUser, updateUser } from "@/services/manager";

export interface ManaType {
  users?: any;
}

export interface ModelType {
  state: ManaType;
  effects: {
    fetchUsers: Effect;
    updateUser: Effect;
  };
  reducers: {
    save: Reducer<ManaType>;
  };
}

const Model: ModelType = {
  state: {
    users: [],
  },
  effects: {
    *fetchUsers({ payload }, { call, put }): any {
      const res = yield call(fetchAllUser, payload);
      if (res) {
        yield put({
          type: "save",
          payload: {
            users: res.data.users,
          },
        });
      }
    },
    *updateUser({ payload }, { call, put, select }): any {
      const curUsers = yield select((state: any) => state.manager.users);
      const res = yield call(updateUser, payload);
      if (res) {
        const newUsers = curUsers.map((item: any) => {
          if (item.username === payload.username) {
            item.userlevel = payload.userlevel;
          }
          return item;
        });
        yield put({
          type: "save",
          payload: {
            users: newUsers,
          },
        });
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default Model;
