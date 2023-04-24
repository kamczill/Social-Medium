def userEntity(user) -> dict:
    return {
        "id": str(user["_id"]),
        "firstName": user["firstName"],
        "email": user["email"],
        "verified": user["verified"],
        "password": user["password"],
        "created_at": user["created_at"],
        "updated_at": user["updated_at"]
    }


def userResponseEntity(user) -> dict:
    return {
        "id": str(user["_id"]),
        "firstName": user["firstName"],
        "lastName": user["lastName"],
        "email": user["email"],
        "picturePath": user["picturePath"],
        "friends": list(user["friends"]),
        "location": user["location"],
        "occupation": user["occupation"],
        "viewedProfile": user["viewedProfile"],
        "impressions": user["impressions"],
        "created_at": user["created_at"],
        "updated_at": user["updated_at"]
    }
def searchUsersResponseEntity(user) -> dict:
    return {
        "id": str(user["_id"]),
        "firstName": user["firstName"],
        "lastName": user["lastName"],
        "picturePath": user["picturePath"],
    }


def embeddedUserResponse(user) -> dict:
    return {
        "id": str(user["_id"]),
        "firstName": user["firstName"],
        "email": user["email"],
        "picturePath": user["picturePath"]
    }
    
def userFriendsResponse(user) -> dict:
    return {
        "friends": list(user["friends"])
    }

def userFriendResponse(user) -> dict:
    return {
        "id": str(user["_id"]),
        "firstName": user["firstName"],
        "lastName": user["lastName"],
        "location": user["location"],
        "occupation": user["occupation"],
        "picturePath": user["picturePath"]
    }


def userListEntity(users) -> list:
    return [userEntity(user) for user in users]

def postResponseEntity(post) -> dict:
    return {
        "id": str(post["_id"]),
        "user_id": str(post["user_id"]),
        "firstName": str(post["firstName"]),
        "lastName": post["lastName"],
        "location": post["location"],
        "description": post["description"],
        "userPicturePath": post["userPicturePath"],
        "picturePath": post["picturePath"],
        "likes": list(post["likes"]),
        "comments": list(post["comments"]),
        "created_at": post["created_at"]
    }

# aby to działo musze wyjebac wszystkie rekordy z bazy danych i odpalić ponownie. Pozdro 600