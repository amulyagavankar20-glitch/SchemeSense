const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = {
  chat: async (query: string) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  verifyDocument: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/verify`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  scrape: async () => {
    const response = await fetch(`${API_BASE_URL}/scrape`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  process: async () => {
    const response = await fetch(`${API_BASE_URL}/process`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  getSchemes: async () => {
    const response = await fetch(`${API_BASE_URL}/schemes`);
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return response.json();
  },

  getSchemeDetails: async (schemeId: string) => {
    const response = await fetch(`${API_BASE_URL}/schemes/${schemeId}`);
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return response.json();
  },

  getApplications: async () => {
    const response = await fetch(`${API_BASE_URL}/applications`);
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return response.json();
  },

  getApplicationDetails: async (appId: string) => {
    const response = await fetch(`${API_BASE_URL}/applications/${appId}`);
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return response.json();
  },

  submitApplication: async (appData: any) => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appData),
    });
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return response.json();
  },
};
