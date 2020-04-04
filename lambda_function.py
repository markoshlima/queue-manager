import json
import os
from time import time
from datetime import datetime
from utils import utils
from utils import dynamodbutils
from utils import ssmutils

def lambda_handler(event, context):

    if 'username' not in event['headers'] or not event['headers']['username']:
        return response('Unauthorized', 401)
        
    if 'password' not in event['headers'] or not event['headers']['password']:
        return response('Unauthorized', 401)    
    
    username = event['headers']['username']
    password = event['headers']['password']
    
    #get from dynamodb: custmer
    customer = get_customer(username)
    if not customer:
        print('user doesnot exists precustomer neither customer')
        return response('Unauthorized', 401)
    else:
        #if user exists, but password wrong
        if customer['password'] != utils.encode_password(password):
            return response('Unauthorized', 401)
        else:
            #generate token
            token_expiration = 3600 * 24 #one day expiration
            token = str(utils.jwt_encode({'email':customer['email'], 'uuid':customer['UUID']}, ssmutils.get_parameter_store('TOKEN_KEY'), token_expiration), "utf-8")
            
            #print login
            log = {
                'login-auth':{
                    'time':str(datetime.now()),
                    'user':username
                }
            }
            print(log)

            #auth ok
            return utils.response({
                "token":token,
                "exp":int((time()))+token_expiration,
                "type":"Bearer"
            }, 200)
    
def get_customer(email):
    return dynamodbutils.get_item(os.environ['TABLE_NAME_CUSTOMER'], {'email': email})
      
def response(message, status_code):
    return utils.response({"message":message}, status_code)
    