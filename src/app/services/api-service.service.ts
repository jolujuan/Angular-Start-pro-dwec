import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, from, map, mergeMap, toArray } from 'rxjs';
import { IArtwork } from '../interfaces/i-artwork';

const url = `https://api.artic.edu/api/v1/artworks`;

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  public datos:IArtwork[]=[];

  artworksSubject: Subject<IArtwork[]> = new Subject();

  constructor(private http: HttpClient) { }

  /* Realizar la peticion, transformar los datos a data, se suscribe al observable y devuelve el subject*/
  public getArtWorks(): Observable<IArtwork[]> {
    this.http.get<{ data: IArtwork[] }>(url).pipe(
      map(response => response.data)
    ).subscribe((artworks) => {
      this.artworksSubject.next(artworks);
    }
    );
    return this.artworksSubject;
  }

  public getArtworksFromIDs(artworkList: string[]): Observable<IArtwork[]>{
    from(artworkList).pipe(
      mergeMap(artwork_id =>{
        return  this.http.get<{ data: IArtwork[] }>(`${url}/${artwork_id}`).pipe(
          map(response => response.data)
        )
      }),
      toArray()
    ).subscribe(artworks => this.artworksSubject.next(artworks.flat()))

    return this.artworksSubject;
  }

  public filterArtWorks(filter: string): void {
    this.http.get<{ data: IArtwork[] }>(`${url}/search?q=${filter}&fields=id,description,title,image_id`).pipe(
      map(response => response.data)
    ).subscribe((artworks) => {
      this.artworksSubject.next(artworks);
    }
    );
  }

}
