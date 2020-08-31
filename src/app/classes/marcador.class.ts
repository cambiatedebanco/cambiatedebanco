export class Marcador{
    public lat: number;
    public lng: number;

    public title: string;
    public direccion: string;
    public estado: string;
    

    constructor (lat: number, lng: number, title: string, direccion : string,estado : string){
        this.lat=lat;
        this.lng= lng;
        this.title= title;
        this.direccion= direccion;
        this.estado= estado;
    }

}