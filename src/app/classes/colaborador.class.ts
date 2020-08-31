export class Colaborador{
    public lat: number;
    public lng: number;

    public nombre: string;
    public descripcion: string;

    constructor (lat: number, lng: number, nombre: string){
        this.lat=lat;
        this.lng= lng;
        this.nombre= nombre;
    }

}