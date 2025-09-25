import { Injectable } from '@angular/core';
import { UserService } from '@app/open-api/services';


@Injectable({
  providedIn: 'root'
})
export class AccountProfileService {
  constructor(
    private services: UserService,
  ) {}
  /**
   * Get user by id
   * @param userId number, id of user
   * @returns obserable
   */
  getUserById() {
    return this.services.usersMeGet();
  }
}
