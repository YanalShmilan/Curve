export interface IResponseEmail {
  accepted: string[];
  rejected: string[];
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: IEnvelope;
  messageId: string;
}

export interface IEnvelope {
  from: string;
  to: string[];
}
