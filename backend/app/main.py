from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import Union
from .config import settings
from .routers import auth, user, post

# from loguru import logger
import boto3


app = FastAPI()

origins = [
        # "https://socialmedium.life", 
           "http://127.0.0.1:3000",
           "https://socialmedium-frontend.herokuapp.com",
           "https://fe.socialmedium.life",
           "https://main--cerulean-kangaroo-395de2.netlify.app",
           "http://main--cerulean-kangaroo-395de2.netlify.app",
           ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # expose_headers=["set-cookie"]
)

# 
app.include_router(auth.router, tags=['Auth'], prefix='/auth')
app.include_router(user.router, tags=['Users'], prefix='/users')
app.include_router(post.router, tags=['Posts'], prefix='/posts')

AWS_BUCKET = 'socialmedium'

# s3 = 
# bucket = s3.Bucket(AWS_BUCKET)

# async def s3_upload(contents: bytes, key: str):
#     logger.info(f'Uploading {key} to s3')
#     bucket.put_object(Key=key, Body=contents)


@app.get('/images/{user_id}/{picture_name}', response_class= FileResponse)
async def main(user_id: str, picture_name: str):
    return FileResponse(f'./images/{user_id}/{picture_name}')

@app.get("/api/healthchecker")
def root():
    return {"message": "Welcome to FastAPI with MongoDB"}

# @app.post('/examples3')
# async def upload(file: UploadFile = File(default=None)):
#     contents = await file.read()
    
#     await s3_upload(contents=contents, key=f'{file.filename}')
    
#     return {"status": 'ok'}