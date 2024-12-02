import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import {
  HostedZone,
  IHostedZone,
  MxRecord,
  TxtRecord,
} from 'aws-cdk-lib/aws-route53';
import { EmailIdentity, Identity } from 'aws-cdk-lib/aws-ses';
import { Construct } from 'constructs';
import { domain, hostedZoneId, ocrEmailDomain } from '../helpers/constants';

export class Route53Stack extends Stack {
  public readonly zone: IHostedZone;
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: hostedZoneId,
      zoneName: domain,
    });

    // Create the MX record for the subdomain
    new MxRecord(this, 'OcrEmailMxRecord', {
      zone: hostedZone,
      recordName: ocrEmailDomain,
      values: [
        {
          priority: 10,
          hostName: `inbound-smtp.${this.region}.amazonaws.com`,
        },
      ],
      ttl: Duration.minutes(5),
    });

    // Check if SES Email Identity already exists for the subdomain
    const existingEmailIdentity = EmailIdentity.fromEmailIdentityName(
      this,
      'OcrExistingEmailIdentity',
      ocrEmailDomain
    );

    if (!existingEmailIdentity) {
      // Verify domain name for sending emails
      const emailIdentity = new EmailIdentity(this, 'OcrEmailIdentity', {
        identity: Identity.publicHostedZone(hostedZone),
        mailFromDomain: ocrEmailDomain,
      });

      // Add DKIM records to the hosted zone
      emailIdentity.dkimRecords.forEach((record, index) => {
        new TxtRecord(this, `OcrEmailDkimRecord${index}`, {
          zone: hostedZone,
          recordName: record.name,
          values: [record.value],
        });
      });
    }

    this.zone = hostedZone;
  }
}
