// src/seeder.ts
import AppDataSource from "./data-source";
import { User, Organization, Product, Profile } from "./models";
import log from "./utils/logger";

const createUsers = async () => {
  try {
    log.info("Creating user1...");
    const user1 = new User();
    user1.name = "John Doe";
    user1.email = "johndoe@example.com";
    user1.password = "password"; // Use a hashing function in real applications
    user1.otp = Math.floor(Math.random() * 10000);
    user1.otp_expires_at = new Date(Date.now() + 3600 * 1000);
    user1.profile = new Profile();
    user1.profile.first_name = "John";
    user1.profile.last_name = "Doe";
    user1.profile.phone = "1234567890";
    user1.profile.avatarUrl = "http://example.com/avatar.jpg";

    log.info("User1 created: ", user1);

    log.info("Creating user2...");
    const user2 = new User();
    user2.name = "Jane Doe";
    user2.email = "janedoe@example.com";
    user2.password = "password"; // Use a hashing function in real applications
    user2.otp = Math.floor(Math.random() * 10000);
    user2.otp_expires_at = new Date(Date.now() + 3600 * 1000);
    user2.profile = new Profile();
    user2.profile.first_name = "Jane";
    user2.profile.last_name = "Doe";
    user2.profile.phone = "0987654321";
    user2.profile.avatarUrl = "http://example.com/avatar.jpg";

    log.info("User2 created: ", user2);

    log.info("Saving users...");
    await AppDataSource.manager.save([user1, user2]);
    log.info("Users created successfully");
    return [user1, user2];
  } catch (error) {
    log.error("Error creating users: ", error.message);
    log.error(error.stack);
    throw error;
  }
};

const createProducts = async (users: User[]) => {
  try {
    log.info("Creating products...");
    const product1 = new Product();
    product1.name = "Product 1";
    product1.description = "Description for product 1";
    product1.price = 1099;
    product1.category = "Category 1";
    product1.user = users[0];

    const product2 = new Product();
    product2.name = "Product 2";
    product2.description = "Description for product 2";
    product2.price = 1999;
    product2.category = "Category 2";
    product2.user = users[0];

    const product3 = new Product();
    product3.name = "Product 3";
    product3.description = "Description for product 3";
    product3.price = 2999;
    product3.category = "Category 3";
    product3.user = users[1];

    const product4 = new Product();
    product4.name = "Product 4";
    product4.description = "Description for product 4";
    product4.price = 3999;
    product4.category = "Category 4";
    product4.user = users[1];

    log.info("Saving products...");
    await AppDataSource.manager.save([product1, product2, product3, product4]);
    log.info("Products created successfully");
  } catch (error) {
    log.error("Error creating products: ", error.message);
    log.error(error.stack);
    throw error;
  }
};

const createOrganizations = async (users: User[]) => {
  try {
    log.info("Creating organizations...");
    const organization1 = new Organization();
    organization1.name = "Org 1";
    organization1.owner_id = users[0].id; // Set owner_id
    organization1.description = "Description for org 1";

    const organization2 = new Organization();
    organization2.name = "Org 2";
    organization2.owner_id = users[0].id; // Set owner_id
    organization2.description = "Description for org 2";

    const organization3 = new Organization();
    organization3.name = "Org 3";
    organization3.owner_id = users[1].id; // Set owner_id
    organization3.description = "Description for org 3";

    log.info("Saving organizations...");
    await AppDataSource.manager.save([organization1, organization2, organization3]);
    log.info("Organizations created successfully");
    return [organization1, organization2, organization3];
  } catch (error) {
    log.error("Error creating organizations: ", error.message);
    log.error(error.stack);
    throw error;
  }
};

const assignOrganizationsToUsers = async (users: User[], organizations: Organization[]) => {
  try {
    log.info("Assigning organizations to users...");
    users[0].organizations = [organizations[0], organizations[1]];
    users[1].organizations = [organizations[0], organizations[1], organizations[2]];

    log.info("Saving user-organization relationships...");
    await AppDataSource.manager.save(users);
    log.info("Organizations assigned to users successfully");
  } catch (error) {
    log.error("Error assigning organizations to users: ", error.message);
    log.error(error.stack);
    throw error;
  }
};

const seed = async () => {
  try {
    await AppDataSource.initialize();
    await AppDataSource.manager.transaction(async transactionalEntityManager => {
      const users = await createUsers();
      await createProducts(users);
      const organizations = await createOrganizations(users); // Pass users to createOrganizations
      await assignOrganizationsToUsers(users, organizations);
    });
    log.info("Seeding completed successfully.");
  } catch (error) {
    log.error("Seeding failed: ", error.message);
    log.error(error.stack);
  } finally {
    await AppDataSource.destroy();
  }
};

seed();
