import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListComponent} from './list/list.component';
import {AdvertsRoutingModule} from './adverts-routing.module';
import {FormComponent} from './form/form.component';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSelectModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {DialogComponent} from './dialog/dialog.component';
import {CardComponent} from './card/card.component';
import {FilterComponent} from './filter/filter.component';
import {MatCarouselModule} from '@ngmodule/material-carousel';
import {EditComponent} from './edit/edit.component';
import { CreateComponent } from './create/create.component';


@NgModule({
  declarations: [ListComponent, FormComponent, DialogComponent, CardComponent, FilterComponent, EditComponent, CreateComponent],
  imports: [
    CommonModule,
    AdvertsRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    MatCarouselModule
  ],
  exports: [
    ListComponent
  ],
  entryComponents: [
    DialogComponent,
    EditComponent
  ]
})
export class AdvertsModule {
}
