import json
import re
import os
import uuid
from datetime import datetime
from utils import utils
from utils import mysqlutils
from utils import ssmutils
from daoredis import daoredis

def lambda_handler(event, context):

    client = json.loads(event['body'])
    token = get_token_from_headers(event['headers'])
    
    #validate payload
    #validate name
    if 'name' not in client or not client['name']:
        return response('Digite o nome!', 400)
        
    #validate maximum qtd caracteres in name
    if (len(client['name']) > int(os.environ['MAXIMUM_QTD_NAME'])):
        return response('Nome nao pode conter mais que '+os.environ['MAXIMUM_QTD_NAME']+' caracteres!', 400)
    
    #verify if email and telephone are not null together    
    if 'email' not in client and 'telephone' not in client:
        return response('Digite e-mail ou telephone!', 400)
    
    if 'email' in client:
        if not valid_email(client['email']):
            return response('E-mail invalido!', 400)  
    
    if 'telephone' in client:
        if (len(client['telephone']) != int(os.environ['MAXIMUM_QTD_TEL'])):
            return response('Telefone invalido!', 400)
    
    #validate queue belong to user
    token_decoded = utils.jwt_decode(token, ssmutils.get_parameter_store('TOKEN_KEY'))
    conn_mysql = connection()
    if not verify_user_queue(conn_mysql, token_decoded['inf']['uuid'], client['queue']):
        conn_mysql.close()
        return response('Fila invalida!', 400)
    
    #generate an uuid for queue client
    client['id_queue_client'] = str(uuid.uuid1())
    
    #set date time in
    client['date_in'] = str(datetime.now())
    
    #write data into mysql
    save_client(conn_mysql, client)
    conn_mysql.close()
    
    #add new client in cache position
    client = {
        'id_client':client['id_queue_client'],
        'name':client['name'],
        'date':client['date_in'], 
        'id_queue':client['queue']
    }
    
    conn = daoredis.connection(ssmutils.get_parameter_store('REDIS_HOST'))
    daoredis.add_client(conn, client)
    
    return response('ok!', 200)
    
def response(message, status_code):
    return utils.response({"message":message}, status_code)
    
def valid_email(email):
    regex = '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'
    if(re.search(regex,email)):  
        return True
    else:  
        return False

def connection():
    return mysqlutils.connection(ssmutils.get_parameter_store('MYSQL_HOST'), 
                                 ssmutils.get_parameter_store('MYSQL_USER'), 
                                 ssmutils.get_parameter_store('MYSQL_PASSWORD'), 
                                 ssmutils.get_parameter_store('MYSQL_DATABASE'))
        
def verify_user_queue(conn, user_id, queue_id):
    sql = "SELECT * FROM queue WHERE id_user = '"+user_id+"' and id_queue = '"+queue_id+"'"
    rows = mysqlutils.execute(conn, sql, False)
    if len(rows) > 0:
       return True
    else:
       return False

def save_client(conn, client):
    sql = "INSERT INTO queue_client(id_queue_client, name, email, telephone, date_in, removed, id_queue) VALUES ('"+client['id_queue_client']+"', '"+client['name']+"', '"+client['email']+"', '"+client['telephone']+"', '"+client['date_in']+"', '0', '"+client['queue']+"')"
    mysqlutils.execute(conn, sql)

def get_token_from_headers(headers):
    token = headers['Authorization']
    token = token.split()
    return token[1]