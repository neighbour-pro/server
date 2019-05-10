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

## Users
Near professionals route `/api/user/nearme/:longitude/:latitude/:radius?`
Method: GET
Description: Gets the nearest professionals within a radius parameter (optional, default to 100km) at a longitude and latitude center.
Required parameters: longitude, latitude

Get user by id route: `/api/user/:id`
Method: GET
Description: Gets the user which id is the same passed by params
Required parameters: id.

User's profile route: `/api/user/professional/:id`
Method: GET,
Description: Get the necessary fields to see the user's profile,
Required parameters: id

Professional's reviews route: `/api/user/professional/:id/reviews`
Method: GET,
Description: Get the necessary fields to see the professional's reviews
Required parameters: id

Update user's profile image route: `/api/user/image/:id`
Method: PUT
Description: Updates the user's profile image and returns the updated user
Required parameters: id
Required fields: image

Update last connection route: `/api/user/lastconnection/:id`
Method: PUT
Description: Updated the user's last connection to the current date (and time)
Required parameters: id

Update user route: `/api/user/update/:id`
Method: PUT
Description: Updates the user information
If the user is a client, the required fields are: `name, email, password, phone, role`
If the user is a professional, the required fields are: `name, email, password, phone, description, services, role, location.coordinates.0, location.coordinates.1`
Required parameters: id

Delete user route: `/api/user/delete/:id`
Method: DELETE
Description: It Deletes the user
Required parameters: id

## Reviews
Create review route: `/api/review/add/:proId/:clientId`
Method: POST
Description: Creates a new review from a client to a professional
Required parameters: proId, clientId

Add review images: `/api/review/images/:reviewId`
Method: POST
Description: Add images to a review
Required parameters: reviewId
Required fields: photos