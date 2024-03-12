import {
  FetchHistorys,
  FetchMessage,
  CreateChat,
  UpdateMessage,
} from "@/services/prochat";
import { AnyAction, Effect, EffectsCommandMap, Reducer } from "umi";

export interface ChatType {
  message?: any;
  messageLoading?: boolean;
  history?: any;
  historyLoading: boolean;
  curChat?: any; // 记录当前激活的对话历史
  curMessage?: any; // 记录当前返回的答案
}

export interface ModelType {
  state: ChatType;
  effects: {
    createChat: Effect;
    fetchMessage: Effect;
    updateMessage: Effect;
    fetchHistory: Effect;
    deleteHistory: Effect;
  };
  reducers: {
    save: Reducer<ChatType>;
  };
}

// 静态标识机器人ID
const robot_id = "c87c4d5a-d54d-11ee-98a2-776df9507700";

const Model: ModelType = {
  state: {
    message: [],
    messageLoading: false,
    history: [],
    historyLoading: false,
    curChat: undefined,
  },
  effects: {
    *fetchMessage({ payload }, { call, put }): any {
      const data = yield call(FetchMessage, payload);
      if (data) {
        const message = data.messages.map((item: any) => {
          item._id = item.id;
          item.position = item.userId === robot_id ? "left" : "right";
          item.type = "text";
          item.content = { text: item.body };
          return item;
        });
        yield put({
          type: "save",
          payload: {
            message: message,
            curChat: payload,
          },
        });
      }
    },
    *updateMessage({ payload }, { call, put, select }): any {
      yield put({
        type: "save",
        payload: {
          messageLoading: true,
        },
      });
      const dialogueId = yield select((state: any) => state.chat.curChat);
      const data = yield call(UpdateMessage, { dialogueId, payload });
      if (data) {
        yield put({
          type: "save",
          payload: {
            curMessage: data.answer.body,
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
            history: data.dialogues,
            historyLoading: false,
          },
        });
        yield put({
          type: "fetchMessage",
          payload: data.dialogues[0]?.dialogueId,
        });
      }
    },
    *deleteHistory({ payload }, { call, put }): any {
      console.log("delete", payload);

      // const data = yield call(FetchHistorys, payload);
      // if (data) {
      //   yield put({
      //     type: "save",
      //     payload: {
      //       history: data.dialogues,
      //       historyLoading: false,
      //     },
      //   });
      // }
    },

    *createChat({ payload }, { call, put }): any {
      const data = yield call(CreateChat, { dialogue: { ...payload } });
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
