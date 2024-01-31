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
export async function updateItem<T>(
  endpoint: string,
  data: any,
  headers?: any
): Promise<T> {
  try {
    const response = await axiosInstance.put<T>(endpoint, data, {
      headers: headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteItem<T>(endpoint: string, id: string): Promise<T> {
  try {
    console.log(`Endpoint: ${endpoint}?id=${id}`);
    const response = await axiosInstance.delete(`${endpoint}?id=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
