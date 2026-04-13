interface RequestOptions {
  body?: string;
  headers?: Record<string, string>;
  method?: string;
  credentials?: RequestCredentials;
}

const buildOptions = <T>(data?: T): RequestOptions => {
  const options: RequestOptions = {};

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      "content-type": "application/json",
    };
  }

  return options;
};

const request = async <T, R = unknown>(
  method: string,
  url: string,
  data?: T,
): Promise<R> => {
  const response = await fetch(url, {
    ...buildOptions(data),
    method,
    credentials: "include",
  });

  if (response.status === 204) {
    return {} as R;
  }

  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result as R;
};

export const get = <R = unknown>(url: string) => request<never, R>("GET", url);
export const post = <T, R = unknown>(url: string, data?: T) =>
  request<T, R>("POST", url, data);
export const put = <T, R = unknown>(url: string, data?: T) =>
  request<T, R>("PUT", url, data);
export const remove = <T, R = unknown>(url: string, data?: T) =>
  request<T, R>("DELETE", url, data);
