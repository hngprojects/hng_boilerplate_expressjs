import Handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { body } from "express-validator";

interface EmailVariable {
  title: string;
  userName: string;
  body: string;
}

const emailVariable = (emailVariable: EmailVariable) => {
  const templatePath = path.resolve(
    "src/views/email/templates/custom-email.hbs",
  );

  const data = {
    logoUrl: "https://example.com/logo.png",
    imageUrl: "https://example.com/reset-password.png",
    resetUrl: "https://example.com/reset-password",
    userName: "John Doe",
    activationLinkUrl: "https://example.com/activate-account",
    companyName: "Boilerplate",
    supportUrl: "https://example.com/support",
    socialIcons: [
      {
        url: "https://facebook.com",
        imgSrc:
          "https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-dark-gray/tiktok@2x.png",
        alt: "Facebook",
      },
      {
        url: "https://twitter.com",
        imgSrc:
          "https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-dark-gray/twitter@2x.png",
        alt: "Twitter",
      },
      {
        url: "https://instagram.com",
        imgSrc:
          "https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-dark-gray/instagram@2x.png",
        alt: "Instagram",
      },
    ],
    companyWebsite: "https://example.com",
    preferencesUrl: "https://example.com/preferences",
    unsubscribeUrl: "https://example.com/unsubscribe",
  };

  const newEmailVariable = { ...data, ...emailVariable };

  const templateSource = fs.readFileSync(templatePath, "utf8");
  const template = Handlebars.compile(templateSource);
  const html = template(newEmailVariable);
  return html;
};

export default emailVariable;
