import axios from "axios";
import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import type { Event } from "../@types/Event";
import { FileProps } from "../@types/FileProps";

import useToast from "../Hooks/useToast";
import Layout from "../Components/Layout";

import {
  formatAddress,
  getAllEventPhotosByUsertId,
  getEventByEventId,
  handleFilesChange,
  submitDeletePhoto,
} from "../Utils/event.function";
import { acceptedFormats } from "../Utils/acceptedFormats";

import BackArrowIcon from "../assets/img/back-arrow.svg";

import "../styles/event.scss";
import Modale from "../Components/Modale";
import Button from "../Components/Button";
import WeedingPhoto from "../assets/img/mariage.webp";
import BirthdayPhoto from "../assets/img/anniversaire.webp";
import PartyPhoto from '../assets/img/soiree.webp'

import OtherPhoto from "../assets/img/autres.webp";

const eventTypeImages: Record<string, string> = {
  mariage: WeedingPhoto,
  anniversaire: BirthdayPhoto,
  soiree_etudiante: PartyPhoto,
  autres: OtherPhoto
};

const Event: FC = (): JSX.Element => {
  const { onError, onSuccess } = useToast();
  const { eventId } = useParams();
  const [files, setFiles] = useState<FileProps[] | null>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [photosList, setPhotosList] = useState<PhotoProps[] | null>([]);
  const [isUploadPhotosModalOpen, setIsUploadPhotosModalOpen] = useState(false);
  const [isDeletePhotoModalOpen, setIsDeletePhotoModalOpen] =
    useState<boolean>(false);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const [isDeleteEventModalOpen, setIsDeleteEventModalOpen] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const openModal = (): void => {
    setIsDeletePhotoModalOpen(true);
  };

  const closeModal = (): void => {
    setIsDeletePhotoModalOpen(false);
  };
  const navigate = useNavigate();
  const getEventImage = (event_type: string | undefined): string => {
    return (
      eventTypeImages[
      event_type?.toLowerCase() as keyof typeof eventTypeImages
      ] || eventTypeImages["autres"]
    );
  };

  useEffect(() => {
    try {
      const fetchData = async () => {
        const event = await getEventByEventId(eventId);
        if (event.data.status === 401) {
          onError("Vous n'êtes pas autorisé à accéder à cet événement");
          return;
        }

        setEvent(event.data);
        const photos = await getAllEventPhotosByUsertId(eventId);


        setPhotosList(photos.data);
      };
      fetchData();
    } catch (error) {
      onError("Une erreur est survenue lors de la récupération des données");
      console.log(error);
    }
  }, []);

  const userId = localStorage.getItem("userId");

  const selectFilesToUpload = (files: []) => {
    const response = handleFilesChange(files);
    setFiles(response);
  };

  const handleUpdateImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsUploadPhotosModalOpen(false);
    if (!files) {
      return;
    }
    const formData = new FormData();

    files.forEach((file: any) => {
      formData.append("file", file);
    });
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/event/${eventId}/user/${userId}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status !== 201) {
        onError("Une erreur s'est produite pendant l'envoi des photos");
        return;
      }
      setPhotosList(response.data);
      setFiles(null);
      onSuccess("Photos envoyées avec succès.");
      return;
    } catch (error) {
      onError("Une erreur s'est produite pendant l'envoi des photos");
      console.log(error);
    }
  };

  const deleteImageFromFiles = (index: number | string) => {
    if (typeof index === "string") {
      return;
    }
    if (!files || index < 0 || index >= files.length) {
      console.error("Index invalide ou fichiers non disponibles.");
      return;
    }
    setFiles((prevState) => {
      if (prevState === null) {
        return null;
      }
      return prevState.filter((_, i) => i !== index);
    });
  };

  const handleDeletePhoto = async (photoId: null | string): Promise<void> => {
    const data = await submitDeletePhoto(photoId, eventId);
    if (data.status !== 200) {
      onError("Une erreur s'est produite pendant la suppression de la photo");
    }
    onSuccess("La photo a bien été supprimée.")
    const photos = await getAllEventPhotosByUsertId(eventId);
    setPhotosList(photos.data);

  };

  const handleLeaveEvent = async (eventId: string | null) => {
    if (!eventId) {
      return;
    }
    try {
      //const accessToken = localStorage.getItem("access_token");
      const userId = localStorage.getItem("userId");
      const data = {
        userId,
        eventId,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/event/leave`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 201) {
        onSuccess("Vous avez quitté l'événement avec succès.")
        navigate(`/dashboard/${userId}`);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const handleDeleteEvent = async () => {
    try {
      //const accessToken = localStorage.getItem("access_token");
      const userId = localStorage.getItem("userId");
      if (!(event === null || event === undefined)) {
        const creatorId = event.creator_id.id;
        if (creatorId === userId) {
          const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/event/${eventId}`,
            {
              data: {
                userId,
                eventId,
              },
              headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (response.status === 200) {
            onSuccess("L'événement a bien été supprimé")
            navigate(`/dashboard/${userId}`);
          }
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  type PhotoProps = {
    id: string;
    name: string;
    url: string;
  };
  return (
    <Layout>
      <div className="event__page">
        <div className="event__box">
          <div className="back__arrow">
            <Link to={`/dashboard/${userId}`}>
              <img src={BackArrowIcon} alt="Retour aux événements" />
            </Link>
          </div>
          <h1 className="event__title">Événement {event?.name}</h1>
          <div className="event__informations">
            <div
              className="event__img"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img
                src={getEventImage(event?.event_type)}
                alt={event?.event_type || "autres"}
              /* style={{ width: "250px", height: "130px" }} */
              />
              {event &&
                event.creator_id.id === localStorage.getItem("userId") ? (
                <Button className="btn" onClick={handleDeleteEvent}>
                  Supprimer l'événement
                </Button>
              ) : (
                <Button className="btn" onClick={() => {
                  //@ts-ignore
                  setEventToDelete(event?.id);
                  setIsDeleteEventModalOpen(true);
                }}>
                  Quitter l'événement
                </Button>
              )}
            </div>

            <div className="event__text">
              <div>Code : {event?.access_code}</div>
              <div>Description : {event?.content}</div>
              {event?.started_at ? (
                <div>
                  Date de début :{" "}
                  {new Date(event?.started_at).toLocaleDateString("Fr-fr")}
                </div>
              ) : null}
              {event?.ended_at ? (
                <div>
                  Date de fin :{" "}
                  {new Date(event?.ended_at).toLocaleDateString("Fr-fr")}
                </div>
              ) : null}
              {event?.address ? (
                <div className="event__adress">
                  {" "}
                  Adresse :{" "}
                  <a
                    style={{ textDecoration: "none" }}
                    href={`https://www.openstreetmap.org/search?query=${formatAddress(
                      event.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {event.address}
                  </a>
                </div>
              ) : null}
              <div>Créé par : {event?.creator_id?.name || "Inconnu"}</div>
              <div>
                Status d'upload :{" "}
                <span className={event?.upload_status ? "open" : "closed"}>
                  {event?.upload_status ? "Ouvert" : "Fermé"}
                </span>
              </div>
            </div>
          </div>
          <form className="event__form">
            <label htmlFor="images" className="event__label">
              Ajouter des images
              <input
                type="file"
                id="images"
                multiple
                accept={acceptedFormats.join(",")}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const targetFiles: any = e.target.files;
                  selectFilesToUpload(targetFiles);
                  if (targetFiles?.length > 0) {
                    setIsUploadPhotosModalOpen(true);
                  }
                }}
              />
            </label>
            <Modale
              isOpen={isUploadPhotosModalOpen}
              onClose={() => setIsUploadPhotosModalOpen(false)}
            >
              {files && files?.length > 0 && (
                <button
                  className="event__button"
                  type="button"
                  onClick={(e) => handleUpdateImage(e)}
                >
                  Partager les images
                </button>
              )}
              <div className="event__files-section">
                {files &&
                  files.map((file: any, index) => (
                    <div key={index} className="img-div">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="image"
                      />
                      <div className="middle">
                        <button
                          type="button"
                          className="event__delete-button"
                          onClick={() => deleteImageFromFiles(index)}
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </Modale>
          </form>
          <div className="event__photoslist">
            {photosList &&
              photosList.map((photo: PhotoProps) => (
                <div
                  key={photo.id}
                  className="event__photoslist-photo"
                  id={photo.id}
                >
                  <img
                    src={`${import.meta.env.VITE_URL_PHOTO}/${photo.url}`}
                    alt={
                      "photo" + photo.url.replace("public/uploads/photos/", "")
                    }
                    style={{ width: "300px", height: "300px" }}
                  />
                  <Button
                    className="event__delete-photo"
                    onClick={() => {
                      setPhotoToDelete(photo.id);
                      openModal();
                    }}
                  >
                    &#128465;
                  </Button>
                </div>
              ))}
            {event &&
              event?.photos?.map((photo) => (
                <div key={photo.id} className="event__photoslist-photo">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${photo.url}`}
                    alt={
                      "photo" + photo.url.replace("public/uploads/photos/", "")
                    }
                    style={{ width: "300px", height: "300px" }}
                  />
                </div>
              ))}
          </div>
          <Modale isOpen={isDeletePhotoModalOpen} onClose={closeModal}>
            <p>Êtes-vous sûr de vouloir supprimer cette photo ?</p>
            <Button
              className="btn modale__btn"
              onClick={() => {
                if (photoToDelete) {
                  handleDeletePhoto(photoToDelete);
                }
                closeModal();
              }}
            >
              Oui
            </Button>
            <Button className="btn modale__btn" onClick={closeModal}>
              Non
            </Button>
          </Modale>
          <Modale isOpen={isDeleteEventModalOpen} onClose={() => setIsDeleteEventModalOpen(false)}>
            <p>Êtes-vous sûr de vouloir quitter cet événement ?</p>
            <Button className="btn modale__btn" onClick={() => {
              if (eventToDelete) {
                handleLeaveEvent(eventToDelete);
              }
              setIsDeleteEventModalOpen(false);
            }}
            >
              Oui
            </Button>
            <Button className="btn modale__btn" onClick={() => setIsDeleteEventModalOpen(false)}>
              Non
            </Button>
          </Modale>
        </div>
      </div>
    </Layout>
  );
};

export default Event;
