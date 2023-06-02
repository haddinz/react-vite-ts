import { Users } from "../../types/User";
import APIClient from "../../utils/getAPI";
import { useMutation } from "@tanstack/react-query";

export const useSigninMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) =>
      (await APIClient.post<Users>(`/api/users/signin`, { email, password }))
        .data,
  });


export const useSignupMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) =>
      (await APIClient.post<Users>(`/api/users/register`, {name, email, password }))
        .data,
  });


export const PutSignupMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) =>
      (await APIClient.put<Users>(`/api/users/profile`, {name, email, password }))
        .data,
  });
