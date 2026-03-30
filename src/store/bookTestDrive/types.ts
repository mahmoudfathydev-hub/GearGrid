export interface BookTestDrive {
  id: string;
  created_at: string;
  name: string;
  number: string;
  transmissions: string;
  date: string;
}

export interface BookTestDriveFormData {
  name: string;
  number: string;
  transmissions: string;
  date: string;
}

export interface BookTestDriveState {
  loading: boolean;
  success: boolean;
  error: string | null;
  formData: BookTestDriveFormData;
  data: BookTestDrive[];
}
