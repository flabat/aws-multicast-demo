# AWS Transit Gateway Multicast Demo

This demo uses an environment in the AWS us-east-1 region containing the following resources:

* A VPC with public and private subnets across three AZs.
* A Linux Bastion Host, accessible using SSM Session Manager and to be used as the multicast traffic source.
* An AutoScaling Group with 3 instances, accessible using SSM Session Manager and to be used as the multicast traffic receivers.
* A Transit Gateway with Multicast support.
  
## Requirements

* [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)
* [Git Client](https://git-scm.com/)
* [Existing AWS Account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)
  
## Getting started

From your terminal run the following commands:

```bash
git clone https://github.com/flabat/aws-multicast-demo.git
cd aws-multicast-demo
npm install
cdk deploy
```

Confirm the deployment changes.

CDK will deploy the VPC and instances to your AWS account in the us-east-1 region, the process will take about 10-20 minutes.

## Create a Transit Gateway with Multicast Support

Go to the VPC console, Transit Gateways, and click [Create Transit Gateway](https://console.aws.amazon.com/vpc/home?region=us-east-1#CreateTransitGateway:). Enter a **Name Tag** and **Description**. Select **Multicast Support**.

![CreateTransitGateway](img/CreateTransitGateway.gif)

## Create a Transit Gateway Attachment to the Demo VPC

Go the VPC console, Transit Gateway Attachments and click [Create Transit Gateway Attachment](https://console.aws.amazon.com/vpc/home?region=us-east-1#CreateTgwAttachment:). Select the Transit Gateway you created in the previous step, VPC as the **Attachment Type**, fill **Attachment name tag**, in the **VPC ID** dropdown select the McdemoCdkStack/VPC. Select the two Private Subnets. Click **Create Attachment**.

![CreateTransitGatewayAttachment](img/CreateTransitGatewayAttachment.gif)

## Create a Transit Gateway Multicast Domain

Go to the VPC console, Transit Gateway Multicast Domains and click [Create Transit Gateway multicast domain](https://console.aws.amazon.com/vpc/home?region=us-east-1#CreateTransitGatewayMulticastDomain:). Fill the Name tag and select the Transit Gateway you created above. Click **Create Transit Gateway multicast domain**.

![CreateTransitGatewayDomain](img/CreateTransitGatewayDomain.gif)

## Associate the subnets to the multicast domain

Select the domain you created above, open the **Associations** tab and click **Create Association**. Choose the attachment to associate and select the two private subnets. Click **Create Association**. 

![CreateDomainAssociation](img/CreateDomainAssociation.gif)

## Add a multicast source

Go to the EC2 console and take a note of the Bastion Host instance ID, we'll need the ID to identify the ENI we are adding as a multicast domain source.
TODO

## Add multicast members

Go to the EC2 console and take a note of the ASG instance IDs, we'll need the IDs to identify the ENIs we are adding as multicast domain destinations.
TODO

## Test using iperf

TODO

## Test using omping

TODO

## Test using Python sender and receiver scripts

TODO
