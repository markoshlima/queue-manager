import json
import os
from datetime import datetime
from utils import utils
from utils import dynamodbutils
from utils import ssmutils

def lambda_handler(event, context):
    
    payload = json.loads(event['body'])
    
    if 'token' not in payload or not payload['token']:
        return response('Token invalido', 400)
    
    token = payload['token']

    #verify token
    try:
      result = utils.jwt_decode(token, ssmutils.get_parameter_store('TOKEN_KEY'))
    except Exception as e:
      #token expired/invalid
      print(e)
      return response('Token invalido', 400)
    else:
      customer = get_pre_customer(result['inf']['uuid'])
      if not customer:
        return response('Token invalido', 400)
      customer = customer['precustomer']
      print(customer)
      
      #add to customer
      save_customer(customer, result['inf']['uuid'])
      
      #remove from pre-customer
      delete_pre_customer(result['inf']['uuid'])
      
      return response('Conta validada', 200)

def response(message, status_code):
    return utils.response({"message":message}, status_code)
    
def get_pre_customer(id):
    return dynamodbutils.get_item(os.environ['TABLE_NAME'], {'UUID': id})
      
def save_customer(payload, id):
    item = {
              "email":payload['email'],
              "UUID":id,
              "name":payload['name'],
              "password":payload['password'],
              "date_register":payload['date_register'],
              'date_validate':str(datetime.now())
            }
    dynamodbutils.put_item(os.environ['TABLE_NAME_CUSTOMER'], item)
        
def delete_pre_customer(id):
    dynamodbutils.delete_item(os.environ['TABLE_NAME'], {'UUID': id})