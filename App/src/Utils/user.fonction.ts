import axios, { AxiosResponse } from "axios";
import { FormEvent } from "react";

export const handleDeleteUser = async (
  onSuccess: (message: string) => void,
  onError: (message: string) => void,
  navigate: (path: string) => void
): Promise<void> => {
  try {
    const userId = localStorage.getItem("userId");
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/user/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      onSuccess("Compte supprimé avec succès");
      localStorage.clear();
      navigate("/");
    }
  } catch (error) {
    onError("Une erreur c'est produite pendant la suppression de votre compte");
    return;
  }
};

export const submitLogin = async (
  e: FormEvent<HTMLInputElement> | any,
  password: string,
  email: string
) => {
  e.preventDefault();

  //showLoader(); // Affiche le loader avant la requête
  try {
    const response: AxiosResponse<{
      data: {
        id: string;
        username: string;
        access_token: string;
      };
    }> = await axios.post(      
       `${import.meta.env.VITE_API_URL}/auth/login`,
        // `${import.meta.env.VITE_API_URL}/auth/login`,
      {
        password,
        email,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );    
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};
