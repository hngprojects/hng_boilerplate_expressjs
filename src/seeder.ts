// import { AppDataSource } from "./data-source";
// import { UserRole } from "./enums/userRoles";
// import {
//   User,
//   Organization,
//   Product,
//   Profile,
//   OrganisationInvitation,
// } from "./models";
// import log from "./utils/logger";

// const seed = async () => {
//   try {
//     log.info("Starting the seeding process...");
//     // Create users with dummy OTP and other default values
//     const user1 = new User();
//     user1.name = "John Doe";
//     user1.email = "johndoe@example.com";
//     user1.password = "password";
//     user1.otp = 1234; // Dummy OTP value
//     user1.otp_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // Set OTP expiry to 24 hours from now
//     user1.isverified = false;
//     user1.role = UserRole.USER;
//     user1.profile = new Profile();
//     user1.profile.first_name = "John";
//     user1.profile.last_name = "Doe";
//     user1.profile.phone = "1234567890";
//     user1.profile.avatarUrl = "http://example.com/avatar.jpg";

//     const user2 = new User();
//     user2.name = "Jane Doe";
//     user2.email = "janedoe@example.com";
//     user2.password = "password";
//     user2.otp = 5678; // Dummy OTP value
//     user2.otp_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // Set OTP expiry to 24 hours from now
//     user2.isverified = false;
//     user2.role = UserRole.USER;
//     user2.profile = new Profile();
//     user2.profile.first_name = "Jane";
//     user2.profile.last_name = "Doe";
//     user2.profile.phone = "0987654321";
//     user2.profile.avatarUrl = "http://example.com/avatar.jpg";

//     // Create products
//     const product1 = new Product();
//     product1.name = "Product 1";
//     product1.description = "Description for product 1";
//     product1.user = user1;

//     const product2 = new Product();
//     product2.name = "Product 2";
//     product2.description = "Description for product 2";
//     product2.user = user1;

//     const product3 = new Product();
//     product3.name = "Product 3";
//     product3.description = "Description for product 3";
//     product3.user = user2;

//     const product4 = new Product();
//     product4.name = "Product 4";
//     product4.description = "Description for product 4";
//     product4.user = user2;

//     // Create organizations
//     const organization1 = new Organization();
//     organization1.name = "Org 1";
//     organization1.description = "Description for org 1";

//     const organization2 = new Organization();
//     organization2.name = "Org 2";
//     organization2.description = "Description for org 2";

//     const organization3 = new Organization();
//     organization3.name = "Org 3";
//     organization3.description = "Description for org 3";

//     // Save organizations first
//     await AppDataSource.manager.save(organization1);
//     await AppDataSource.manager.save(organization2);
//     await AppDataSource.manager.save(organization3);

//     // Save users
//     await AppDataSource.manager.save(user1);
//     await AppDataSource.manager.save(user2);

//     // Create and save invitations
//     const invitation1 = new OrganisationInvitation();
//     invitation1.invitation_link = `invite-${organization1.id}-${Date.now()}`;
//     invitation1.org_id = organization1.id;
//     invitation1.user_id = user1.id;
//     invitation1.organization = organization1;
//     invitation1.user = user1;

//     const invitation2 = new OrganisationInvitation();
//     invitation2.invitation_link = `invite-${organization2.id}-${Date.now()}`;
//     invitation2.org_id = organization2.id;
//     invitation2.user_id = user1.id;
//     invitation2.organization = organization2;
//     invitation2.user = user1;

//     const invitation3 = new OrganisationInvitation();
//     invitation3.invitation_link = `invite-${organization3.id}-${Date.now()}`;
//     invitation3.org_id = organization3.id;
//     invitation3.user_id = user2.id;
//     invitation3.organization = organization3;
//     invitation3.user = user2;

//     await AppDataSource.manager.save(invitation1);
//     await AppDataSource.manager.save(invitation2);
//     await AppDataSource.manager.save(invitation3);

//     log.info(`Invitation Link 1: ${invitation1.invitation_link}`);
//     log.info(`Invitation Link 2: ${invitation2.invitation_link}`);
//     log.info(`Invitation Link 3: ${invitation3.invitation_link}`);
//     log.info("Seeding completed successfully.");
//   } catch (error) {
//     log.error("Error during seeding:", error);
//   }
// };

// export { seed };
