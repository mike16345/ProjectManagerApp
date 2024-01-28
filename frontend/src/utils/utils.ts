import batman from "@/assets/avatars/batman.jpg";
import spidermanOne from "@/assets/avatars/spiderman-ffh.jpg";
import spidermanTwo from "@/assets/avatars/spiderman-figurine.jpg";
import superman from "@/assets/avatars/superman.jpg";
import marioCat from "@/assets/avatars/mario-cat.jpg";
import mario from "@/assets/avatars/mario.png";
import luigi from "@/assets/avatars/luigi.png";
import peach from "@/assets/avatars/peach.png";
import yoshi from "@/assets/avatars/yoshi.png";
import venomSpidey from "@/assets/avatars/venom-spiderman.jpg";

const images = {
  batman: batman,
  "spiderman-ffh": spidermanOne,
  "spiderman-figurine": spidermanTwo,
  superman: superman,
  "mario-cat": marioCat,
  mario: mario,
  luigi: luigi,
  peach: peach,
  yoshi: yoshi,
  "venom-spiderman": venomSpidey,
};

export const getImageNames = () => {
  return Object.keys(images);
};

export const getImage = (name: string) => {
  return images[name];
};
export const enumToArray = (enumClass: object) => {
  return Object.values(enumClass);
};
