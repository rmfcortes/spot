import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormasPagoPage } from './formas-pago.page';

describe('FormasPagoPage', () => {
  let component: FormasPagoPage;
  let fixture: ComponentFixture<FormasPagoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormasPagoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormasPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
