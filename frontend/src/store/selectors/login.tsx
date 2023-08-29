import { messageState } from "../atoms/message";
import {selector} from "recoil";

export const loginState = selector({
  key: 'loginState',
  get: ({get}) => {
    const state = get(messageState);

    return state.login;
  },
});