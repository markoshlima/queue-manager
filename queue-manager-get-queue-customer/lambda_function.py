import json
from utils import utils
from utils import ssmutils
from utils import mysqlutils
from datetime import datetime

def lambda_handler(event, context):
    
    #get customer (user_id) from token
    token = get_token_from_headers(event['headers'])
    token_decoded = utils.jwt_decode(token, ssmutils.get_parameter_store('TOKEN_KEY'))
    user_id = token_decoded['inf']['uuid']
    
    #set queue_id if exists, to bring an especific queue
    queue_id = False
    if event['pathParameters'] != None and 'id' in event['pathParameters']:
        queue_id = event['pathParameters']['id']
        print('queue_id: '+queue_id)
    
    #get queues
    conn_mysql = connection()
    queues = get_user_queue(conn_mysql, user_id, queue_id)
    
    #if the request is trying to get an especific queue, but the query not find, so its 404 (not found)
    if not queues and queue_id:
        return response('Not Found', 404)
    else:
        return utils.response(queues, 200)

def connection():
    return mysqlutils.connection(ssmutils.get_parameter_store('MYSQL_HOST'), 
                                 ssmutils.get_parameter_store('MYSQL_USER'), 
                                 ssmutils.get_parameter_store('MYSQL_PASSWORD'), 
                                 ssmutils.get_parameter_store('MYSQL_DATABASE'))
                              
#get queues from user                              
def get_user_queue(conn, user_id, queue_id):
    sql = "SELECT * FROM queue WHERE id_user = '"+user_id+"'"
    #if exists an id to bring an especific queue
    if queue_id:
        sql += " AND id_queue = '"+queue_id+"'"
    
    rows = mysqlutils.execute(conn, sql, False)
    return parse_queue(rows)

#parse data from mysql to json    
def parse_queue(rows):
    list = []
    if len(rows) > 0:
       for row in rows:
           item = {
               "id_queue":row[0],
               "name":row[1],
               "text_queue":row[2],
               "end_queue":row[3],
               "logo":row[4],
               "date_register":str(row[5]),
               "id_user":row[6]
           }
           list.append(item)
    return list
    
def get_token_from_headers(headers):
    token = headers['Authorization']
    token = token.split()
    return token[1]
    
def response(message, status_code):
    return utils.response({"message":message}, status_code)