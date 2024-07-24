import validate from "uuid-validate";

export function validateUUID(id: string): boolean {
  return validate(id);
}
