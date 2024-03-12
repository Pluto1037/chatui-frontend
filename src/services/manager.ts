import axios from "axios";
import storeUtil from "@/utils/store";

export async function fetchUserInfo(data: any) {
  return axios
    .get(`${BACK_API}/api/user`, {
      headers: {
        Authorization: "Token " + storeUtil.get("token").value,
      },
    })
    .then(function (response) {
      //console.log(response);
      return response;
    });
}

export async function fetchAllUser(data: any) {
  return axios
    .get(`${BACK_API}/api/getAllUsers`, {
      headers: {
        Authorization: "Token " + storeUtil.get("token").value,
      },
    })
    .then(function (response) {
      return response;
    });
}

export async function updateUser(data: any) {
  return axios
    .post(`${BACK_API}/api/users/manageUser/${data.username}`, {
      user: {
        userlevel: data.userlevel,
      },
    })
    .then(function (response) {
      return response;
    });
}
