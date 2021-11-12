

module.exports = function isUserOne(userList, userId){
  userList.sort();
  console.log("isUser :- " + userList);
  const result = userList.findIndex((x) => x == userId);
  console.log("isUser :- " + result);
  if (result == 0) {
    return true;
  } else {
    return false;
  }
};

