import { Component } from '@angular/core';

@Component({
  selector: 'app-compine-api',
  templateUrl: './compine-api.component.html'
})
export default class CombineApiStyleGuideComponent {
  filesData: Array<any> = [];
  constructor() {}

  async uploadFiles(files:any) {
    if (files?.target?.files) {
      const data = Array.from(files?.target?.files).map((item: any) => {
        const reader = new FileReader();
        return new Promise(resolve => {
          reader.onload = (event: any) => {
            resolve(JSON.parse(event.target.result));
          };
          reader.readAsText(item);
        });
      });
      const dataRes = await Promise.all(data);
      this.filesData = dataRes;
    } else {
      this.filesData = undefined;
    }
  }

  combineFiles() {
    const result = this.filesData.reduce((prevObj, currentObj) => {
      if (!prevObj) {
        return currentObj;
      } else {
        prevObj.components.schemas = {
          ...prevObj.components.schemas,
          ...currentObj.components.schemas
        };
        prevObj.paths = { ...prevObj.paths, ...currentObj.paths };
        return prevObj;
      }
    }, undefined);

    const a = document.createElement('a');
    const file = new Blob([JSON.stringify(result)], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = 'combine-apis.json';
    a.click();
  }
}
