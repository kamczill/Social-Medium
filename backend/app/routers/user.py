from fastapi import APIRouter, Depends, HTTPException
from bson.objectid import ObjectId
from app.serializers.userSerializers import userResponseEntity, userFriendsResponse, userFriendResponse, userEntity, searchUsersResponseEntity
from typing import List
from app.database import User
from .. import schemas, oauth2

router = APIRouter()


@router.get('')
def get_me(user_id: str = Depends(oauth2.require_user)):
    users = User.find()
    users_arr = []
    for user in users:
        users_arr.append(userResponseEntity(user))
    return {"status": "success", "users": users_arr}

@router.get('/me', response_model=schemas.UserResponse)
def get_me(user_id: str = Depends(oauth2.require_user)):
    user = userResponseEntity(User.find_one({'_id': ObjectId(str(user_id))}))
    return {"status": "success", "user": user}

@router.get('/{id}', response_model=schemas.UserResponse)
def get_user(id = str, user_id: str = Depends(oauth2.require_user)):
    try:
        user_response = userResponseEntity(User.find_one({"_id": ObjectId(str(id))}))
        return {"status": "success", "user": user_response}
    except Exception:
        raise HTTPException(status_code=404, detail=f"User {id} not found")


@router.get('/search/{phrase}')
def get_user(phrase: str):
    try:
        users = User.aggregate([
            {'$project': 
                {'firstName': 1,'lastName': 1, 'picturePath': 1, 'fullName': {'$concat': ['$firstName', ' ', '$lastName']}}},
            {'$match': 
                {'$or': 
                        [
                            {'lastName': {'$regex': f'^{phrase}', "$options": 'i'}},
                            {'fullName': {'$regex': f'^{phrase}', "$options": 'i'}}
                        ]
                }},
            {'$limit': 5}
        ])
        users_arr = []
        for user in users:
            users_arr.append(searchUsersResponseEntity(user))
        return {"users": users_arr}
    except Exception:
        raise HTTPException(status_code=404, detail=f"User not found")
    
@router.get('/{id}/friends')
def get_user_friends(id = str, user_id: str = Depends(oauth2.require_user)):
    user = userFriendsResponse(User.find_one({'_id': ObjectId(str(id))}))
    friends = []
    if user["friends"]:
        for friend in user["friends"]:
            friends.append(userFriendResponse(User.find_one({'_id': ObjectId(str(friend))})))
    return {"friends": friends}

@router.put('/{id}/{friendId}')
def add_remove_friend(id = str, friendId = str, user_id: str = Depends(oauth2.require_user)):
        try:
            user = userFriendsResponse(User.find_one({'_id': ObjectId(str(id))}))
            friend = userEntity(User.find_one({'_id': ObjectId(str(friendId))}))
            user_friends = user['friends']
        except:
            raise HTTPException(status_code=404, detail=f"{id} or {friendId} not found")
        
        if user and friend:
            if friendId in user_friends:
                user_friends.remove(friendId)
            else:
                user_friends.append(friendId)
            
            
        User.update_one({"_id": ObjectId(str(id))}, { "$set": {"friends": user_friends}})
        updated_user = userResponseEntity(User.find_one({'_id': ObjectId(str(id))}))
        
        return {"updated_friends_list": updated_user}