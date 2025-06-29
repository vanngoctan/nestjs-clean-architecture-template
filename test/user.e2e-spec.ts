import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/users (POST) - should validate input data', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        // Missing required fields to test validation
        email: 'invalid-email',
      })
      .expect(400);
  });

  // Note: This test assumes a fresh database or test isolation
  // In real tests, you would use a test database and clean it between tests
  it('/users (POST) - should create a user', () => {
    const email = `test-${Date.now()}@example.com`;
    
    return request(app.getHttpServer())
      .post('/users')
      .send({
        email: email,
        name: 'Test User',
        password: 'Password123!',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toBe(email);
        expect(res.body.name).toBe('Test User');
        expect(res.body).not.toHaveProperty('password');
        expect(res.body).not.toHaveProperty('passwordHash');
      });
  });
});
