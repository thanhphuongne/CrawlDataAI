import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeatureCheckService {
  private configData = environment.packageConfig;

  /**
   * Check feature allow show or not. Return true if package not restricted
   * @param feature string, feature key
   * @param packageKey string, package key
   * @returns boolean
   */
  checkFeature(feature: string, packageKey: string): boolean {
    const listRestrict = this.configData.find(
      (item: any) => item.package === packageKey
    )?.restrictFeatures;
    return !listRestrict?.includes(feature);
  }
}
