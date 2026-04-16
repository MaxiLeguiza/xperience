import dotenv from "dotenv";
dotenv.config();

const enviromentVariables = {
  PORT: process.env.PORT || 3000,
  EMAIL_USER: process.env.GMAIL_USER || process.env.USER_MAIL,
  EMAIL_PASS: process.env.GMAIL_APP_PASSWORD || process.env.PASSWORD_MAIL,
  MAIL_FROM:
    process.env.MAIL_FROM || process.env.GMAIL_USER || process.env.USER_MAIL,
  SECRET_KEY: process.env.JWT_SECRET || process.env.SECRET_KEY,
  MAIL_VERIFY_ON_BOOT: process.env.MAIL_VERIFY_ON_BOOT === 'true',
  MAIL_TLS_REJECT_UNAUTHORIZED:
    process.env.MAIL_TLS_REJECT_UNAUTHORIZED !== 'false',
};

export default enviromentVariables;
