import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@core/core.module';
import { AuthService } from 'src/app/platform/supabase/auth.service';
import { DbModule } from 'src/app/platform/supabase/db.module';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        CoreModule,
        DbModule,
        MarkdownModule.forRoot(),
        RouterModule.forRoot([])
      ],
      providers: [AuthService, MarkdownService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
