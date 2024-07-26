require('dotenv').config();

const config = {
  ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  SENTRY_DSN: process.env.SENTRY_DSN,
  API_PREFIX_ROUTE: process.env.API_PREFIX_ROUTE || 'api',
  APP_URL: process.env.APP_URL,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  BYPASS_RATE_LIMIT: process.env.BYPASS_RATE_LIMIT === 'true',
  JWT: {
    SECRET: process.env.JWT_SECRET,
    LIFE_TIME: process.env.JWT_LIFE_TIME,
    RESET_TOKEN_LIFE_TIME: process.env.JWT_RESET_TOKEN_LIFE_TIME,
  },
  REDIS: {
    HOST: process.env.REDIS_HOST,
    PASSWORD: process.env.REDIS_PASSWORD,
    PORT: process.env.REDIS_PORT,
    TLS: process.env.REDIS_TLS === 'true',
  },
  AWS: {
    ACCESS_ID: process.env.AWS_ACCESS_ID,
    SECRET_KEY: process.env.AWS_SECRET_KEY,
    REGION: process.env.AWS_REGION,
    S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    CLOUDFRONT_PRIVATE_ID: process.env.AWS_CLOUDFRONT_PRIVATE_ID,
    CLOUDFRONT_PRIVATE_KEY: process.env.AWS_CLOUDFRONT_PRIVATE_KEY,
    CLOUDFRONT_PRIVATE_DOMAIN: process.env.AWS_CLOUDFRONT_PRIVATE_DOMAIN,
  },
  RATE_LIMIT: {
    DEFAULT_WINDOW_IN_MS: Number(process.env.RATE_LIMIT_DEFAULT_WINDOW_IN_MS) || 1 * 60 * 1000,
    MAX_REQUESTS_PER_WINDOW: Number(process.env.RATE_LIMIT_MAX_REQUESTS_PER_WINDOW) || 30,
  },
  ENCRYPTION: {
    IV: process.env.ENCRYPTION_IV,
    SECRET: process.env.ENCRYPTION_SECRET,
    PASSWORD_SALT: process.env.ENCRYPTION_PASSWORD_SALT,
    PASSWORD_ITERATIONS: Number(process.env.ENCRYPTION_PASSWORD_ITERATIONS) || 1000,
  },
  PROVIDERS: {
    EMAIL: process.env.EMAIL_PROVIDER,
  },
  MAIL_MONKEY: {
    HOST: process.env.MAIL_MONKEY_HOST,
    APPLICATION_ID: process.env.MAIL_MONKEY_APPLICATION_ID,
    SECRET_KEY: process.env.MAIL_MONKEY_SECRET_KEY,
    FROM_EMAIL: process.env.MAIL_MONKEY_FROM_EMAIL,
    FROM_NAME: process.env.MAIL_MONKEY_FROM_NAME,
  },
  SENDBAY: {
    HOST: process.env.SENDBAY_HOST,
    API_KEY: process.env.SENDBAY_API_KEY,
    SECRET_KEY: process.env.SENDBAY_SECRET_KEY,
    FROM_EMAIL: process.env.SENDBAY_FROM_EMAIL,
    FROM_NAME: process.env.SENDBAY_FROM_NAME,
    EMAIL_ENDPOINT: process.env.SENDBAY_EMAIL_ENDPOINT,
  },
  WEB_URLS: process.env.WEB_URLS,
  DEPTH_LIMIT_CONFIG: Number(process.env.QUERY_DEPTH_LIMIT) || 5,
  QUERY_LENGTH_LIMIT: Number(process.env.QUERY_LENGTH_LIMIT) || 3500,
  COMPLEXITY_THRESHOLD: Number(process.env.COMPLEXITY_THRESHOLD) || 60,
  QUERY_PAGING_MIN_COUNT: Number(process.env.QUERY_PAGING_MIN_COUNT) || 10,
  QUERY_PAGING_MAX_COUNT: Number(process.env.QUERY_PAGING_MAX_COUNT) || 50,
  GRAPHQL_INTROSPECTION_RESTRICTION: {
    ENABLED: process.env.GRAPHQL_INTROSPECTION_RESTRICTION_ENABLED === 'true',
    SECRET: process.env.GRAPHQL_INTROSPECTION_RESTRICTION_SECRET,
  },
  ALLOW_INTROSPECTION: process.env.ALLOW_INTROSPECTION === 'true',
};

module.exports = config;
