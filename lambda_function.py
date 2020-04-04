import json
import boto3
import os
import re
from utils import utils
from utils import dynamodbutils

def lambda_handler(event, context):

    customer = json.loads(event['body'])
    
    print('payload validation')
    
    #validate name
    if 'name' not in customer or not customer['name']:
        return response('Digite o nome!', 400)
        
    #validate maximum qtd caracteres in name
    if (len(customer['name']) > int(os.environ['MAXIMUM_QTD_NAME'])):
        return response('Nome nao pode conter mais que '+os.environ['MAXIMUM_QTD_NAME']+' caracteres!', 400)
        
    #validade e-mail
    if 'email' not in customer or not customer['email']:
        return response('Digite o e-mail!', 400)
        
    #validate passord equals
    if 'password' not in customer or 'password2' not in customer or not customer['password'] or not customer['password2']:
        return response('Informe a senha!', 400)
        
    #validate passord equals
    if customer['password'] != customer['password2']:
        return response('Senhas nao correspondem!', 400)    
    
    #validate password strong
    if not valid_strong_password(customer['password']):
        return response('Senha nao atende os criterios minimos de seguranca!', 400)  
    
    #validate valid e-mail
    if not valid_email(customer['email']):
        return response('E-mail invalido!', 400)  
    
    #validate email already registered
    print('validate email already registered')
    user = get_customer(customer['email'])
    if user:
        return response('E-mail ja registrado', 400)
    
    #remove password2
    print('deleting password confirm')
    customer.pop('password2', None)
    
    #encripty password (md5+base64(utf-8))
    print('encoding password')
    customer['password'] = utils.encode_password(customer['password'])
    
    #send-info-to-sqs
    print('sending to sqs')
    send_to_sqs(customer)
    
    return response('ok', 200)

def response(message, status_code):
    return utils.response({"message":message}, status_code)
    
def send_to_sqs(message):
    sqs_client = boto3.client('sqs') 
    url = os.environ['CREATE_PRE_CUSTOMER_SQS']
    msg = sqs_client.send_message(QueueUrl=url, MessageBody=json.dumps(message))
    
def valid_email(email):
    regex = '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'
    if(re.search(regex,email)):  
        return True
    else:  
        return False
        
def valid_strong_password(password):
    #check mininum caracteres
    if (len(password) < int(os.environ['MINIMUM_QTD_PASSWORD'])):
        return False
        
    #check maximum caracteres
    if (len(password) > int(os.environ['MAXIMUM_QTD_PASSWORD'])):
        return False
    
    #check there are letters
    if not re.search('[a-zA-Z]', password):
        return False
    
    #check there are number
    if not re.search('[0-9]', password):
        return False
        
    return True

def get_customer(email):
    return dynamodbutils.get_item(os.environ['TABLE_NAME_CUSTOMER'], {'email': email})