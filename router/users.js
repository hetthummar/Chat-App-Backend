const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/", userController.addUser);
// router.get('/',userController.getUsers);
// router.delete('/:id',userController.deleteSingleUser);
router.get("/", userController.getSingleUser);
router.get("/search/", userController.searchSingleUser);
router.patch("/userUpdateToken/", userController.updateUserToken);
router.get("/getBackupDetails/", userController.getUserBackUpDetails);
router.get("/userBackUpData/", userController.getUserBackUpData);

module.exports = router;
