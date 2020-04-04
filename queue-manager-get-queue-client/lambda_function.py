import json
from utils import utils
from utils import ssmutils
from utils import mysqlutils
from datetime import datetime

def lambda_handler(event, context):
    
    #get id client pathParameter
    client_id = event['pathParameters']['id']
    
    #get client and queue information by this client_id
    conn_mysql = connection()
    resp = get_user_queue(conn_mysql, client_id)
    
    #if do not exists, so not found
    if not resp:
        return utils.response({"message":"Not Found"}, 404)
    else:
        return utils.response(resp, 200)

def connection():
    return mysqlutils.connection(ssmutils.get_parameter_store('MYSQL_HOST'), 
                                 ssmutils.get_parameter_store('MYSQL_USER'), 
                                 ssmutils.get_parameter_store('MYSQL_PASSWORD'), 
                                 ssmutils.get_parameter_store('MYSQL_DATABASE'))
                              
#get queues from user                              
def get_user_queue(conn, client_id):
    sql = "select q.id_queue, q.name as name_queue, q.text_queue, q.end_queue, q.logo,  qc.name, qc.email, qc.telephone, qc.date_in, qc.date_out from queue_client qc, queue q where qc.id_queue = q.id_queue and id_queue_client = '"+client_id+"'"
    rows = mysqlutils.execute(conn, sql, False)
    return parse_queue(rows)

#parse data from mysql to json    
def parse_queue(rows):
    resp = {}
    if len(rows) > 0:
       for row in rows:
           resp = {
               "id_queue":row[0],
               "name_queue":row[1],
               "text_queue":row[2],
               "end_queue":row[3],
               "logo":row[4],
               "name":row[5],
               "email":row[6],
               "telephone":row[7],
               "date_in":str(row[8]),
               "date_out":str(row[9])
           }
    return resp