# SSSF-project
Project of the SSSF-course

### Working features:

- HTTPS redirect
- Fetrching created lists
- Fetching created single reviews
- Ctreating new lists
- Creating new reviews

---
## Installing

Clone repository

Run `npm install` in project folder

Create `.env` file

```
DB_URL=mongodb:YOUR_MONGODB_CONNECTION Format: mongodb://myUser:userPwd@address:port
NODE_ENV=development
HTTP_PORT=3000
HTTPS_PORT=8000
PORT=3000
```

Run `npm start` in project folder


Idea:
---
### MyTop10Movies

Allows users to share their top 10 movie lists with other users. Users can follow lists made by other people. Aimed for movie enthusiasts, who also like to share their opinion on different movies.

Functionality:

- Has multiple categories for different lists. (eg. Action, Drama, Comedy)
- Users can rate other users movie lists. (could also have commenting on lists to spark conversation)
- Search for lists in different categories
- Users can edit existing lists
- Can rate movies only when they belong to a list you have (To keep the identity of a top10 list)

Target audience:

- People who watch a lot of movies and like to talk about them and rate them
- People who want to see what other people like in movies
