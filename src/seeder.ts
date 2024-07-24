// // src/seeder.ts
// import AppDataSource from "./data-source";
// import { User, Organization, Product, Profile } from "./models";
// import log from "./utils/logger";

// const seed = async () => {
//   // Create first user
//   const user1 = new User();
//   user1.name = "John Doe";
//   user1.email = "johndooee@example.com";
//   user1.password = "password";
//   user1.otp = Math.floor(Math.random() * 10000); // Generate a random OTP
//   user1.otp_expires_at = new Date(Date.now() + 3600 * 1000); // OTP expires in 1 hour
//   user1.profile = new Profile();
//   user1.profile.first_name = "John";
//   user1.profile.last_name = "Doe";
//   user1.profile.phone = "1234567890";
//   user1.profile.avatarUrl = "http://example.com/avatar.jpg";

//   // Create second user
//   const user2 = new User();
//   user2.name = "Jane Doe";
//   user2.email = "janedooee@example.com";
//   user2.password = "password";
//   user2.otp = Math.floor(Math.random() * 10000); // Generate a random OTP
//   user2.otp_expires_at = new Date(Date.now() + 3600 * 1000); // OTP expires in 1 hour
//   user2.profile = new Profile();
//   user2.profile.first_name = "Jane";
//   user2.profile.last_name = "Doe";
//   user2.profile.phone = "0987654321";
//   user2.profile.avatarUrl = "http://example.com/avatar.jpg";

//   await AppDataSource.manager.save(user1);
//   await AppDataSource.manager.save(user2);

//   // Create products
//   const product1 = new Product();
//   product1.name = "Product 1";
//   product1.description = "Description for product 1";
//   product1.user = user1;
//   product1.price = 3000;
//   product1.category = "k";

//   const product2 = new Product();
//   product2.name = "Product 2";
//   product2.description = "Description for product 2";
//   product2.user = user1;
//   product2.price = 40000;
//   product2.category = "k";

//   const product3 = new Product();
//   product3.name = "Product 3";
//   product3.description = "Description for product 3";
//   product3.user = user2;
//   product3.price = 6000;
//   product3.category = "k";

//   const product4 = new Product();
//   product4.name = "Product 4";
//   product4.description = "Description for product 4";
//   product4.user = user2;
//   product4.price = 3000;
//   product4.category = "k";

//   // Create organizations
//   const organization1 = new Organization();
//   organization1.name = "Org 1";
//   organization1.description = "Description for org 1";
//   organization1.owner_id = user1.id;

//   const organization2 = new Organization();
//   organization2.name = "Org 2";
//   organization2.description = "Description for org 2";
//   organization2.owner_id = user2.id;

//   const organization3 = new Organization();
//   organization3.name = "Org 3";
//   organization3.description = "Description for org 3";
//   organization3.owner_id = user2.id;

//   // Assign organizations to users
//   user1.organizations = [organization1, organization2];
//   user2.organizations = [organization1, organization2, organization3];

//   // Save entities

//   await AppDataSource.manager.save(organization1);
//   await AppDataSource.manager.save(organization2);
//   await AppDataSource.manager.save(organization3);
//   await AppDataSource.manager.save(product1);
//   await AppDataSource.manager.save(product2);
//   await AppDataSource.manager.save(product3);
//   await AppDataSource.manager.save(product4);

//   log.info("Seeding completed successfully.");
// };

// export { seed };
