## React, PWA, iOS, Android Ready Architecture with Third party Support for notifications, emails, stripe...etc

## Available Scripts

In the project directory, you can run:

### `npm run builDev`

This will build the Dev enviornment.

### `npm run buildProd`

This will build the production enviornment with efforts to minimize and clean the webpack. This part is not perfect as some small edits where made to adjust some higher level logic but plan to update this on my root platform.

### `npm start`

This should be ran after an above enviornment is built, this application and node instance was made to be easily deployed on a linux box. Once built and ran in an live enviornment the script will only ever run the 'Prod'. This is to keep everything in order.

## Learn More

If you would like to learn more about this architecute please contact me directly at Keeano92@gmail.com


### Progressive Web App

This architecture is PWA ready as well as Android and iOS ready. 



### Deployment

Previoulsy set up to run in a developing enviornment and auto deployed to heroku for testing to web, iOS, and Android. Promotions from Dev to production will trigger the production builds to the server updating all devices. Any updates to the hardware level of iOS or Android, such as storage or platform specific updates will require an update from each. Currently Supports MongoDB, but can easily be adjusted to take on a new Databse.
