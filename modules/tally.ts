import { randomInt } from "crypto";
import { range } from "lodash";

export const validateId = (id: string) =>
  id.match(`^[a-zA-Z0-9]{${minLength},${maxLength}}$`) !== null;

export const getRandomId = () =>
  range(8).reduce((c, _) => (c += randomInt(36).toString(36)), "");

export const minLength = 1;
export const maxLength = 16;
export const validationMessage = `Your Tally ID must be ${minLength}-${maxLength} characters and/or numbers.`;
