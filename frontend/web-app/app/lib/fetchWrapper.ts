import { getUserToken } from "@/app/actions/authActions";

const baseUrl = process.env.API_URL;

const get = async (url: string) => {
  const requestOptions = {
    method: "GET",
    headers: await getHeaders(),
  };

  const response = await fetch(baseUrl + url, requestOptions);
  return handleResponse(response);
};

const post = async (url: string, body: any) => {
  const requestOptions = {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(body),
  };

  const response = await fetch(baseUrl + url, requestOptions);
  return handleResponse(response);
};

const put = async (url: string, body: any) => {
  const requestOptions = {
    method: "PUT",
    headers: await getHeaders(),
    body: JSON.stringify(body),
  };

  const response = await fetch(baseUrl + url, requestOptions);
  return handleResponse(response);
};

const deleteMethod = async (url: string) => {
  const requestOptions = {
    method: "DELETE",
    headers: await getHeaders(),
  };

  const response = await fetch(baseUrl + url, requestOptions);
  return handleResponse(response);
};

const getHeaders = async () => {
  const token = await getUserToken();

  const headers = { "Content-Type": "application/json" } as any;
  if (token) {
    headers.Authorization = `Bearer ${token.access_token}`;
  }

  return headers;
};

const handleResponse = async (response: Response) => {
  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch (e) {
    data = text;
  }

  if (response.ok) {
    return data || response.statusText;
  } else {
    const error = {
      status: response.status,
      message: typeof data === "string" ? data : response.statusText,
    };

    return { error };
  }
};

export const fetchWrapper = {
  delete: deleteMethod,
  get,
  post,
  put,
};
