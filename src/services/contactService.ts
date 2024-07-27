import AppDataSource from "../data-source";
import { Contact } from "../models/contact-us";

export class ContactService {
  private contactRepository = AppDataSource.getRepository(Contact);

  async createContact(contactData: Partial<Contact>): Promise<Contact> {
    const contact = this.contactRepository.create(contactData);
    return this.contactRepository.save(contact);
  }
}
