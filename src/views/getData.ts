import fs from 'fs';
import path from 'path';

const currentPath = process.cwd();
const templatePath =  path.join(currentPath,'src', 'templates', 'getData.html');
let emailTemplate = fs.readFileSync(templatePath, 'utf-8');


const replacePlaceholders = (template:any, replacements:any) => {
    return template.replace(/{{(name|date_generated|csv_download_link)}}/g, (match, key) => {
        return replacements[key];
    });
};
const emailData = {
    name: 'John Doe',
    date_generated: new Date().toLocaleDateString(),
    csv_download_link: 'https://example.com/download/profile.csv'
};

export const htmlContent = replacePlaceholders(emailTemplate, emailData);
