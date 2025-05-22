export interface MessageConsumer {
  consumeMessage(): Promise<void>;
}
