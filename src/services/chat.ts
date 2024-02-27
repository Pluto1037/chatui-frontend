import axios from "axios";

export async function FetchHistorys(body: any) {
  return axios
    .get(`${BACK_API}/history`, { params: body })
    .then((res) => res.data);
}

export async function FetchMessage(body: any) {
  return axios
    .get(`${BACK_API}/message`, { params: body })
    .then((res) => res.data);
}

export async function CreateChat(body: any) {
  return axios
    .get(`${BACK_API}/api/`, { params: body })
    .then((res) => res.data);
}
