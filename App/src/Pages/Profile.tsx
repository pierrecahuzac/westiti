import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useToast from "../Hooks/useToast";

import Layout from "../Components/Layout";
import Button from "../Components/Button";
import Modale from "../Components/Modale"; // Import de votre composant Modale

import axios from "axios";

import "../styles/modale.scss";

import "../styles/profile.scss";

// axios send credentials (cookie)
axios.defaults.withCredentials = true;

const Profile: FC = () => {
  // axios send credentials (cookie)
axios.defaults.withCredentials = true;
  type UserProps = {
    id: null | string;
    name: null | string;
    email: null | string;
    avatar: undefined | string;
  };

  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [user, setUser] = useState<UserProps>({
    id: null,
    name: null,
    email: null,
    avatar: undefined,
  });

  const { onError, onSuccess } = useToast();

  useEffect(() => {
    const isConnected = localStorage.getItem("isConnected");
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    setUser({
      ...user,
      id: userId,
      name: name,
      email: email,
      avatar:
        "https://t3.ftcdn.net/jpg/01/26/91/78/360_F_126917812_XlWgkaV9f81Hde4wvmvJWM3huJRvy5EM.webp",
    });
    if (isConnected === "false") {
      navigate("/");
    }
  }, []);

  const openModal = (): void => {
    setModalIsOpen(true);
  };

  const closeModal = (): void => {
    setModalIsOpen(false);
  };

  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/user/${localStorage.getItem(
          "userId"
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status === 200) {
        onSuccess("Compte supprimé avec succès");
        localStorage.clear();
        navigate("/");
      }
      return response;
    } catch (error) {
      onError(
        "Une erreur s'est produite pendant la suppression de votre compte"
      );
    }
  };

  return (
    <Layout>
      <div className="profile">
        <div className="profile__box">
          <div className="profile__image">
            <img src={user.avatar} alt="user avatar" />
          </div>
          <div className="profile__info">
            <h2 className="profile__name">{user?.name}</h2>
            <p className="profile__email">{user?.email}</p>
          </div>
          <Button
            type="button"
            className="btn profile__delete-button"
            onClick={openModal}
          >
            Supprimer mon compte
          </Button>
        </div>

        <Modale isOpen={modalIsOpen} onClose={closeModal}>
          <p>Êtes-vous sûr de vouloir supprimer votre compte ?</p>
          <Button className="btn modale__btn" onClick={handleDeleteUser}>
            Oui
          </Button>
          <Button className="btn modale__btn" onClick={closeModal}>
            Non
          </Button>
        </Modale>
      </div>
      {/*    {modalIsOpen && ( */}
      {/* @ts-ignore */}
      <Modale className="modale__overlay" modalIsOpen={modalIsOpen}>
        <div className="modale__box">
          <Button
            className="btn"
            onClick={async () => {
              await handleDeleteUser();
          
            }}
          >
            Oui
          </Button>
          <Button className="btn" onClick={() => setModalIsOpen(false)}>
            Non
          </Button>
        </div>
      </Modale>
      {/*   )}  */}
    </Layout>
  );
};

export default Profile;
