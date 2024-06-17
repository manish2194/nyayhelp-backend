const AUTH_COOKIE = "__nyayhelp.session";
const AUTH_VALIDITY = 60 * 60 * 24 * 365; //1 year in seconds
const PAGE_SIZE_LIMITATION = {
  BLOG: 50,
};

module.exports = {
  AUTH_COOKIE,
  AUTH_VALIDITY,
};
