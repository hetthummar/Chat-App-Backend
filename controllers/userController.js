const mongoose = require("mongoose");
const userModel = require("../models/user");
const recentChatModel = require("../models/recent_chat");
const errorResponse = require("../utils/errors/errorResponse.js");
const mongooseIdHelper = require("../utils/mongooseIdHelper");
const util = require("util");

exports.addUser = async (req, res, next) => {
  try {
    const _id = req.body._id;

    const doesUserExit = await userModel.exists({ _id: _id });
    if (doesUserExit) {
      throw errorResponse.Api409Error({});
    }

    // req.body._id = mongooseIdHelper.getMongooseIdFromString(_id);

    await userModel.create(req.body);
    res.dataUpdateSuccess({ message: "User Created Successfully" });
  } catch (error) {
    next(error);
  }
};

exports.searchSingleUser = async (req, res, next) => {
  try {
    const searchFor = req.query.search_for;
    const startAfterId = req.query.start_after_id || null;

    if (!searchFor) {
      throw errorResponse.Api400Error({ description: "Search term not found" });
    }

    let aggragationQuery;

    if (startAfterId != null) {
      aggragationQuery = [
        {
          $search: {
            index: "userNameSearchIndex",
            autocomplete: {
              query: searchFor,
              path: "name",
              fuzzy: {
                maxEdits: 2,
                prefixLength: 2,
              },
            },
          },
        },
        {
          $match: {
            _id: {
              $gt: startAfterId,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $project: {
            name: 1,
            status_line: 1,
            compressed_profile_image: 1,
          },
        },
        {
          $limit: 15,
        },
      ];
    } else {
      aggragationQuery = [
        {
          $search: {
            index: "userNameSearchIndex",
            // 'text': {
            //   'query': searchFor,
            //   'path': 'name'
            // }
            autocomplete: {
              query: searchFor,
              path: "name",
              fuzzy: {
                maxEdits: 2,
                prefixLength: 2,
              },
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $project: {
            name: 1,
            status_line: 1,
            compressed_profile_image: 1,
          },
        },
        {
          $limit: 15,
        },
      ];
    }

    const results = await userModel.aggregate(aggragationQuery);
    return res.dataFetchSuccess({ data: results });
  } catch (error) {
    next(error);
  }
  //search for should be more than one character here
};

exports.getSingleUser = async (req, res, next) => {
  try {
    const _id = req.query._id;
    if (!_id) {
      throw errorResponse.idNotFoundError();
    }

    const userInformation = await userModel.findById(_id);
    console.log(userInformation);
    res.dataFetchSuccess({ data: userInformation });
  } catch (error) {
    next(error);
  }
};

exports.updateUserToken = async (req, res, next) => {
  console.log("update user token body :- " + util.inspect(req.body));

  try {
    const _id = req.body._id;
    if (!_id) {
      throw errorResponse.idNotFoundError();
    }
    delete req.body["_id"];

    await userModel.findByIdAndUpdate(_id, req.body, { runValidators: true });
    res.dataUpdateSuccess();
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const _id = req.userId;
    delete req.body["_id"];

    let nameOfUser = req.body.name;
    let compressedImageOfUser = req.body.compressed_profile_image;

    nameOfUser = nameOfUser === undefined ? null : nameOfUser;
    compressedImageOfUser = compressedImageOfUser === undefined ? null : compressedImageOfUser;

    console.log("nameOfUser id :- " + _id);
    console.log("nameOfUser nameOfUser :- " + nameOfUser);
    console.log("compressedImageOfUser compressedImageOfUser :- " + compressedImageOfUser);

    let aggragationQuery = [
      {
        $match: {
          participants: _id,
        },
      },
      {
        $addFields: {
          matchedIndex: {
            $indexOfArray: ["$participants", _id],
          },
        },
      },
      {
        $set: {
          user1_name: {
            $cond: {
              if: {
                $and: [
                  { $eq: ["$matchedIndex", 0] },
                  { $ne: [nameOfUser, null] },
                ],
              },
              then: nameOfUser,
              else: "$user1_name",
            },
          },
          user1_compressed_image: {
            $cond: {
              if: {
                $and: [
                  { $eq: ["$matchedIndex", 0] },
                  { $ne: [compressedImageOfUser, null] },
                ],
              },
              then: compressedImageOfUser,
              else: "$user1_compressed_image",
            },
          },
          user1_local_updated:{
            $cond: {
              if: {
              $eq: ["$matchedIndex", 1],
              },
              then: false,
              else: "$user1_local_updated",
            },
          },
          user2_name: {
            $cond: {
              if: {
                $and: [
                  { $eq: ["$matchedIndex", 1] },
                  { $ne: [nameOfUser, null] },
                ],
              },
              then: nameOfUser,
              else: "$user2_name",
            },
          },
          user2_compressed_image: {
            $cond: {
              if: {
                $and: [
                  { $eq: ["$matchedIndex", 1] },
                  { $ne: [compressedImageOfUser, null] },
                ],
              },
              then: compressedImageOfUser,
              else: "$user2_compressed_image",
            },
          },
          user2_local_updated:{
            $cond: {
              if: {
              $eq: ["$matchedIndex", 0],
              },
              then: false,
              else: "$user2_local_updated",
            },
          },
        },
      },
    ];

    //  aggragationQuery = [
    //   {
    //     $match: {
    //       participants: _id,
    //     },
    //   },
    //   {
    //     $addFields: {
    //       matchedIndex: {
    //         $indexOfArray: ["$participants", _id],
    //       },
    //     },
    //   },
    // ];

    await userModel.findByIdAndUpdate(_id, req.body, { runValidators: true });
    
    const results = await recentChatModel.aggregate(aggragationQuery);
    results.forEach(async function(x){
      delete x['matchedIndex'];
      await recentChatModel.findByIdAndUpdate(x._id,x);
    },);

    console.log("KANA :- "  +util.inspect(results));

    res.dataUpdateSuccess();
  } catch (error) {
    next(error);
  }
};

exports.getUserBackUpDetails = async (req, res, next) => {
  try {
    const _id = req.query._id;
    if (!_id) {
      throw errorResponse.idNotFoundError();
    }
//participants: _id,
    const userInformation = await recentChatModel.find({participants : _id});
    console.log("userInformation :- " + util.inspect(userInformation));
    let isBackUpFound = false;
    if(Object.keys(userInformation).length != 0){
      isBackUpFound = true;
    }

    let backupObj = {"isBackUpFound":isBackUpFound};

    res.dataFetchSuccess({ data: backupObj });
  } catch (error) {
    next(error);
  }
};

exports.getUserBackUpData = async (req, res, next) => {
  try {
    const _id = req.query._id;
    if (!_id) {
      throw errorResponse.idNotFoundError();
    }
//participants: _id,
    const userInformation = await recentChatModel.find({participants : _id});
    console.log("error 0 :- " + util.inspect(userInformation));

    res.dataFetchSuccess({ data: userInformation });
  } catch (error) {
    console.log("error 1 :- " + error);
    next(error);
  }
};