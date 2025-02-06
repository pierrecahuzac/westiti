export class PhotoDto {
  eventId: string;
  userId: string;
  url: string;
  uploaded_at: string;
  status: boolean;
}

export class UploadFileDto {
  files: File[];
}

interface File {
  path: string;
}
