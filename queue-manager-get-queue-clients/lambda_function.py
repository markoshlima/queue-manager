import json
from daoredis import daoredis
from utils import ssmutils
from utils import mysqlutils
from utils import utils
import operator

def lambda_handler(event, context):

    queue = event['pathParameters']['id']

    #verify if this list belongs to this user
    token = get_token_from_headers(event['headers'])
    token_decoded = utils.jwt_decode(token, ssmutils.get_parameter_store('TOKEN_KEY'))
    conn = connection()
    if not verify_user_queue(conn, token_decoded['inf']['uuid'], queue):
        conn.close()
        return response('Fila invalida!', 400)
    
    #connecting to redis
    conn = daoredis.connection(ssmutils.get_parameter_store('REDIS_HOST'))
    
    #get clients from queue
    clients = daoredis.get_all_queue(conn, queue)
    
    #transform string position into integer position, after sort by position
    if clients:
        list = []
        for client in clients:
            client["pos"] = int(client["pos"])
            list.append(client)
        list.sort(key=operator.itemgetter("pos"))
        clients = list
    
    return utils.response(clients, 200)

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

def get_token_from_headers(headers):
    token = headers['Authorization']
    token = token.split()
    return token[1]
    
def response(message, status_code):
    return utils.response({"message":message}, status_code)