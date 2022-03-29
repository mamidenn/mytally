import { randomInt } from "crypto";
import { range } from "lodash";

export const validateId = (id: string) =>
  id.match("^[a-zA-Z0-9]{1,16}$") !== null;

export const getRandomId = () =>
  range(8).reduce((c, _) => (c += randomInt(36).toString(36)), "");
