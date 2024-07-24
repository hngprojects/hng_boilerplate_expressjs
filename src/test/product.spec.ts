// import request from 'supertest';
// import server from '../index';
// import { ProductService } from '../services/product.services';
// import { Product } from '../models/product';

// jest.mock('../services/product.services');

// const mockedProductService = ProductService as jest.MockedClass<typeof ProductService>;

// describe('ProductController', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should update a product successfully', async () => {
//     const productData: Partial<Product> = {
//       id: '123e4567-e89b-12d3-a456-426614174000',
//       name: 'Updated Product',
//       description: 'Updated description',
//       price: 2999,
//       category: 'Updated Category',
//       // Include any other necessary fields or methods that TypeORM entities typically have
//       user: undefined, // Assuming this is a required field by TypeORM
//       save: jest.fn(), // Mock any methods that might be required
//       // Add other methods like hasId, validateOnInsert, validateOnUpdate, etc., if necessary
//     };

//     mockedProductService.prototype.updateProduct.mockResolvedValue(productData as Product);

//     const response = await request(server)
//       .put(`/products/${productData.id}`)
//       .send({
//         name: 'Updated Product',
//         price: 2999
//       });

//     expect(response.status).toBe(200);
//     expect(response.body).toMatchObject({
//       status: 'success',
//       message: 'Product updated successfully',
//       product: {
//         name: 'Updated Product',
//         price: 2999
//       }
//     });
//     expect(mockedProductService.prototype.updateProduct).toHaveBeenCalledWith(
//       productData.id,
//       { name: 'Updated Product', price: 2999 }
//     );
//   });

//   it('should return a validation error for invalid data', async () => {
//     const response = await request(server)
//       .put('/products/123e4567-e89b-12d3-a456-426614174000')
//       .send({
//         price: 'not-a-number'
//       });

//     expect(response.status).toBe(400);
//     expect(response.body).toMatchObject({
//       status: 'bad request',
//       message: 'Invalid data'
//     });
//   });

//   it('should return not found if the product does not exist', async () => {
//     mockedProductService.prototype.updateProduct.mockResolvedValue(null);

//     const response = await request(server)
//       .put('/products/123e4567-e89b-12d3-a456-426614174000')
//       .send({
//         name: 'Non-existent Product',
//         price: 2999
//       });

//     expect(response.status).toBe(404);
//     expect(response.body).toMatchObject({
//       status: 'not found',
//       message: 'Product not found'
//     });
//   });
// });
