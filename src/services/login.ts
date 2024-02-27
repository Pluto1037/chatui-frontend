import axios from "axios";
import { parse } from "querystring";

export const getPageQuery = () => parse(window.location.href.split("?")[1]);

export async function accountLogin(data: any) {
  return axios
    .post(
      `${BACK_API}/api/users/login`,
      { user: { ...data } },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          //Authorization: `Bearer ${localStorage.getItem("chatend_token")}`,
        },
      }
    )
    .then(function (response) {
      //console.log(response);
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}

export async function accountRegister(data: any) {
  return axios
    .post(
      `${BACK_API}/api/users`,
      { user: { ...data } },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    )
    .then(function (response) {
      //console.log(response);
      return response;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
}
