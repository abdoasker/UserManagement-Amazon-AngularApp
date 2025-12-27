import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesActivities } from './roles-activities';

describe('RolesActivities', () => {
  let component: RolesActivities;
  let fixture: ComponentFixture<RolesActivities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesActivities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesActivities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
