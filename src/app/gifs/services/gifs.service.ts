import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private apiKeyGiphy: string = 'qfQAfTKKV73lq7hzXHkZ1qngrBt7Rb74';
  private servicioURL : string = 'https://api.giphy.com/v1/gifs'
  private _historial: string[] = [];

  // TODO: cambiar any por su tipo
  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    // this._historial = localStorage.getItem('historial');
    // this._historial = JSON.parse(localStorage.getItem('historial')!);
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  buscarGifs(query: string = '') {
    // aquí también podemos validar si no ingresamos nada al buscador no agregue nada.
    // if (query.trim().length == 0) {
    //   return;
    // }
    query = query.trim().toLowerCase();
    // este if valida que si es que el valor ingresado en query no está incluido en _historial, solo en ese caso que inserte un nuevo elemento.
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);
      // la línea de arriba valida que el arreglo de string llamado _historial no exceda el tamaño de 10 elementos.

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKeyGiphy)
      .set('limit', '10')
      .set('q', query);

    this.http
      .get<SearchGifsResponse>(
        `${this.servicioURL}/search`, { params }
      )
      .subscribe((resp) => {
        // console.log(resp.data);
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });
  }
}
