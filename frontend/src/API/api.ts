import axiosInstance from "./apiConfig";

export async function fetchData<T>(endpoint: string): Promise<T> {
  try {
    const response = await axiosInstance.get<T>(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function sendData<T>(
  endpoint: string,
  data: any,
  headers?: any
): Promise<T> {
  try {
    const response = await axiosInstance.post<T>(endpoint, data, {
      headers: headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteItem(endpoint: string, id: string) {
  try {
    const response = await axiosInstance.post(`/${endpoint}?id=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
