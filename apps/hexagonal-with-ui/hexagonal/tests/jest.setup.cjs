process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  process.env.DATABASE_URL ||
  "postgresql://taskflow:taskflowtest@localhost:5433/taskflow_test?schema=public";
