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
- [x] add user authentication
  - [x] register user
  - [x] login user
  - [x] password recover
  - [x] get user profile
  - [ ] update user
- [x] protect routes
- [ ] show public feeds for not logged in users

### Frontend requirements
- [x] user login and register
- [x] Save rss providers
- [x] List rss providers
- [x] Edit rss providers
- [x] Remove rss providers
- [x] List rss
- [x] List rss from one provider
- [ ] password recover
- [ ] edit profile
