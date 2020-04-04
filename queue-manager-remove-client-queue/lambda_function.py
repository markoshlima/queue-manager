import json
from daoredis import daoredis
from utils import ssmutils
from utils import mysqlutils
from utils import utils
from datetime import datetime
import operator

def lambda_handler(event, context):
 
    client = event['pathParameters']['id']

    #verify if this client belongs from this customer (user)
    token = get_token_from_headers(event['headers'])
    token_decoded = utils.jwt_decode(token, ssmutils.get_parameter_store('TOKEN_KEY'))
    conn_mysql = connection()
    if not verify_client_customer(conn_mysql, token_decoded['inf']['uuid'], client):
        conn_mysql.close()
        return response('Cliente invalido!', 400)
    
    #connecting to redis
    conn = daoredis.connection(ssmutils.get_parameter_store('REDIS_HOST'))
    
    #remove client from queue
    clients = daoredis.remove_client(conn, client)
    
    #add date_out in mysql
    update_client(conn_mysql, client)
    conn_mysql.close()

    return response('ok!', 200)

def connection():
    return mysqlutils.connection(ssmutils.get_parameter_store('MYSQL_HOST'), 
                                 ssmutils.get_parameter_store('MYSQL_USER'), 
                                 ssmutils.get_parameter_store('MYSQL_PASSWORD'), 
                                 ssmutils.get_parameter_store('MYSQL_DATABASE'))

#verify if this client if from this customer        
def verify_client_customer(conn, user_id, client):
    sql = "SELECT * FROM queue_client qc, queue q where qc.id_queue = q.id_queue and id_queue_client = '"+client+"' and id_user = '"+user_id+"' and date_out is null"
    rows = mysqlutils.execute(conn, sql, False)
    if len(rows) > 0:
       return True
    else:
       return False

#update date_out, the time when client gets out
def update_client(conn, client):
    sql = "UPDATE queue_client SET date_out = '"+str(datetime.now())+"' WHERE id_queue_client = '"+client+"'"
    rows = mysqlutils.execute(conn, sql, False)
    conn.commit()

def get_token_from_headers(headers):
    token = headers['Authorization']
    token = token.split()
    return token[1]
    
def response(message, status_code):
    return utils.response({"message":message}, status_code)
    
    