export const validateId = (id: string) =>
  id.match("^[a-zA-Z0-9]{1,16}$") !== null;
