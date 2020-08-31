import { HttpHeaders } from '@angular/common/http';

export function getHeaders(user){
    return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + user.ma
        })
      };
}

export function getHeaderStts(user){
  if(user){
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.stsTokenManager.accessToken
      })
    }
  }
  return null;
}

export function capitalizeFirstLetter(word: any){
  return word.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}