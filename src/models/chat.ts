import { FetchHistorys, FetchMessage, CreateChat } from "@/services/chat";
import { AnyAction, Effect, EffectsCommandMap, Reducer } from "umi";

export interface ChatType {
  message?: any;
  messageLoading?: boolean;
  history?: any;
  historyLoading: boolean;
  curChat?: any; // 记录当前激活的对话历史
}

export interface ModelType {
  state: ChatType;
  effects: {
    createChat: Effect;
    fetchMessage: Effect;
    fetchHistory: Effect;
  };
  reducers: {
    save: Reducer<ChatType>;
  };
}

const Model: ModelType = {
  state: {
    message: undefined,
    messageLoading: false,
    history: undefined,
    historyLoading: false,
    curChat: undefined,
  },
  effects: {
    *fetchMessage({ payload }, { call, put }): any {
      yield put({
        type: "save",
        payload: {
          messageLoading: true,
        },
      });
      const data = yield call(FetchMessage, payload);
      if (data) {
        yield put({
          type: "save",
          payload: {
            message: data.Data.Message,
            messageLoading: false,
          },
        });
      }
    },
    *fetchHistory({ payload }, { call, put }): any {
      yield put({
        type: "save",
        payload: {
          historyLoading: true,
        },
      });
      const data = yield call(FetchHistorys, payload);
      if (data) {
        yield put({
          type: "save",
          payload: {
            history: data.Data.HistoryList,
            historyLoading: false,
          },
        });
      }
    },
    *createChat({ payload }, { call, put }): any {
      const data = yield call(CreateChat, payload);
      if (data) {
        yield put({
          type: "save",
          payload: {
            curChat: data.something,
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
