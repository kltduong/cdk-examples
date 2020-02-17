import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');

export class EC2BasicsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create new VPC
    const vpc = new ec2.Vpc(this, 'VPC');

    // Open port 22 for SSH connection from anywhere
    const mySecurityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      securityGroupName: "my-test-sg",
      description: 'Allow ssh access to ec2 instances from anywhere',
      allowAllOutbound: true 
    });
    mySecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow public ssh access')

    // We are using the latest AMAZON LINUX AMI
    const awsAMI = new ec2.AmazonLinuxImage({generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2});

    // We define instance details here
    const ec2Instance = new ec2.Instance(this, 'Instance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO),
      machineImage: awsAMI,
      securityGroup: mySecurityGroup
    });
  }
}

const app = new cdk.App();
new EC2BasicsStack(app, "EC2BasicsStack", {
    env: {
        region: process.env.AWS_REGION,
        account: process.env.ACCOUNT_ID
    }
});