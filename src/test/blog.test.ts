// tests/getPaginatedBlogs.test.ts
import request from 'supertest';
import { AppDataSource } from '../data-source';
import { beforeAll, afterAll, describe, it, expect, jest } from '@jest/globals';
import server from '../index';
import { Blog } from '../models';

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('GET /api/v1/blogs', () => {
  it('should return a paginated list of blog posts', async () => {

    // Perform the request
    const response = await request(server).get('/api/v1/blogs?page=1&page_size=1');

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('count');
    expect(response.body).toHaveProperty('next');
    expect(response.body).toHaveProperty('previous');
    expect(response.body).toHaveProperty('results');
    expect(response.body.results).toBeInstanceOf(Array);

  });

  it('should return 400 for invalid page or page_size parameters', async () => {
    const response = await request(server).get('/api/v1/blogs?page=-1&page_size=10');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid page or page_size parameter');
  });

  it('should return an empty list if no blog posts are present', async () => {
    await AppDataSource.getRepository(Blog).clear();

    const response = await request(server).get('/api/v1/blogs?page=1&page_size=10');
    expect(response.status).toBe(200);
    expect(response.body.results).toEqual([]);
  });

  it('should return 405 for invalid HTTP method', async () => {
    const response = await request(server).post('/api/v1/blogs');
    expect(response.status).toBe(405);
    expect(response.body).toHaveProperty('error', 'This method is not allowed.');
  });
});
