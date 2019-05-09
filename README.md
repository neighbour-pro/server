#Setup
1. Create a .env file with the following fields:
`PORT=your port number
DB=your url connection to db
ENV=development`
2. Run `npm run dev`

<<<<<<< HEAD
## Seed database
To add fake users to the database, run the next command: `node seeds/user.seed.js`.

=======
>>>>>>> a7c196bec3becb811d127f3e8460b512868cec12
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

## Users
Near professionals route `/api/user/nearme/:longitude/:latitude/:radius?`
Method: GET
Description: Gets the nearest professionals within a radius parameter (optional, default to 100km) at a longitude and latitude center.
Required parameters: longitude, latitude

Get user by id route: `/api/user/:id`
Method: GET
Description: Gets the user which id is the same passed by params
Required parameters: id.

Update user route: `/api/user/:id/update`
Method: PUT
Description: Updates the user information
If the user is a client, the required fields are: `name, email, password, phone, role`
If the user is a professional, the required fields are: `name, email, password, phone, description, services, role, location.coordinates.0, location.coordinates.1`

Delete user route: `/api/user/:id/delete`
Method: DELETE
Description: It Deletes the user
