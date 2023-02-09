export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mail: {
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
  },
  sheetId: process.env.SHEET_ID,
});
