import { deleteItem, fetchData, sendData, updateItem } from "@/API/api";

export class ItemRequests<T> {
  endpoint;
  
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  addItemRequest = (data: T) => {
    return sendData<T>(`${this.endpoint}/add`, data);
  };

  editItemRequest = (data: T) => {
    return updateItem<T>(`${this.endpoint}/edit`, data);
  };

  bulkEditItemsRequest = (data: T[]) => {
    return updateItem<T[]>(`${this.endpoint}/edit/bulk`, data);
  };

  deleteItemRequest = (id: any) => {
    return deleteItem<T>(`${this.endpoint}/delete`, id);
  };

  bulkAddItemsRequest = (data: T[]) => {
    return sendData<T[]>(`${this.endpoint}/bulkAdd`, data);
  };

  getItemsRequest = () => {
    console.log("endpoint", `${this.endpoint}/getItems`);
    return fetchData<T[]>(`${this.endpoint}/getItems`);
  };

  getItemsByRequest = <T>(id: string, by: string): Promise<T[]> => {
    return fetchData<T[]>(`${this.endpoint}/${by}/getItems/${id}`);
  };

  getItemRequest = (id: string): Promise<T> => {
    return fetchData<T>(`${this.endpoint}/getItem/${id}`);
  };
}
