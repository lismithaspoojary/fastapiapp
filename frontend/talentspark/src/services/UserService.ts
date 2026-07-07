import axios from "axios";
import type { UserResponse } from "../types/user";

const API_URL = "http://localhost:8000/auth";

export const getUsers = async (token: string): Promise<UserResponse[]> => {
  const response = await axios.get<UserResponse[]>(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
