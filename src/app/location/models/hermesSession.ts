export class HermesSession {
  iUserId: number;
  iSessionId: number;
  iAccountId: number;


  constructor(iUserId: number, iSessionId: number, iAccountId: number) {
    this.iUserId = iUserId;
    this.iSessionId = iSessionId;
    this.iAccountId = iAccountId;
  }
}
