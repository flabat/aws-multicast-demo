import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import autoscaling = require('@aws-cdk/aws-autoscaling');
import iam = require('@aws-cdk/aws-iam');
import { BastionHostLinux, SubnetType, AmazonLinuxGeneration } from '@aws-cdk/aws-ec2';

export class McdemoCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 3, cidr: '10.99.0.0/16'});

    const bastionhost = new ec2.BastionHostLinux(this, 'MCBastionHost', {vpc: vpc});
    bastionhost.instance.userData.addCommands(
      'yum update -y',
      'yum update -y tmux',
      'yum install -y omping',
      'yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm',
      'yum install -y iperf',
      'curl -O https://bootstrap.pypa.io/get-pip.py',
      'python get-pip.py',
      'pip install awscli --upgrade',
      'curl https://raw.githubusercontent.com/flabat/aws-multicast-demo/master/scripts/mcreceiver.py -o /opt/mcreceiver.py',
      'curl https://raw.githubusercontent.com/flabat/aws-multicast-demo/master/scripts/mcsender.py -o /opt/mcsender.py',
      '\n',
    );
    
    const asgrole = new iam.Role(this, 'ASGROLE', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
    });

    asgrole.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['ssmmessages:*',
        'ssm:UpdateInstanceInformation',
        'ec2messages:*',
        ] }));

    const asgsg = new ec2.SecurityGroup(this, 'ASGSG', {
      vpc,
    });
    
    asgsg.addIngressRule(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.allTraffic(), 'Open from same SG');

    const asglinux = new autoscaling.AutoScalingGroup(this, 'ASGLINUX', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage({generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2}),
      desiredCapacity: 3,
      role: asgrole,
    });

    asglinux.addSecurityGroup(asgsg);
    bastionhost.instance.addSecurityGroup(asgsg);

    asglinux.userData.addCommands(
      'yum update -y',
      'yum update -y tmux',
      'yum install -y omping',
      'yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm',
      'yum install -y iperf',
      'curl -O https://bootstrap.pypa.io/get-pip.py',
      'python get-pip.py',
      'pip install awscli --upgrade',
      'curl https://raw.githubusercontent.com/flabat/aws-multicast-demo/master/scripts/mcreceiver.py -o /opt/mcreceiver.py',
      'curl https://raw.githubusercontent.com/flabat/aws-multicast-demo/master/scripts/mcsender.py -o /opt/mcsender.py',
      '\n',
    );

  }
}
