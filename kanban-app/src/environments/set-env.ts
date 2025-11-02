const setEnv = () => {
  const fs = require('fs');
  const writeFile = fs.writeFile;
  // Configure Angular `environment.ts` file path
  const targetPath = './src/environments/environment.ts';
  // Load node modules
  const colors = require('colors');
  require('dotenv').config({
    path: 'src/environments/.env'
  });
  // `environment.ts` file structure
  const envConfigFile = `export const environment = { production: true, firebaseConfig: {
  apiKey: '${process.env['FIREBASE_API_KEY']}',
  authDomain: '${process.env['FIREBASE_AUTH_DOMAIN']}',
  projectId: '${process.env['FIREBASE_PROJECT_ID']}',
  appId: '${process.env['FIREBASE_APP_ID']}'
}};
`;
  console.log(colors.magenta('The file `environment.ts` will be written with the following content: \n'));
  writeFile(targetPath, envConfigFile, (err: any) => {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(colors.magenta(`Angular environment.ts file generated correctly at ${targetPath} \n`));
    }
  });
};

setEnv();
