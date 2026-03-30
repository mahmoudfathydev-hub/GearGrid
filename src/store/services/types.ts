export interface Service {
  id: number;
  created_at: string;
  name: string;
  icon: string;
  desc: string;
}

export interface ServiceFormData {
  name: string;
  icon: string;
  desc: string;
}

export interface ServicesState {
  loading: boolean;
  success: boolean;
  error: string | null;
  services: Service[];
  formData: ServiceFormData;
  editingId: number | null;
}
