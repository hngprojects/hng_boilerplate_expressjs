import path from "path";
import fs from "fs"
import Handlebars from "handlebars";


const baseTemplateSource = fs.readFileSync(path.join(__dirname, 'templates', 'base_template.hbs'), 'utf8');
Handlebars.registerPartial('base_template', baseTemplateSource);


function renderTemplate(templateName:string, variables:{}) {
  const data = {
    logoUrl: "https://example.com/logo.png",
    imageUrl: "https://example.com/reset-password.png",
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
 const newData = {...data, ...variables}
  const templateSource = fs.readFileSync(path.join(__dirname, 'templates', `${templateName}.hbs`), 'utf8');
  const template = Handlebars.compile(templateSource);
  return template(newData);
}

export default renderTemplate
