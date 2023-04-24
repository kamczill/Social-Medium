from typing import List, Union
from datetime import datetime
from pydantic import BaseModel, EmailStr, constr, Field


class UserBaseSchema(BaseModel):
    firstName: str = Field(min_length=2, max_length=50) 
    lastName: str = Field(min_length=2, max_length=50) 
    email: str
    picturePath: str
    friends: list = []
    location: str
    occupation: str
    viewedProfile: int
    impressions: int
    created_at: Union[datetime, None] = None
    updated_at: Union[datetime, None] = None

    class Config:
        orm_mode = True


class CreateUserSchema(UserBaseSchema):
    email: EmailStr
    password: constr(min_length=8)
    passwordConfirm: str
    verified: bool = False


class LoginUserSchema(BaseModel):
    email: EmailStr
    password: constr(min_length=8)


class UserResponseSchema(UserBaseSchema):
    id: str
    pass


class UserResponse(BaseModel):
    status: str
    user: UserResponseSchema

class UserFriend(BaseModel):
    id: str
    firstName: str
    lastName: str
    occupation: str
    location: str
    picturePath: str

class UserFriendsList(BaseModel):
    friends: List[UserFriend]


# class PostSchema(BaseModel):
#     firstName: str
#     lastName: str
#     location: str
#     description: str
#     picturePath: str
#     userPicturePath: str
#     likes: list
#     comments: list
#     created_at: Union[datetime, None] = None
#     updated_at: Union[datetime, None] = None
    
#     class Config:
#         orm_mode = True

class PostSchema(BaseModel):
    firstName: str
    lastName: str
    location: str
    description: str
    picturePath: str
    userPicturePath: str
    likes: list
    comments: list
    created_at: Union[datetime, None] = None
    updated_at: Union[datetime, None] = None
    user_id: str
   
class PostResponse(BaseModel):
    firstName: str
    lastName: str
    location: str
    description: str
    picturePath: str
    userPicturePath: str
    likes: list
    comments: list
    created_at: Union[datetime, None] = None
    updated_at: Union[datetime, None] = None
    user_id: str
    
class CommentSchema(BaseModel):
    comment: str