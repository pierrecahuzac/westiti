export class CreateEventDto {
  name: string;
  content: string;
  started_at: Date;
  ended_at: Date;
  picture: string;
  creator_id: string;
  address: string;
  type: string;
}

export enum EventType {
  MARIAGE = "MARIAGE",
  ANNIVERSAIRE = "ANNIVERSAIRE",
  SOIREE_ETUDIANTE = "SOIREE_ETUDIANTE",
  AUTRES = "AUTRES"
}
