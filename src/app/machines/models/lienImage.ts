export class LienImage {
    idDb: number;
    code: string;
    lienImage: string;    
    dateUpload: Date;

    constructor(idDb: number, code: string, lienImage: string, dateUpload: Date) {
      this.idDb = idDb;
      this.code = code;
      this.lienImage = lienImage;
      this.dateUpload = dateUpload;
    }
  }