import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@core/core.module';
import { DbModule } from 'src/app/platform/supabase/db.module';
import { ReadService } from 'src/app/platform/supabase/read.service';
import { TagListComponent } from '@post/tag-list/tag-list.component';
import { MarkdownModule} from 'ngx-markdown';
import { LeftnavComponent } from './leftnav.component';

describe('LeftnavComponent', () => {
  let component: LeftnavComponent;
  let fixture: ComponentFixture<LeftnavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeftnavComponent, TagListComponent],
      imports: [CoreModule, DbModule, MarkdownModule.forRoot(), RouterModule.forRoot([])],
      providers: [ReadService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
