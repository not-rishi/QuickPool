
// Auth
POST /api/auth/send-otp //Send OTP
POST /api/auth/verify-otp //Verify OTP
POST /api/auth/logout //Logout

// User Management
GET /api/users/me //Get user info
PUT /api/users/me //Updates information
GET /api/users/me/history //get user history

// Route Management
POST /api/routes //Creates a new travel route
GET /api/routes //Returns all travel route
GET /api/routes/:routeId //Returns a specific route based on ID
DELETE /api/routes/:routeId //Delete a route based on a specific ID


// User-Route Management
POST /api/routes/:routeId/join //Adds user to a specific route
POST /api/routes/:routeId/join //Removes user from a specific route
GET /api/routes/:routeId/queue //Gets user detail with respect to the queue (like user position)
 
// Group Management
GET /api/groups/current //Returns the currently assigned group for the authenticated user
GET /api/groups/:groupId //Returns group details and members
POST /api/groups/:groupId/leave //Allows a user to leave a group before ride start
POST /api/groups/:groupId/swap //Prevents future pairing with a selected teammate (swap/avoid)

// No-show Reporting
POST /api/groups/:groupId/report //Report a group member who did not show up
GET /api/groups/:groupId/report-status //Return no-show report information/status for a group

// Emergency
POST /api/groups/:groupId/panic //Sends emergency details to admin/support

// Admin endpoints
GET /api/admin/users //Returns all registered users (admin only)
GET /api/admin/routes //Returns all routes (admin only)
GET /api/admin/panic-reports //Returns all panic/emergency reports (admin only)
PATCH /api/admin/users/:userId/reputation //Updates a user's reputation score (admin only)