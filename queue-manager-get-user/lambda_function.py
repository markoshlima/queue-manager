import json
import os
from datetime import datetime
from utils import utils
from utils import dynamodbutils
from utils import ssmutils

def lambda_handler(event, context):
    
    customer_id = ''
    
    #verify if token is in header
    if not 'Authorization' in event['headers'] or not event['headers']['Authorization']:
        return response('Token invalido', 400)
    
    #decode token
    try:
        token = event['headers']['Authorization'].split()
        if not (token[0].lower() == 'bearer' and token[1]):
            raise Exception('Unauthorized')
            
        token_decoded = utils.jwt_decode(token[1], ssmutils.get_parameter_store('TOKEN_KEY'))
        customer_id = token_decoded['inf']['email']

    except Exception as e:
      print(e)
      raise Exception('Unauthorized')
      
    #get customer  
    customer = get_pre_customer(customer_id)
    if not customer:
        return response('Usuario invalido', 400)
    
    #remove password
    customer.pop('password', None)

    return utils.response(customer, 200)

def response(message, status_code):
    return utils.response({"message":message}, status_code)
    
def get_pre_customer(id):
    return dynamodbutils.get_item(os.environ['TABLE_NAME'], {'email': id})
    