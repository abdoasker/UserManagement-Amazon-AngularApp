import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLogins } from './user-logins';

describe('UserLogins', () => {
  let component: UserLogins;
  let fixture: ComponentFixture<UserLogins>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLogins]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLogins);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
