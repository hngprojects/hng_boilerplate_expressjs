# Email Template Documentation

## Password Reset Template Structure

This email template is designed for password reset notifications.

### Required Variables

- `{{title}}`  
  **Description:** The title of the email.  
  **Type:** String

- `{{logoUrl}}`  
  **Description:** URL of the logo image.  
  **Type:** String

- `{{imageUrl}}`  
  **Description:** URL of the main image displayed in the email.  
  **Type:** String

- `{{userName}}`  
  **Description:** Name of the recipient.  
  **Type:** String

- `{{resetUrl}}`  
  **Description:** URL for the password reset action.  
  **Type:** String

- `{{companyName}}`  
  **Description:** Name of the company sending the email.  
  **Type:** String

- `{{supportUrl}}`  
  **Description:** URL to contact customer support.  
  **Type:** String

- `{{socialIcons}}`  
  **Description:** Array of social media icons with URLs and image sources.  
  **Type:** Array of Objects  
  **Object Properties:**

  - `url` **String:** URL for the social media profile.
  - `imgSrc` **String:** URL of the social media icon image.
  - `alt` **String:** Alt text for the social media icon.

- `{{companyWebsite}}`  
  **Description:** URL of the company's website.  
  **Type:** String

- `{{preferencesUrl}}`  
  **Description:** URL for updating email preferences.  
  **Type:** String

- `{{unsubscribeUrl}}`  
  **Description:** URL for unsubscribing from the email list.  
  **Type:** String

## Successful Password Reset Template Structure

This email template is used for notifying users about a successful password change.

### Required Variables

- `{{title}}`  
  **Description:** The title of the email.  
  **Type:** String

- `{{logoUrl}}`  
  **Description:** URL of the logo image.  
  **Type:** String

- `{{imageUrl}}`  
  **Description:** URL of the main image displayed in the email.  
  **Type:** String

- `{{userName}}`  
  **Description:** Name of the recipient.  
  **Type:** String

- `{{accountRecoverUrl}}`  
  **Description:** URL for recovering the account.  
  **Type:** String

- `{{companyName}}`  
  **Description:** Name of the company sending the email.  
  **Type:** String

- `{{socialIcons}}`  
  **Description:** Array of social media icons with URLs and image sources.  
  **Type:** Array of Objects  
  **Object Properties:**

  - `url` **String:** URL for the social media profile.
  - `imgSrc` **String:** URL of the social media icon image.
  - `alt` **String:** Alt text for the social media icon.

- `{{supportUrl}}`  
  **Description:** URL to contact customer support.  
  **Type:** String

- `{{companyWebsite}}`  
  **Description:** URL of the company's website.  
  **Type:** String

- `{{preferencesUrl}}`  
  **Description:** URL for updating email preferences.  
  **Type:** String

- `{{unsubscribeUrl}}`  
  **Description:** URL for unsubscribing from the email list.  
  **Type:** String

## New Activation Link Sent Template Structure

This email template is used for sending activation links to users.

### Required Variables

- `{{title}}`  
  **Description:** The title of the email.  
  **Type:** String

- `{{logoUrl}}`  
  **Description:** URL of the logo image.  
  **Type:** String

- `{{imageUrl}}`  
  **Description:** URL of the main image displayed in the email.  
  **Type:** String

- `{{userName}}`  
  **Description:** Name of the recipient.  
  **Type:** String

- `{{activationLinkUrl}}`  
  **Description:** URL for activating the user's account.  
  **Type:** String

- `{{companyName}}`  
  **Description:** Name of the company sending the email.  
  **Type:** String

- `{{socialIcons}}`  
  **Description:** Array of social media icons with URLs and image sources.  
  **Type:** Array of Objects  
  **Object Properties:**

  - `url` **String:** URL for the social media profile.
  - `imgSrc` **String:** URL of the social media icon image.
  - `alt` **String:** Alt text for the social media icon.

- `{{supportUrl}}`  
  **Description:** URL to contact customer support.  
  **Type:** String

- `{{companyWebsite}}`  
  **Description:** URL of the company's website.  
  **Type:** String

- `{{preferencesUrl}}`  
  **Description:** URL for updating email preferences.  
  **Type:** String

- `{{unsubscribeUrl}}`  
  **Description:** URL for unsubscribing from the email list.  
  **Type:** String

## Expired Account Email Template Structure

This email template is designed for notifying users when their account activation link has expired and offers them the option to request a new activation link.

### Required Variables

- `{{title}}`  
  **Description:** The title of the email.  
  **Type:** String

- `{{logoUrl}}`  
  **Description:** URL of the logo image.  
  **Type:** String

- `{{imageUrl}}`  
  **Description:** URL of the image displayed in the email.  
  **Type:** String

- `{{userName}}`  
  **Description:** Name of the recipient.  
  **Type:** String

- `{{activationLinkUrl}}`  
  **Description:** URL for requesting a new activation link.  
  **Type:** String

- `{{companyName}}`  
  **Description:** Name of the company sending the email.  
  **Type:** String

- `{{socialIcons}}`  
  **Description:** Array of social media icons with URLs and image sources.  
  **Type:** Array of Objects  
  **Object Properties:**

  - `url` **String:** URL for the social media profile.
  - `imgSrc` **String:** URL of the social media icon image.
  - `alt` **String:** Alt text for the social media icon.

- `{{supportUrl}}`  
  **Description:** URL to contact customer support.  
  **Type:** String

- `{{companyWebsite}}`  
  **Description:** URL of the company's website.  
  **Type:** String

- `{{preferencesUrl}}`  
  **Description:** URL for updating email preferences.  
  **Type:** String

- `{{unsubscribeUrl}}`  
  **Description:** URL for unsubscribing from the email list.  
  **Type:** String

## Account Activation Successful Email Template Structure

This email template is for welcoming a user after their account activation.

### Required Variables

- `{{title}}`  
  **Description:** The title of the email.  
  **Type:** String

- `{{logoUrl}}`  
  **Description:** URL of the logo image.  
  **Type:** String

- `{{imageUrl}}`  
  **Description:** URL of the image displayed in the email.  
  **Type:** String

- `{{userName}}`  
  **Description:** Name of the recipient.  
  **Type:** String

- `{{companyName}}`  
  **Description:** Name of the company sending the email.  
  **Type:** String

- `{{socialIcons}}`  
  **Description:** Array of social media icons with URLs and image sources.  
  **Type:** Array of Objects  
  **Object Properties:**

  - `url` **String:** URL for the social media profile.
  - `imgSrc` **String:** URL of the social media icon image.
  - `alt` **String:** Alt text for the social media icon.

- `{{supportUrl}}`  
  **Description:** URL to contact customer support.  
  **Type:** String

- `{{companyWebsite}}`  
  **Description:** URL of the company's website.  
  **Type:** String

- `{{preferencesUrl}}`  
  **Description:** URL for updating email preferences.  
  **Type:** String

- `{{unsubscribeUrl}}`  
  **Description:** URL for unsubscribing from the email list.  
  **Type:** String

## Account Activation Request Email Template Structure

This HTML email template is designed to notify users about a login attempt from an unfamiliar device.

### Required Variables

- `{{title}}`  
  **Description:** The title of the email.  
  **Type:** String

- `{{logoUrl}}`  
  **Description:** URL of the logo image.  
  **Type:** String

- `{{imageUrl}}`  
  **Description:** URL of the main image displayed in the email.  
  **Type:** String

- `{{userName}}`  
  **Description:** Name of the recipient.  
  **Type:** String

- `{{activationLinkUrl}}`  
  **Description:** URL for activating the user's account.  
  **Type:** String

- `{{companyName}}`  
  **Description:** Name of the company sending the email.  
  **Type:** String

- `{{socialIcons}}`  
  **Description:** Array of social media icons with URLs and image sources.  
  **Type:** Array of Objects  
  **Object Properties:**

  - `url` **String:** URL for the social media profile.
  - `imgSrc` **String:** URL of the social media icon image.
  - `alt` **String:** Alt text for the social media icon.

- `{{supportUrl}}`  
  **Description:** URL to contact customer support.  
  **Type:** String

- `{{companyWebsite}}`  
  **Description:** URL of the company's website.  
  **Type:** String

- `{{preferencesUrl}}`  
  **Description:** URL for updating email preferences.  
  **Type:** String

- `{{unsubscribeUrl}}`  
  **Description:** URL for unsubscribing from the email list.  
  **Type:** String

## Notes

- The `imageUrl` includes an `onerror` handler to hide the image if it fails to load.
