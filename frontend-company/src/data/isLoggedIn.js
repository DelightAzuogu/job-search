var isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export default isLoggedIn;
