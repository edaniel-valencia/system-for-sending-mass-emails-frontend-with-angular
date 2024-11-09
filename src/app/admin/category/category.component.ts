import { Component, OnInit } from '@angular/core';
import { Category } from '../../interfaces/category';
import { CategoryService } from '../../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from '../../services/error.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {

  listCategory: Category[] = [];

  form: FormGroup
  formUpdate: FormGroup

  MoldaId?: number = 0
  currentModalId: number | null = null;
  currentModalType: 'Create'  | 'Update'  | null = null;

  constructor(
    private _categoryService: CategoryService,
    private toastr: ToastrService,
    private _errorService: ErrorService,
    private fb:  FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
    this.formUpdate = this.fb.group({
      name: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.listCategoryAll();
  }

  listCategoryAll(): void {
    this._categoryService.ReadAll().subscribe(data => {
      this.listCategory = data;
      console.log(data);
    });
  }

  
  ///// CREATE

  Create() {

    if (this.form.invalid) {
      this.toastr.warning('No haz completado todos los campos', 'Alert');
      return;
    }
    const category: Category = {
      Cname: this.form.value.name,
     
    }


    
    this._categoryService.PostCategory(category).subscribe({
      next: (v) => {
        this.toastr.success(`Creacion exitosa de la nueva categoria`, "Creación Exitosa");
        this.listCategoryAll()
        this.form.reset()
        this.closeModal()
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.messageError(e)
      },
      complete: () => console.info('complete')
    })



    
  }
  
  ///// UPDATE

  Update(idCategory: number) {

    if (this.formUpdate.invalid) {
      this.toastr.warning('No haz completado todos los campos', 'Alert');
      return;
    }
    const category: Category = {
      Cname: this.formUpdate.value.name,
      Cstatus: this.formUpdate.value.status,
     
    }

    console.log(category);
    
    
    this._categoryService.PatchCategory(category, idCategory).subscribe({
      next: (v) => {
        this.toastr.success(`Creacion exitosa de la nueva categoria`, "Creación Exitosa");
        this.listCategoryAll()
        this.form.reset()
        this.closeModal()
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.messageError(e)
      },
      complete: () => console.info('complete')
    })



    
  }




  openModal(item: Category| null | undefined, modalId: number, modalType: 'Create' | 'Update' ) {
    this.currentModalId = modalId,
      this.currentModalType = modalType;

      if(item){
        this.formUpdate.patchValue({
          name: item.Cname,
          status: item.Cstatus
        })
        this.MoldaId = item.Cid
        
      }else{
        this.formUpdate.reset()
        this.MoldaId=0
      }
  }

  isModalOpen(modalType: 'Create'  | 'Update' ) {
    return this.currentModalType === modalType;
  }

  closeModal() {
    this.currentModalId = null,
      this.currentModalType = null;
  }

}
