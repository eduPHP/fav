## Node.js RSS Reader

Study case.

What will I use?
- Node.js + express for routing
- Mysql as database maybe some ORM later
- **Not** using any lib to read RSS, I want to implement it myself
- Some sort of cache for results
- Background proccesses to update the lists and notify new items

I will create an [issue](https://github.com/swalker2/node-rss-reader/issues) for any problems that I face

### Backend requirements

- [x] Save rss links
- [x] List rss links
- [x] Edit rss links
- [x] Remove rss links
- [x] Read rss from saved link
- [x] add validation
- [ ] add user authentication
  - [ ] register user
  - [ ] login user
  - [ ] password recover
  - [ ] get user profile
  - [ ] update user
- [ ] protect routes

### Frontend requirements
- [ ] user login and register
- [ ] password recover
- [ ] Save rss links
- [ ] List rss links
- [ ] Edit rss links
- [ ] Remove rss links
- [ ] List rss using react (more details when backend is done)
