import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityDetailComponent } from './city-detail.component';

describe('CityDetailComponent', () => {
  let component: CityDetailComponent;
  let fixture: ComponentFixture<CityDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CityDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
