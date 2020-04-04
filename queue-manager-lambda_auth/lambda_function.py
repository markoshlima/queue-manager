import json
import os
from utils import utils
from utils import ssmutils

def lambda_handler(event, context):
    
    if not 'authorizationToken' in event or not event['authorizationToken']:
        return 'Unauthorized'
    
    try:
        token = event['authorizationToken'].split()
        if not (token[0].lower() == 'bearer' and token[1]):
            raise Exception('Unauthorized')
            
        token_decoded = utils.jwt_decode(token[1], ssmutils.get_parameter_store('TOKEN_KEY'))
        policy = generate_policy(token_decoded['inf']['uuid'], 'Allow', event['methodArn'])
        return policy
        
    except Exception as e:
      print(e)
      raise Exception('Unauthorized')

def generate_policy(principal_id, effect, resource):
    return {
        'principalId': principal_id,
        'policyDocument': {
            'Version': '2012-10-17',
            'Statement': [
                {
                    "Action": "execute-api:Invoke",
                    "Effect": effect,
                    "Resource": resource

                }
            ]
        }
    }
    