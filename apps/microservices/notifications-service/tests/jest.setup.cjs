process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  "postgresql://taskflow:taskflow@localhost:5442/taskflow_notifications_test?schema=public";
