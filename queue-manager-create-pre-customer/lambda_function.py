import json
import boto3
import os
import uuid
from datetime import datetime
from utils import utils
from utils import dynamodbutils
from utils import ssmutils

def lambda_handler(event, context):

    urlValidacao = 'http://d30b9dqnme0qm0.cloudfront.net/validate/'

    customer = json.loads(event['Records'][0]['body'])
    
    #generating uuid
    id = str(uuid.uuid1())
    print('uuid: '+id)
    
    #generate token
    expiration = 3600 * 24 #one day
    token = utils.jwt_encode({'uuid':id}, ssmutils.get_parameter_store('TOKEN_KEY'), expiration)
    customer['token'] = str(token, "utf-8")
    
    #set date
    customer['date_register'] = str(datetime.now())
    
    #save-dynamo-db: pre-customer
    save_pre_customer(customer, id)
    
    #send-email
    email = {
        "emailTo":customer['email'],
        "subject":"Validação da conta",
        "html":customer['name']+", bem vindo ao sistema de filas.<br />Clique no link para validar a conta: <a href='"+urlValidacao+customer['token']+"'>Validar</a>"
    }
    send_to_sqs(email)

def save_pre_customer(payload, id):
    item = {
                "UUID":id,
                "precustomer":payload
            }
    dynamodbutils.put_item(os.environ['TABLE_NAME'], item)
    
def send_to_sqs(message):
    sqs_client = boto3.client('sqs') 
    url = os.environ['EMAIL_SENDER']
    msg = sqs_client.send_message(QueueUrl=url, MessageBody=json.dumps(message))