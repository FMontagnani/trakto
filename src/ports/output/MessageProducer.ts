export interface MessageProducer {
  sendMessage<T>(message: T): Promise<void>;
}
