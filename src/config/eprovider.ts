export interface EproviderConfig {
  apiUrl: string;
  projectId: string;
  schema: string;
  anonKey: string;
  functionsBaseUrl: string;
}

export const EPROVIDER_CONFIG: EproviderConfig = {
  apiUrl: "https://supa.eprovider.site",
  projectId: "5e712edc-df1d-4783-a1b6-26c8dacf0eec",
  schema: "tenant_5e712edcdf1d4783a1b626c8dacf0eec",
  anonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsInByb2plY3RfaWQiOiI1ZTcxMmVkYy1kZjFkLTQ3ODMtYTFiNi0yNmM4ZGFjZjBlZWMiLCJpYXQiOjE3ODcxMTQyNTUsImV4cCI6MjEwMjY5MDI1NSwiYXVkIjoiZXByb3ZpZGVyLXJlc3QiLCJpc3MiOiJlcHJvdmlkZXItY29udHJvbC1wbGFuZSJ9.sLHSgLeHfBZdO5JtOYNP_pIPOpiAgf4NC0AbfoI66Cs",
  functionsBaseUrl: "https://supa.eprovider.site/functions/v1/5e712edc-df1d-4783-a1b6-26c8dacf0eec",
};

export const AUTH_URLS = {
  signup: `${EPROVIDER_CONFIG.apiUrl}/projects/${EPROVIDER_CONFIG.projectId}/auth/signup`,
  login: `${EPROVIDER_CONFIG.apiUrl}/projects/${EPROVIDER_CONFIG.projectId}/auth/login`,
  refresh: `${EPROVIDER_CONFIG.apiUrl}/projects/${EPROVIDER_CONFIG.projectId}/auth/refresh`,
  logout: `${EPROVIDER_CONFIG.apiUrl}/projects/${EPROVIDER_CONFIG.projectId}/auth/logout`,
  user: `${EPROVIDER_CONFIG.apiUrl}/projects/${EPROVIDER_CONFIG.projectId}/auth/user`,
};

export const REST_URL = `${EPROVIDER_CONFIG.apiUrl}/rest`;