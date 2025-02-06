import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Layout from "../Components/Layout";
import Card from "../Components/Card";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Modale from "../Components/Modale";
import AutoCompleteInput from "../Components/AutoCompleteInput";

import useToast from "../Hooks/useToast";

import {
  getAllEventsUser,
  handleCreateEventChange,
  handleCreateEventSubmit,
  handleEventCodeChange,
  handleJoinEventSubmit,
} from "../Utils/dashboard.functions";

import { CreateEventFormProps } from "../@types/CreateEventFormProps";
import { EventProps } from "../@types/EventProps";

import "../styles/modale.scss";
import "../styles/button.scss";
import "../styles/input.scss";
import "../styles/dashboard.scss";
import Loading from "../Components/Loading";

const eventImages: { [key: string]: string } = {
  mariage:
    "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?q=80&w=1990&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  anniversaire:
    "https://images.unsplash.com/photo-1583875762487-5f8f7c718d14?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  soiree:
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=1924&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  autres:
    "https://images.unsplash.com/photo-1519214605650-76a613ee3245?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { onError, onSuccess } = useToast();

  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isJoinEventModalOpen, setIsJoinEventModalOpen] = useState(false);
  const [eventCode, setEventCode] = useState<string>("");
  const [eventsList, setEventsList] = useState<EventProps[] | [] | {message: string}>([]);
  const [loading, setLoading] = useState(false)
  const [createEventForm, setCreateEventForm] = useState<CreateEventFormProps>({
    name: "",
    started_at: "",
    ended_at: "",
    address: "",
    content: "",
    type: "autres",
    picture: eventImages["mariage"],
    creator_id: localStorage.getItem("userId"),
  });
("access_token");
  const userId: string | null = localStorage.getItem("userId");

  // Récupération des événements de l'utilisateur
  useEffect(() => {
    // get all user events
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/signin");
    }
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      try {
        const eventsUser = await getAllEventsUser();

        setEventsList(eventsUser);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const submitEvent = async (e: any) => {
    e.preventDefault();
    try {
      const response = await handleCreateEventSubmit(e, createEventForm);


      if (response.createdEvent.status === 201) {
        setIsCreateEventModalOpen(false);
        setCreateEventForm({
          name: "",
          started_at: "",
          ended_at: "",
          address: "",
          content: "",
          type: "autres", // Réinitialise le type
          picture: eventImages["mariage"], // Réinitialise l'image
          creator_id: localStorage.getItem("userId"),
        });        
        const eventsUser = await getAllEventsUser();
        setEventsList(eventsUser);
        onSuccess("Événement créé avec succès.");
      }
    } catch (error) {
      onError("Erreur pendant la création, de l'événement.");
      console.log(error);
    }
  };

  const joinEvent = async (e: any) => {
    try {
      const response = await handleJoinEventSubmit(e, eventCode);
      if (response && response.status === 201) {
        setIsJoinEventModalOpen(false);
        setEventCode("");
        onSuccess(
          `Vous êtes maintenant membre de cet l'événement ${
            response.data[response.data.length - 1].event_id.name
          }`
        );
        const eventsUser = await getAllEventsUser();
        setEventsList(eventsUser);
      }
    } catch (error) {
      onError("Erreur pendant la création, de l'évent");
      console.log(error);
    }
  };
  return (
    <Layout>
      {loading && <Loading />}
      <div className="dashboard">
        <div className="dashboard__buttons">
          <Button
            onClick={() => setIsCreateEventModalOpen(true)}
            className="btn"
          >
            Créer un événement
          </Button>
          <Button onClick={() => setIsJoinEventModalOpen(true)} className="btn">
            Rejoindre un événement
          </Button>
        </div>
        <h1 className="dashboard__title">Voici vos événements </h1>
        <div className="dashboard__container">
          {Array.isArray(eventsList) && eventsList.length > 0 ? (
            eventsList.map((event: EventProps) => (
              <Link
                key={event.event_id.id}
                to={`/event/${event.event_id.id}`}
                onClick={() =>
                  localStorage.setItem("eventName", event.event_id.name)
                }
              >
                <Card
                  dataImage={event.event_id.picture}
                  header={event.event_id.name}
                  content={event.event_id.content}
                />
              </Link>
            ))
          ) : (
            <p style={
            {  
              fontSize: "2rem"
          }
            }>Aucun événement trouvé.</p>
          )}
        </div>

        {/* Modale pour créer un événement */}
        <Modale
          isOpen={isCreateEventModalOpen}
          onClose={() => setIsCreateEventModalOpen(false)}
        >
          <h2 className="modale__title">Créer un événement</h2>
          <form onSubmit={(e) => submitEvent(e)}>
            <Input
              type="text"
              name="name"
              label="Nom de l'événement"
              value={createEventForm.name}
              onChange={(e) =>
                handleCreateEventChange(e, setCreateEventForm, createEventForm)
              }
              required
            />
            <Input
              type="datetime-local"
              name="started_at"
              label="Date et heure de début"
              value={createEventForm.started_at}
              onChange={(e) =>
                handleCreateEventChange(e, setCreateEventForm, createEventForm)
              }
              required
            />
            <Input
              type="datetime-local"
              name="ended_at"
              label="Date et heure de fin"
              value={createEventForm.ended_at}
              onChange={(e) =>
                handleCreateEventChange(e, setCreateEventForm, createEventForm)
              }
              required
            />
            <AutoCompleteInput
              value={createEventForm.address}
              onChange={(value) =>
                setCreateEventForm({ ...createEventForm, address: value })
              }
              label="Lieu de l'événement"
            />
            <Input
              type="select"
              name="type"
              label="Type d'événement"
              value={createEventForm.type}
              onChange={(e) =>
                setCreateEventForm({
                  ...createEventForm,
                  type: e.target.value,
                  picture: eventImages[e.target.value],
                })
              }
              options={[
                { label: "Mariage", value: "mariage" },
                { label: "Anniversaire", value: "anniversaire" },
                { label: "Soirée étudiante", value: "soiree" },
                { label: "Autres", value: "autres" },
              ]}
              required
            />
            <div className="user__box">
              <textarea
                name="content"
                value={createEventForm.content}
                onChange={(e) =>
                  handleCreateEventChange(
                    e,
                    setCreateEventForm,
                    createEventForm
                  )
                }
                required
              ></textarea>
              <label>Description de l'événement</label>
            </div>
            <Button type="submit" className="btn modale__btn">
              Créer
            </Button>
          </form>
        </Modale>

        {/* Modale pour rejoindre un événement */}
        <Modale
          isOpen={isJoinEventModalOpen}
          onClose={() => setIsJoinEventModalOpen(false)}
        >
          <h2 className="modale__title">Rejoindre un événement</h2>
          <form onSubmit={(e: FormEvent) => joinEvent(e)}>
            <Input
              type="text"
              name="eventCode"
              label="Code de l'événement"
              value={eventCode}
              onChange={(e) =>
                //@ts-ignore
                handleEventCodeChange(e, setEventCode)
              }
              required
            />
            <Button type="submit" className="btn modale__btn">
              Rejoindre
            </Button>
          </form>
        </Modale>
      </div>
    </Layout>
  );
};
export default Dashboard;
