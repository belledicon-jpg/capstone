const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export type ApiResponse = {
  ok: boolean;
  message?: string;
  error?: string;
  previewUrl?: string | null;
  user?: {
    email: string;
    name: string;
    avatar?: string | null;
  } | null;
};

async function request<T extends ApiResponse>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(options.headers || {}),
    },
  });

  let data: T;

  try {
    data = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok || data.ok === false) {
    throw new Error(
      data.message ||
        data.error ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

/* =========================================================
   SEND OTP
========================================================= */

export async function apiSendOTP(email: string) {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    throw new Error("Please enter your email address.");
  }

  return request<ApiResponse>("/api/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({
      email: cleanEmail,
    }),
  });
}

/* =========================================================
   VERIFY OTP
========================================================= */

export async function apiVerifyOTP(email: string, code: string) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = code.trim();

  if (!cleanEmail) {
    throw new Error("Email address is required.");
  }

  if (!/^\d{6}$/.test(cleanCode)) {
    throw new Error("Please enter the 6-digit verification code.");
  }

  return request<ApiResponse>("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({
      email: cleanEmail,
      code: cleanCode,
    }),
  });
}

/* =========================================================
   REGISTER
========================================================= */

export async function apiRegister(payload: {
  email: string;
  name: string;
  password: string;
  code: string;
}) {
  return request<ApiResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email.trim().toLowerCase(),
      name: payload.name.trim(),
      password: payload.password,
      code: payload.code.trim(),
    }),
  });
}

/* =========================================================
   LOGIN
========================================================= */

export async function apiLogin(email: string, password: string) {
  return request<ApiResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  });
}

/* =========================================================
   LOGOUT
========================================================= */

export async function apiLogout() {
  return request<ApiResponse>("/api/auth/logout", {
    method: "POST",
  });
}

/* =========================================================
   GET SESSION
========================================================= */

export async function apiGetSession() {
  return request<ApiResponse>("/api/auth/session", {
    method: "GET",
  });
}
