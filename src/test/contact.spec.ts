import { validateContact } from "../utils/contactValidator";

describe("validateContact", () => {
  it("should return no errors for valid contact data", () => {
    const validData = {
      name: "Korede Akorede",
      email: "ibraim@gmail.com",
      message: "I am a backend dev",
    };

    const errors = validateContact(validData);
    expect(errors).toEqual([]);
  });

  it("should return error for missing name", () => {
    const invalidData = {
      name: "",
      email: "ibraim@gmail.com",
      message: "I am a backend dev",
    };

    const errors = validateContact(invalidData);
    expect(errors).toContain(
      "Please enter your name. It should be less than 100 characters.",
    );
  });

  it("should return error for invalid email format", () => {
    const invalidData = {
      name: "Korede Akorede",
      email: "invalid-email",
      message: "I am a backend dev",
    };

    const errors = validateContact(invalidData);
    expect(errors).toContain("Please enter a valid email address.");
  });

  it("should return error for message length exceeding 250 characters", () => {
    const invalidData = {
      name: "Korede Akorede",
      email: "ibraim@gmail.com",
      message: "a".repeat(251), // Message length exceeds 250 characters
    };

    const errors = validateContact(invalidData);
    expect(errors).toContain(
      "Please enter your message. It should be less than 250 characters.",
    );
  });
});
