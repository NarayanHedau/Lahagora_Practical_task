# Lahagora_Practical_task

1. You have to clone this project and install all dependencies using npm i command
2. Project Run :  npm start
3. first Register Admin
    - Register using POST method
    - request body field is
      {
          "username": "Admin Username",   
          "email": "admin@123",
          "password": "admin@123",
          "roles": "Admin"        // Admin role is constant as "Admin"
      }
4. Admin Login:
    - login using POST method
    - request body field is 
      {
        "email": "admin@123",
        "password": "admin@123"
      }
    - If Admin login successfully then create JWT token

5. User Register:
    - Register user using POST method.
    - request body is
    {
     "username": "User Username",
      "email": "user@123",
      "password": "user@123",
      "roles": "User"          // User role is constant as "User"
    }
6. User Login:
    - login using POST method
    - request body field is 
      {
      "email": "user@123",
      "password": "user@123"
      }
    - If User login successfully then create JWT token

7. Only Admin can create Role using Admin JWT token 
    - create role using POST method
    - provide Admin JWT token in header as a Authorization
    - request body is
    {
    "permissions": [
        {
            "access": [
                "create",
                "update",
                "read",
                "delete"
            ],
            "entityName": "Movies"
        },
                {
            "access": [
                "create",
                "update",
                "read",
                "delete"
            ],
            "entityName": "Series"
        }
    ],
    "userId" : "65545d5768a957972872415a"
    }
    
8. Admin can create, update, delete, and get role for particular User and get all role of all users (You need to provide Admin JWT token in header as a Authorization)
9. in get all role api use pagination functionality. so, you need to provide page and limit in query params
10. in get single role api you need to provide roleId using params
11. In role update API you need to provide roleId using params and the fields you want to update will have to be provided from the request body.
12. In role delete API you need to provide roleId using params
13. If the admin has given permission to a user to create, update, delete and read, then that user will be able to create, update, delete and read the movie.
14. Accessible user can create Movies
    - create Movie using POST method
    - provide User JWT token in header as a Authorization
    - request body in form-data
        "title": "Movie Title",
        "name": "Movie Name",
        "genre": "Movie Genre",
        "releaseYear": 2024,
        "director": "Movie Director Name",
        "duration": 24,
        "description": "Movie Description",
        "poster": "http://127.0.0.1:9143/public/upload/c172f973ebdc832970868f7b10fd0d87e.png",   // Select the image file any one

15. Accessible user can get all Movies (pagination and search functionality are included)
    - get Movie using GET method
    - provide User JWT token in header as a Authorization
    - if user can search the movie. so provide query params through title and genre
    - for pagination you can provide query params through page and limit
16. Accessible user can get single Movies
    - get Movie using GET method
    - provide User JWT token in header as a Authorization
    - provide movieId using request params
17. Accessible user can update Movies
    - update Movie using PATCH method
    - provide User JWT token in header as a Authorization
    - request body in form-data
        "title": "Movie Title",
        "name": "Movie Name",
        "genre": "Movie Genre",
        "releaseYear": 2024,
        "director": "Movie Director Name",
        "duration": 24,
        "description": "Movie Description",
        "poster": "http://127.0.0.1:9143/public/upload/c172f973ebdc832970868f7b10fd0d87e.png",   // Select the image file any one
18. Accessible user can delete Movies
    - delete Movie using DELETE method
    - provide User JWT token in header as a Authorization
    - provide movieId using request params

19. Like it was done for movies, it has to be done for series. (create, update, delete, get) // only accessible user can access this action.

20. User Activity Log
    - Admin can only accessible for all user activity logs and single user activity log (provide User JWT token in header as a Authorization)

21. Reset Password:
    Admin Or User can change the password
    - Reset password using PATCH method
    - provide User JWT token in header as a Authorization (User / Admin)
    - provide user or admin Id as an userId in request params.
    - request body is:
    {
      "newPassword": "user@1234",
      "currentPassword": "user@123"
    }
