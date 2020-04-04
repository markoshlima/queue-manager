import json
from daoredis import daoredis
from utils import ssmutils
from utils import utils

def lambda_handler(event, context):

    client = event['pathParameters']['id']
    
    #connecting to redis
    conn = daoredis.connection(ssmutils.get_parameter_store('REDIS_HOST'))
    
    #get client
    resp = daoredis.get_all(conn, "client:"+client)

    if resp:
        return utils.response(resp, 200)
    else:
        return utils.response({"message":"Not Found"}, 404)