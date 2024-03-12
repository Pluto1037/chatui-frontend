import axios from "axios";
import storeUtil from "@/utils/store";

export async function FetchHistorys(body: any) {
  return axios
    .get(`${BACK_API}/api/dialogues`, { params: body })
    .then((res) => res.data);
}

export async function DeleteHistorys(body: any) {
  return axios
    .post(`${BACK_API}/api/dialogues`, body, {
      headers: {
        Authorization: "Token " + storeUtil.get("token"),
      },
    })
    .then((res) => res.data);
}

export async function FetchMessage(body: any) {
  return axios
    .get(`${BACK_API}/api/dialogues/messages/get/${body}`, {
      headers: {
        Authorization: "Token " + storeUtil.get("token").value,
      },
    })
    .then((res) => res.data);
}

export async function UpdateMessage(body: any) {
  return axios
    .post(
      `${BACK_API}/api/dialogues/messages/add/${body.dialogueId}`,
      body.payload,
      {
        headers: {
          Authorization: "Token " + storeUtil.get("token").value,
        },
      }
    )
    .then((res) => res.data);
}

export async function CreateChat(body: any) {
  return axios
    .post(`${BACK_API}/api/dialogues`, body, {
      headers: {
        Authorization: "Token " + storeUtil.get("token").value,
      },
    })
    .then((res) => res.data);
}
