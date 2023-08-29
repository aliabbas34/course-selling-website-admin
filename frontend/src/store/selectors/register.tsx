import { messageState } from "../atoms/message";
import {selector} from "recoil";

export const registerState = selector({
  key: 'registerState',
  get: ({get}) => {
    const state = get(messageState);

    return state.register;
  },
});