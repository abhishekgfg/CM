const { google } = require("googleapis");
const credentials = require("../config/googleCredentials");

async function getSheetClient() {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const authClient = await auth.getClient();
  return google.sheets({ version: "v4", auth: authClient });
}

module.exports = getSheetClient;
