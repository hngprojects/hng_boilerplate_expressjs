interface ContactData {
  name: string;
  email: string;
  message: string;
}

export function validateContact(data: ContactData): string[] {
  const errors: string[] = [];

  if (!data.name || data.name.length > 100) {
    errors.push(
      "Please enter your name. It should be less than 100 characters.",
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push("Please enter a valid email address.");
  }

  if (!data.message || data.message.length > 250) {
    errors.push(
      "Please enter your message. It should be less than 250 characters.",
    );
  }

  return errors;
}
