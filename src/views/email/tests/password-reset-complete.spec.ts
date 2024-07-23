import { describe, expect, it, test } from '@jest/globals';
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import path from 'path';

// Load the template
const templateSource = fs.readFileSync(path.resolve('src/views/email/templates/password-reset-complete.hbs'), 'utf8');
const template = Handlebars.compile(templateSource);

// Sample data to pass to the template
const data = {
    title: 'Password Reset Complete',
    logoUrl: 'https://example.com/logo.png',
    imageUrl: 'https://example.com/reset-password-complete.png',
    userName: 'John Doe',
    resetUrl: 'https://example.com/reset-password',
    accountRecoverUrl: 'https://example.com/forgot',
    supportUrl: 'https://example.com/support',
    socialIcons: [
        { url: 'https://facebook.com', imgSrc: 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-dark-gray/tiktok@2x.png', alt: 'Facebook' },
        { url: 'https://twitter.com', imgSrc: 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-dark-gray/twitter@2x.png', alt: 'Twitter' },
        { url: 'https://instagram.com', imgSrc: 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-dark-gray/instagram@2x.png', alt: 'Instagram' }
    ],
    companyWebsite: 'https://example.com',
    preferencesUrl: 'https://example.com/preferences',
    unsubscribeUrl: 'https://example.com/unsubscribe'
};

describe('Email Template', () => {
    it('should render correctly with provided data', () => {
        const result = template(data);

        // Check for the presence of critical elements
        expect(result).toContain(data.title);
        expect(result).toContain(data.logoUrl);
        expect(result).toContain(data.imageUrl);
        expect(result).toContain(`Hi ${data.userName}`);
        expect(result).toContain(data.resetUrl);
        expect(result).toContain(data.accountRecoverUrl);
        expect(result).toContain(data.supportUrl);
        data.socialIcons.forEach(icon => {
            expect(result).toContain(icon.url);
            expect(result).toContain(icon.imgSrc);
            expect(result).toContain(icon.alt);
        });
        expect(result).toContain(data.companyWebsite);
        expect(result).toContain(data.preferencesUrl);
        expect(result).toContain(data.unsubscribeUrl);
    });
});
