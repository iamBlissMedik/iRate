/**
 * Test env bootstrap. Runs before any module is imported so the env config
 * (which requires DATABASE_URL) doesn't throw. Prisma/Redis are mocked in the
 * service tests, so these values are never actually connected to.
 */
process.env.NODE_ENV = "test";
process.env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/irate_test";
process.env.JWT_SECRET ??= "test-access-secret";
process.env.JWT_REFRESH_SECRET ??= "test-refresh-secret";
process.env.REDIS_URL ??= "redis://127.0.0.1:6379";
