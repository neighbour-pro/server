#Setup
1. Create a .env file with the following fields:
`PORT=your port number
DB=your url connection to db
ENV=development`
2. Run `npm run dev`

## Seed database
To add fake users to the database, run the next command: `node seeds/user.seed.js`.

## API docs

### Authentication
Signup route: `/api/auth/signup`.
Method: POST.
Description: It lets add a user (Client or Professional) to the app.
Required fields: `name, email, password, confirmPassword, role`.

Login route: `/api/auth/login`.
Method: POST.
Description: It lets a user to log in.
Required fields: `email, password`.

Logout route: `/api/auth/logout`.
Method: GET.
Description: It lets a user to log out.
Required fields: none.