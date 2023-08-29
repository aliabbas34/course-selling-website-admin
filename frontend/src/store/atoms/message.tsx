import {atom} from 'recoil';

export const messageState=atom({
    key:'messageState',
    default:{
        login:false,
        register:false,
        delete:false
    }
});