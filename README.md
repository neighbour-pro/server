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
Signup route: `/api/auth/signup`.<br>
Method: POST.<br>
Description: It lets add a user (Client or Professional) to the app.<br>
Required fields: `name, email, password, confirmPassword, role`.<br>
<br>
Login route: `/api/auth/login`.<br>
Method: POST.<br>
Description: It lets a user to log in.<br>
Required fields: `email, password`.<br>
<br>
Logout route: `/api/auth/logout`.<br>
Method: GET.<br>
Description: It lets a user to log out.<br>
Required fields: none.<br>

## Users
Near professionals route `/api/user/nearme/:longitude/:latitude/:radius?`<br>
Method: GET<br>
Description: Gets the nearest professionals within a radius parameter (optional, default to 100km) at a longitude and latitude center.<br>
Required parameters: longitude, latitude<br>
<br>
Get user by id route: `/api/user/:id`<br>
Method: GET<br>
Description: Gets the user which id is the same passed by params<br>
Required parameters: id.<br>
<br>
User's profile route: `/api/user/professional/:id`<br>
Method: GET<br>
Description: Get the necessary fields to see the user's profile,<br>
Required parameters: id<br>
<br>
Professional's reviews route: `/api/user/professional/:id/reviews`<br>
Method: GET<br>
Description: Get the necessary fields to see the professional's reviews<br>
Required parameters: id<br>
<br>
Update user's profile image route: `/api/user/image/:id`<br>
Method: PUT<br>
Description: Updates the user's profile image and returns the updated user<br>
Required parameters: id<br>
Required fields: image<br>
<br>
Update last connection route: `/api/user/lastconnection/:id`<br>
Method: PUT<br>
Description: Updated the user's last connection to the current date (and time)<br>
Required parameters: id<br>
<br>
Update user route: `/api/user/update/:id`<br>
Method: PUT<br>
Description: Updates the user information<br>
If the user is a client, the required fields are: `name, email, password, phone, role`<br>
If the user is a professional, the required fields are: `name, email, password, phone, description, services, role, location.coordinates.0, location.coordinates.1`<br>
Required parameters: id<br>
<br>
Delete user route: `/api/user/delete/:id`<br>
Method: DELETE<br>
Description: It Deletes the user<br>
Required parameters: id<br>

## Reviews
Create review route: `/api/review/add/:proId/:clientId`<br>
Method: POST<br>
Description: Creates a new review from a client to a professional<br>
Required parameters: proId, clientId<br>
<br>
Add review images: `/api/review/images/:reviewId`<br>
Method: POST<br>
Description: Add images to a review<br>
Required parameters: reviewId<br>
Required fields: photos<br>