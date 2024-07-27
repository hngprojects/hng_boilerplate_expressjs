// import { validateContact } from '../utils/contactValidator';

// describe('validateContact', () => {
//   it('should return no errors for valid contact data', () => {
//     const validData = {
//       name: 'Korede Akorede',
//       email: 'ibraim@gmail.com',
//       phoneNumber: '1234567890',
//       message: 'I am a backend dev',
//     };

//     const errors = validateContact(validData);
//     expect(errors).toEqual([]);
//   });

//   it('should return error for missing name', () => {
//     const invalidData = {
//       name: '',
//       email: 'ibraim@gmail.com',
//       phoneNumber: '1234567890',
//       message: 'I am a backend dev',
//     };

//     const errors = validateContact(invalidData);
//     expect(errors).toContain(
//       'Please enter your name. It should be less than 100 characters.'
//     );
//   });

//   it('should return error for invalid email format', () => {
//     const invalidData = {
//       name: 'Korede Akorede',
//       email: 'invalid-email',
//       phoneNumber: '1234567890',
//       message: 'I am a backend dev',
//     };

//     const errors = validateContact(invalidData);
//     expect(errors).toContain('Please enter a valid email address.');
//   });

//   it('should return error for invalid phone number format', () => {
//     const invalidData = {
//       name: 'Korede Akorede',
//       email: 'ibraim@gmail.com',
//       phoneNumber: '123',
//       message: 'I am a backend dev',
//     };

//     const errors = validateContact(invalidData);
//     expect(errors).toContain(
//       'Please enter a valid phone number. It should be a number with 10 to 15 digits.'
//     );
//   });

//   it('should return error for message length exceeding 250 characters', () => {
//     const invalidData = {
//       name: 'Korede Akorede',
//       email: 'ibraim@gmail.com',
//       phoneNumber: '1234567890',
//       message: 'a'.repeat(251), // Message length exceeds 250 characters
//     };

//     const errors = validateContact(invalidData);
//     expect(errors).toContain(
//       'Please enter your message. It should be less than 250 characters.'
//     );
//   });

//   it('should return error for phone number with non-numeric characters', () => {
//     const invalidData = {
//       name: 'Korede Akorede',
//       email: 'ibraim@gmail.com',
//       phoneNumber: '123-456-7890',
//       message: 'I am a backend dev',
//     };

//     const errors = validateContact(invalidData);
//     expect(errors).toContain(
//       'Please enter a valid phone number. It should be a number with 10 to 15 digits.'
//     );
//   });
// });

import { validateContact } from "../utils/contactValidator";

describe("validateContact", () => {
  it("should return no errors for valid contact data", () => {
    const validData = {
      name: "Korede Akorede",
      email: "ibraim@gmail.com",
      phoneNumber: "1234567890", // Valid phone number (10 digits)
      message: "I am a backend dev",
    };

    const errors = validateContact(validData);
    expect(errors).toEqual([]);
  });

  it("should return error for missing name", () => {
    const invalidData = {
      name: "",
      email: "ibraim@gmail.com",
      phoneNumber: "1234567890",
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
      phoneNumber: "1234567890",
      message: "I am a backend dev",
    };

    const errors = validateContact(invalidData);
    expect(errors).toContain("Please enter a valid email address.");
  });

  it("should return error for phone number shorter than 5 digits", () => {
    const invalidData = {
      name: "Korede Akorede",
      email: "ibraim@gmail.com",
      phoneNumber: "1234", // Invalid phone number (4 digits)
      message: "I am a backend dev",
    };

    const errors = validateContact(invalidData);
    expect(errors).toContain("Please enter a valid phone number.");
  });

  it("should return error for phone number longer than 15 digits", () => {
    const invalidData = {
      name: "Korede Akorede",
      email: "ibraim@gmail.com",
      phoneNumber: "1234567890123456", // Invalid phone number (16 digits)
      message: "I am a backend dev",
    };

    const errors = validateContact(invalidData);
    expect(errors).toContain("Please enter a valid phone number.");
  });

  it("should return error for non-numeric phone number", () => {
    const invalidData = {
      name: "Korede Akorede",
      email: "ibraim@gmail.com",
      phoneNumber: "123-456-7890", // Invalid phone number (contains dashes)
      message: "I am a backend dev",
    };

    const errors = validateContact(invalidData);
    expect(errors).toContain("Please enter a valid phone number.");
  });

  it("should return error for message length exceeding 250 characters", () => {
    const invalidData = {
      name: "Korede Akorede",
      email: "ibraim@gmail.com",
      phoneNumber: "1234567890",
      message: "a".repeat(251), // Message length exceeds 250 characters
    };

    const errors = validateContact(invalidData);
    expect(errors).toContain(
      "Please enter your message. It should be less than 250 characters.",
    );
  });
});
