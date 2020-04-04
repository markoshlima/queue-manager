# **Introduction**

Queue Manager is a system to manage queues as the name implies, aimed at users who want to perform queue control for bars, restaurants, nightclubs and so on. Below are images of some screens of the system in operation.

![alt text](https://github.com/markoshlima/queue-manager/blob/master/docs/UI/UI.png?raw=true)

# **Infraestructure Architecture**

![alt text](https://github.com/markoshlima/queue-manager/blob/master/docs/Architecture%20Infraestructure/Architecture%20Infraestructure.png?raw=true)

All resources is inside a VPC in sa-east-1 (São Paulo) region.
Route Table to route trafic between public and private using a NAT Instance.
Two private and two public subnet in two distinct availibility zones for high disponibility.
In private subnets there are private servers such as storages and functions.
In public subnets there are public servers such as Nat Instance and Bastion Host.

# **Application Component Architecture**

![](https://github.com/markoshlima/queue-manager/blob/master/docs/Architecture%20Application/Architecture%20Application.png?raw=true)

All requests for the system, is behing a Content Delivery Network (Cloudfront), to serve low latency and security for static and dynamic content.

Apresentation Layer
For client frontend, it is using React, and for Backoffice frontend it is Angular 6, both hosted in S3 bucket.

All Lambda requests is behind an API Proxy, using API Gateway, and RestFul best practices. There is an interceptor authenticator (JWT)  written in Python using Lambda Function for private requests.

Application Layer
All backend application is in Lambda Functions written in Python, except the Mailer function, that is written in NodeJS.
The user and e-mailing intelligence is event driven architecture, using SQS.
All Lambda functions are distribuited from two availibility zones for high disponibility.

Storage Layer
DynamoDB: For store user information, the structure need to be flexible and elastic. 
RDS (MySQL): It is for store data about queue and client persistent information, large queries and unions is required.
ElastiCache (Redis): It is using for delivery client and position information, low latency and high throughput is required.

# **Microservice Architecture**

//TODO

# **Logging and Monitoring**

![alt text](https://github.com/markoshlima/queue-manager/blob/master/docs/Logging%20and%20Monitoring/Logging%20and%20Monitoring.png?raw=true)

Databases:
For MySQL and Redis databases, all metrics is sending (for default) to CloudWatch Metrics. These metrics above are monitored in 
CloudWatch Alarms.

RDS
CPUUtilization, DatabaseConnections, FreeStorageSpace, ReadIOPS, WriteIOPS

Elasticache
CPUUtilization, Evictions, CacheMisses.

If some metric overcome the max values, a notification is sent to SNS, in witch will notify an user.

Apart these itens, the user can get metric data for every service from AWS in use.

Events:
All events is using SQS, but if an event can't be released to next microservice, this event will be sent to a dead letter queue (after three times of threshould). An topic from SNS subscribed to these dead letter queues, will notify an user.

App Functions:
CloudWatch Logs capture all logs from Lambda Functions. All these functions is subscribed to ElasticSearch, that send these logs through an other Lambda Function. Kibana is avalaible for data visualization, user can troubleshooting through this tool.

# **Pricing**

All resources were priced in AWS Calculator, the following link, the final price of this architecture, excluding Lambda, SQS, S3 and Cloudfront services, because it is Free Tier Elegible or the value is low to input in this pricing cotation.

[Click here for Pricing Project](https://calculator.aws/#/estimate?id=f70d36f06b2fdf3ca7f7ec01bea62f5dcb0f3e9c)