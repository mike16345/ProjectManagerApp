import { generateID } from "@/utils/utils";
import { INotification } from "../../../../backend/src/interfaces";

export const createNotification = (
  title: string,
  from: string,
  projectId: string,
  type: string
): INotification => {
  return {
    _id: generateID(),
    title: title,
    projectId: projectId,
    from: from,
    isNew: true,
    date_created: new Date(),
    type: type,
  } as INotification;
};
