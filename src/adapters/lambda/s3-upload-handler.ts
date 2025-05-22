import path from 'path';
import { Context, S3CreateEvent } from 'aws-lambda';

import config from '@config/environment';
import { messageProducerFactory } from '@core/factories/index';
import { SendImageProcessingMessageCommand } from '@ports/input/TaskProcessing';

let command: SendImageProcessingMessageCommand | null = null;

export const handler = async (event: S3CreateEvent, context: Context) => {
  console.log('Lambda function invoked with event:', JSON.stringify(event));
  console.log('Lambda execution environment:', {
    awsRequestId: context.awsRequestId,
    logGroupName: context.logGroupName,
    logStreamName: context.logStreamName,
    functionName: context.functionName,
    memoryLimitInMB: context.memoryLimitInMB,
    env: process.env
  });

  const correlationId = context.awsRequestId;

  if (!event.Records || event.Records.length === 0) {
    console.warn('No records found in event', { correlationId });
    return { 
      statusCode: 200,
      body: JSON.stringify({ message: 'No records to process' }) 
    };
  }
  
  if (!command) {
    console.log('Initializing message producer');
    try {
      command = await messageProducerFactory(config);
      console.log('Message producer initialized successfully');
    } catch (error) {
      console.error('Failed to initialize message producer:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to initialize message producer' })
      };
    }
  }

  try {
    const { Records } = event;

    const fileKeys = Records.map((record) => record.s3.object.key);

    console.info(`Processing ${fileKeys.length} files`, { correlationId, fileKeys });

    await Promise.all(
      fileKeys.map(async (fileKey) => {
        return command?.execute(fileKey, path.basename(fileKey));
      })
    );
  } catch (error) {
    console.error('Error processing S3 event:', {
      correlationId,
      error: error instanceof Error ? error.message : String(error),
      stackTrace: error instanceof Error ? error.stack : undefined
    });
    throw new Error('Failed to send messages to broker');
  }
}
