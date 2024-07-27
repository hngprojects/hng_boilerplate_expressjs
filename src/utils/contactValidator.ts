interface ContactData {
  name: string;
  email: string;
  phoneNumber: string;
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

  const phoneRegex = /^\d{5,15}$/;
  if (!data.phoneNumber || !phoneRegex.test(data.phoneNumber)) {
    errors.push("Please enter a valid phone number.");
  }

  if (!data.message || data.message.length > 250) {
    errors.push(
      "Please enter your message. It should be less than 250 characters.",
    );
  }

  return errors;
}
