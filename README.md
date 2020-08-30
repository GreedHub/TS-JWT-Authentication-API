# Authentication API

## Installation:

1. Create a folder called `keys` in the root directory and put inside it 2 PEM keys with their public keys for the certs. You should end up with 4 files:
   *  accessPublic.pem
   *  accessPrivate.pem
   *  refreshPublic.pem
   *  refreshPrivate.pem

2. Configure the following ENV variables:
   *  EXPOSED_PORT: The port where the app will listen
   *  DB_HOST: MSSQL db hostname or IP
   *  DB_USER: MSSQL db username
   *  DB_PASS: MSSQL db password
   *  DB_SCHEMA: MSSQL db name
   *  JWT_ACCESS_PASSPHRASE: The password for the `accessPrivate.pem` key
   *  JWT_REFRESH_PASSPHRASE: The password for the `refreshPrivate.pem` key

3. Install the dependencies with `npm i`
