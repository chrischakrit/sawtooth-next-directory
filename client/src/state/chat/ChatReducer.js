/* Copyright 2018 Contributors to Hyperledger Sawtooth

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
----------------------------------------------------------------------------- */


import { createReducer } from 'reduxsauce';
import { INITIAL_STATE, ChatTypes as Types } from './ChatActions';
import ping from 'sounds/ping.mp3';


export const failure = (state, { error }) => {
  return state.merge({ fetching: false, error });
};


export const clearMessages = (state) => {
  return state.merge({ messages: null });
};


export const conversationSuccess = (state, { conversation }) => {
  return state.merge({
    fetching: false,
    messages: conversation.messages,
  });
};


export const messageSend = (state, { payload }) => {
  if (payload.message && payload.message.text.startsWith('/'))
    return state.merge({ fetching: true });
  return state.merge({
    fetching: true,
    messages: payload.do !== 'CREATE' ?
      [payload.message, ...(state.messages || [])] :
      state.messages,
  });
};


export const messageReceive = (state, { payload }) => {
  if (state.messages && state.messages.length > 0) {
    const sound = new Audio(ping);
    sound.play().catch();
  }
  return state.merge({
    fetching: false,
    messages: payload.length > 0 ?
      [...payload.reverse(), ...(state.messages || [])] :
      state.messages,
  });
};


export const ChatReducer = createReducer(INITIAL_STATE, {
  [Types.CLEAR_MESSAGES]:  clearMessages,
  [Types.MESSAGE_SEND]:    messageSend,
  [Types.MESSAGE_RECEIVE]: messageReceive,

  // [Types.CONVERSATION_REQUEST]: request,
  // [Types.CONVERSATION_SUCCESS]: conversationSuccess,
  // [Types.CONVERSATION_FAILURE]: failure,
});