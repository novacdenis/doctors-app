import type { Conversation, ConversationPreview, UserCard } from "../types";

import axiosInstance from "@/lib/axios";

export const apiGetConversationsWithPatients = async () => {
  return await axiosInstance.get<ConversationPreview[]>("/chat/list").then((res) => res.data);
};

export const apiGetConversationsWithDoctors = async () => {};

export const apiGetConversation = async (id: string) => {
  return await axiosInstance.get<Conversation>(`/chat/get/${id}`).then((res) => res.data);
};

export const apiGetUserCard = async (id: number, anonymous: boolean) => {
  return await axiosInstance
    .get<UserCard>(`/user/card/${id}?is_anonym=${anonymous}`)
    .then((res) => res.data);
};

export const apiAcceptConversation = async (id: string) => {
  return await axiosInstance.post("/chat/accept", {
    chat_id: id,
  });
};

export const apiRejectConversation = async (id: string, message: string) => {
  return await axiosInstance.post("/chat/refuse", {
    chat_id: id,
    message,
  });
};

export const apiSendMessage = async (data: { chat_id: number; content: string }) => {
  return await axiosInstance.post("/chat/send", {
    ...data,
    type: "standard",
  });
};

export const apiSendFile = async (data: { chat_id: number; file: File }) => {
  const formData = new FormData();

  formData.append("uploads[]", data.file);
  formData.append("chat_id", data.chat_id.toString());

  return await axiosInstance.post("/chat/upload", formData);
};

export const apiRequestFile = async (data: { chat_id: number; content: string }) => {
  return await axiosInstance.post(`/chat/request-media/${data.chat_id}`, { content: data.content });
};
