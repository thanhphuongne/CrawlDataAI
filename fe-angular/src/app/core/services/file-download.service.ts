import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { escapeCSVValue } from '@app/shared/utils/security.utils';
import { capitalizeFirstLetter } from '@app/shared/utils/string.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileDownloadService {
  constructor(private http: HttpClient) {}

  /**
   * download file with report progress and save dialog.
   *
   * @param url string
   * @param fileName string
   *
   * @return Observable contains progress by percent
   *
   */
  downloadFile(url: string, fileName: string): Observable<number> {
    return new Observable(observer => {
      this.requestDownload(url).subscribe((event: HttpEvent<Blob>) => {
        if (event.type === HttpEventType.DownloadProgress) {
          const percentDone = Math.round((100 * event.loaded) / event.total);
          observer.next(percentDone);
        }
        if (event.type === HttpEventType.Response) {
          this.saveDownloadResult(event.body, fileName);
          observer.complete();
        }
      });
    });
  }

  exportCsvFile(data: any[], fileName: string, isAddNo: boolean = true): void {
    if (data && data.length > 0) {
      let str: string = isAddNo ? 'No.,' : '';
      str +=
        `${Object.keys(data[0])
          .map(value => `"${capitalizeFirstLetter(value)}"`)
          .join(',')}` + '\r\n';
      let count = 1;
      const csvContent = data.reduce((file: string, next: string) => {
        file +=
          `${isAddNo ? count + ',' : ''}${Object.values(next)
            .map(value => escapeCSVValue(value))
            .join(',')}` + '\r\n';
        count++;
        return file;
      }, str);

      const blob = new Blob(['\uFEFF' + csvContent], {
        type: 'text/csv;charset=UTF-18'
      });
      this.saveDownloadResult(blob, fileName);
    }
  }

  private saveDownloadResult(blob: Blob, fileName: string) {
    if (window?.navigator['msSaveOrOpenBlob']) {
      window.navigator['msSaveOrOpenBlob'](blob, fileName);
    } else {
      const windowURL = window.URL || window['webkitURL'];
      const downloadLink = document.createElement('a');
      const urlBlob = windowURL.createObjectURL(
        new Blob([blob], { type: 'text/plain;charset=UTF-8' })
      );
      downloadLink.href = urlBlob;
      downloadLink.download = fileName;
      downloadLink.click();
      setTimeout(() => {
        URL.revokeObjectURL(downloadLink.href);
      }, 4e4);
    }
  }

  private requestDownload(url: string): Observable<HttpEvent<Blob>> {
    return this.http.get(url, {
      responseType: 'blob',
      reportProgress: true,
      observe: 'events'
    });
  }
}
