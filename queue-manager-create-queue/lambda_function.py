import json
import uuid
import os
from datetime import datetime
from utils import utils
from utils import mysqlutils
from utils import ssmutils

def lambda_handler(event, context):

    #get body and token (Bearer)
    queue = json.loads(event['body'])
    token = get_token_from_headers(event['headers'])
    
    #validate name
    if 'name' not in queue or not queue['name']:
        return response('Digite o nome da fila!', 400)
        
    #validate maximum qtd caracteres in name
    if (len(queue['name']) > int(os.environ['MAXIMUM_QTD_NAME'])):
        return response('Nome nao pode conter mais que '+os.environ['MAXIMUM_QTD_NAME']+' caracteres!', 400)
        
    #validate maximum qtd caracteres in text and end queue
    if (len(queue['text_queue']) > int(os.environ['MAXIMUM_QTD_TEXT'])):
        return response('Texto da fila nao pode conter mais que '+os.environ['MAXIMUM_QTD_TEXT']+' caracteres!', 400) 
        
    if (len(queue['end_queue']) > int(os.environ['MAXIMUM_QTD_TEXT'])):
        return response('Texto de chamada nao pode conter mais que '+os.environ['MAXIMUM_QTD_TEXT']+' caracteres!', 400) 
        
    #decode jwt and id_user
    token_decoded = utils.jwt_decode(token, ssmutils.get_parameter_store('TOKEN_KEY'))
    
    #setting variables
    id_queue = id = str(uuid.uuid1())
    name = queue['name']
    text_queue = queue['text_queue']
    end_queue = queue['end_queue']
    id_user = token_decoded['inf']['uuid']
    
    #connection
    conn = connection()
    
    sql = "INSERT INTO queue(id_queue, name, text_queue, end_queue, date_register, id_user) VALUES ('"+id_queue+"', '"+name+"', '"+text_queue+"', '"+end_queue+"', NOW(),'"+id_user+"')"
    mysqlutils.execute(conn, sql)
    conn.close()
    return response('ok', 200)

def connection():
    return mysqlutils.connection(ssmutils.get_parameter_store('MYSQL_HOST'), 
                                 ssmutils.get_parameter_store('MYSQL_USER'), 
                                 ssmutils.get_parameter_store('MYSQL_PASSWORD'), 
                                 ssmutils.get_parameter_store('MYSQL_DATABASE'))

def response(message, status_code):
    return utils.response({"message":message}, status_code)
    
def get_token_from_headers(headers):
    token = headers['Authorization']
    token = token.split()
    return token[1]
