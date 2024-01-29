import { deleteItem, fetchData, sendData } from "@/API/api";

export const addItemRequest = (endpoint: string, row: any) => {
  return sendData(`${endpoint}/addItem`, row);
};

export const editItemRequest = (endpoint: string, row: any) => {
  return sendData(`${endpoint}/editItem`, row);
};

export const deleteItemRequest = (endpoint: string, id: any) => {
  return deleteItem(`${endpoint}/deleteItem`, id);
};

export const bulkAddItemsRequest = (endpoint: string, rows: any[]) => {
  return sendData(`${endpoint}/bulkAddItem`, rows);
};

export const getItemsRequest = (endpoint: string) => {
  return fetchData(`${endpoint}/getItems`);
};
