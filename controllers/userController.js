const mongoose = require("mongoose");
const userModel = require("../models/user");
const errorResponse = require("../utils/errors/errorResponse.js");
const mongooseIdHelper = require("../utils/mongooseIdHelper");


exports.addUser = async (req, res, next) => {

  try {
    const _id = req.body._id;


    const doesUserExit = await userModel.exists({ _id: _id});
    if (doesUserExit) {
      throw errorResponse.Api409Error({});
    }

    // req.body._id = mongooseIdHelper.getMongooseIdFromString(_id);
    
      await userModel.create(req.body);
    res.dataUpdateSuccess({message:"User Created Successfully"});
    
  } catch (error) {
    next(error);
  }
};

exports.searchSingleUser = async (req, res, next) => {

  try{

  const searchFor = req.query.search_for;
  const startAfterId = req.query.start_after_id || null;

    if(!searchFor){
    throw errorResponse.Api400Error({description:"Search term not found"});
  }
  
  let aggragationQuery;

  if(startAfterId != null){
    aggragationQuery = [
      {
        '$search': {
          'index': 'nameSearchIndex', 
         'autocomplete': {
            'query': searchFor, 
            'path': 'name', 
            'fuzzy': {
              'maxEdits': 2, 
              'prefixLength': 2
            }
          }
        }
      }, {
        '$match': {
          '_id': {
            '$gt': startAfterId
          }
        }
      }, {
        '$sort': {
          '_id': 1
        }
      }, {
        '$project': {
          'name': 1, 
          'status_line': 1, 
          'compressed_profile_image': 1
        }
      }, {
        '$limit': 15
      },
    ];
  }else{
    aggragationQuery = [
      {
        '$search': {
          'index': 'nameSearchIndex', 
          // 'text': {
          //   'query': searchFor, 
          //   'path': 'name'
          // }
            'autocomplete': {
            'query': searchFor, 
            'path': 'name', 
            'fuzzy': {
              'maxEdits': 2, 
              'prefixLength': 2
            }
          }
        }
      }, {
        '$sort': {
          '_id': 1
        }
      }, {
        '$project': {
          'name': 1, 
          'status_line': 1, 
          'compressed_profile_image': 1
        }
      }, {
        '$limit': 15
      },
    ];
  }

  const results = await userModel.aggregate(aggragationQuery);
  return res.dataFetchSuccess({data:results});
}catch(error){
  next(error);
}
  //search for should be more than one character here



};

exports.getSingleUser = async (req, res, next) => {


  try {
    const _id = req.body._id;
    if(!_id){
      throw errorResponse.idNotFoundError();
     }

      const userInformation = await userModel.findById(_id);
      res.dataFetchSuccess({data:userInformation});
   
  } catch (error) {
    next(error);
  }

};

exports.updateUser = async (req, res, next) => {

  try{
    const _id = req.body._id;
    if(!_id){
      throw errorResponse.idNotFoundError();
     }

     delete req.body["_id"];

    await userModel.findByIdAndUpdate(_id,req.body,{runValidators:true});
    res.dataUpdateSuccess();
  }catch(error){
    next(error);
  }


};

