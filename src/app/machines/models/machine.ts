export class Machine {
  dLocLati: number;
  dLocLongi: number;
  iVehId: number;
  ville: string;
  codePostal: string;
  
  matRef: string;
  matLibelle: string;
  cliRef: string;
  codeProprietaire: string;
  catProprietaire: string;
  matImatriculation: string;
  matChauffeur: string;
  matNumSerie: string;
  matPTAC: string;
  matLongueur: string;
  matLargeur: string;
  matHauteur: string;
  matPoids: string;
  remarque: string;
  matChauffeurTel: string;


  constructor(iVehId: number, ville: string, dLocLati: number, dLocLongi: number) {
    this.dLocLati = dLocLati;
    this.dLocLongi = dLocLongi;
    this.iVehId = iVehId;
    this.ville = ville;
  }
}
