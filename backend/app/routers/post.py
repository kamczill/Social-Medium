from datetime import datetime, timedelta, timezone
from bson.objectid import ObjectId
from fastapi import APIRouter, Response, status, Depends, HTTPException, File, UploadFile , Form
from fastapi.responses import FileResponse
from typing_extensions import Annotated
from typing import Union
from pathlib import Path


from app import oauth2
from app.database import User, Post
from app.serializers.userSerializers import postResponseEntity
from .. import schemas, utils
from app.oauth2 import AuthJWT
from ..config import settings
import shutil
import os 


router = APIRouter()


@router.get('/')
def get_feed_posts(friends: bool = False, skip: int = 0, limit: int = 5, user_id: str = Depends(oauth2.require_user)):
    
    if friends:
        userFriends = User.find_one({"_id": ObjectId(str(user_id))})['friends']
        userFriends.append(user_id)
        posts = Post.find({"user_id": {'$in': userFriends}}).sort("created_at", -1).skip(skip*limit).limit(limit)
    else:
        posts = Post.find().sort("created_at", -1).skip(skip*limit).limit(limit)
    
    posts_arr = []
    for post in posts:
        posts_arr.append(postResponseEntity(post))
    return {"posts": posts_arr}

@router.get('/{user_id}')
def get_user_posts(user_id: str):
    try:
        user = User.find_one({"_id": ObjectId(str(user_id))})
    except Exception:
        raise HTTPException(status_code=404, detail=f"User {user_id} not found")
    
    posts = Post.find({'user_id':user_id}).sort("created_at", -1)
    posts_arr = []
    for post in posts:
        posts_arr.append(postResponseEntity(post))
        
    return {"posts": posts_arr}
        

# @router.post('/create', status_code=status.HTTP_201_CREATED, response_model=None)
# def create_post(payload: schemas.PostResponse, user_id: str = Depends(oauth2.require_user), file: UploadFile = File(...)):
#     payload.user_id = user_id
#     print(payload.user_id)
#     payload.created_at = datetime.utcnow()
#     payload.updated_at = payload.created_at
#     result = Post.insert_one(payload.dict())
#     # print(payload.dict())
#     new_post = postResponseEntity(Post.find_one({'_id': result.inserted_id}))
#     print(new_post)
#     return {"result": new_post}


@router.post('/create', status_code=status.HTTP_201_CREATED, response_model=None)
async def create_post(
    description: str = Form(default=''),
    file: UploadFile = File(default=None),
    user_id: str = Depends(oauth2.require_user)):
    
    print(description, file)
    user = User.find_one({"_id": ObjectId(str(user_id))})
    
    if not file:
        picture_path = ''
    else: 
        file_location = f'images/{user_id}'
        Path(file_location).mkdir(parents=True, exist_ok=True)
        if file.content_type == 'image/jpeg' or file.content_type == 'image/png':
            with open(file_location + f'/{file.filename}', 'wb') as image:
                shutil.copyfileobj(file.file, image)
            picture_path = f'{user_id}/{file.filename}'
        else:
            raise HTTPException(status_code=404, detail="The file is not a image")
    
    post = schemas.PostSchema(
        firstName= user['firstName'],
        lastName = user['lastName'],
        location=user['location'],
        description=description,
        picturePath= picture_path,
        userPicturePath=user['picturePath'],
        likes=[],
        comments=[],
        created_at=datetime.utcnow(),
        updated_at=None,
        user_id = user_id
    )
    
    # payload.user_id = user_id
    # print(payload.user_id)
    # payload.created_at = datetime.utcnow()
    # payload.updated_at = payload.created_at
    result = Post.insert_one(post.dict())
    
    # # print(payload.dict())
    new_post = postResponseEntity(Post.find_one({'_id': result.inserted_id}))
    # print(new_post)
    return {"result": new_post}

@router.put('/{id}/like')
def like_post(id = str, user_id: str = Depends(oauth2.require_user)):
    try:
        post = Post.find_one({'_id': ObjectId(str(id))})
    except:
        raise HTTPException(status_code=404, detail="post not found")
    
    likes_arr = post['likes']
    
    if str(user_id) in likes_arr:
        likes_arr.remove(user_id)
    else:
        likes_arr.append(user_id)
    
    Post.update_one({"_id": ObjectId(str(id))}, { "$set": {"likes": likes_arr}})
    liked_post = postResponseEntity(Post.find_one({'_id': ObjectId(str(id))}))
    
    return {"post": liked_post}


@router.put('/{id}/comment')
def like_post(id = str, comment: schemas.CommentSchema = None, user_id: str = Depends(oauth2.require_user)):
    try:
        post = Post.find_one({'_id': ObjectId(str(id))})
        user = User.find_one({'_id': ObjectId(str(user_id))})
    except:
        raise HTTPException(status_code=404, detail="post not found")
    
    if comment == '':
        raise HTTPException(status_code=400, detail="comment is empty!")
    
    comments_arr = post['comments']
    
    comments_arr.append({
        'user_id': user_id, 
        'firstName': user['firstName'],
        'lastName': user['lastName'],
        'picturePath': user['picturePath'], 
        'comment': comment.comment,
        'created_at': datetime.now(timezone.utc)
        })
    
    Post.update_one({"_id": ObjectId(str(id))}, { "$set": {"comments": comments_arr}})
    commented_post = postResponseEntity(Post.find_one({'_id': ObjectId(str(id))}))
    
    return {"post": commented_post}



@router.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    
    file_location = f'images/{file.filename}'
    if file.content_type == 'image/jpeg':
    # file1 = open(file, 'r')
    # lines = file1.readlines()
        # with open(file.filename, 'wb') as image:
        with open(file_location, 'wb') as image:
            shutil.copyfileobj(file.file, image)
    else:
        raise HTTPException(status_code=404, detail="The file is not a image")
    
    return {"filename": file.filename}

@router.post("/files/")
async def create_file(
    file: UploadFile = File(None),
    user: str =Form(default='')
):
    
    if not file:
        raise HTTPException(status_code=404, detail='chuj tam jes')
    
    return {'file': file.filename, 'user': user}