import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from '../../services/error.service';
import { User } from '../../interfaces/user';
import { Category } from '../../interfaces/category';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { switchMap } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailService } from '../../services/email.service';
import { Email } from '../../interfaces/email';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-category-user',
  standalone: true,
  imports: [CommonModule, PaginationComponent, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './category-user.component.html',
  styleUrl: './category-user.component.css'
})
export class CategoryUserComponent implements OnInit {


  listUserCategory: User[] = []
  listCategory: Category[] = []
  selectedCategoryId: number | null = null


  currentModalId: number | null = null;
  currentModalType: 'Create' | 'CreateUserFile' | 'Read' | 'Delete' | null = null;


    //VARIABLE PARA LA PAGINACION
    totalItems: number = 0;
    itemsRegisterPage: number = 10;
    currentPage: number = 1 ;

    imageSelected: string | ArrayBuffer | null = null;
    file: File | null = null;
    form: FormGroup;
    title?: string;
    message?: string;

  constructor(
    private _userServices: UserService,
    private _categoryServices: CategoryService,
    private route: ActivatedRoute,    
    private _emailService: EmailService,
    private toastr: ToastrService,
    private _errorService: ErrorService,
    private fb: FormBuilder,

  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.pattern('^[A-Z ]+$'), Validators.email ]],
      message: ['', Validators.required],
    });
   }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(switchMap(params => {
        this.selectedCategoryId = Number(params.get('Cid'));
        return this._categoryServices.ReadAll()
      }))
      .subscribe(categories => {
        this.listCategory = categories

        if (this.selectedCategoryId) {
          this.ReadUserCategoryId(this.selectedCategoryId)
        }
      })
  }

   
  onPageChanged(page: number): void{
    this.ReadUserCategoryId(this.selectedCategoryId ?? 0, page)
  }
   
    


  SendEmailMasiveByCategory(CategoryId: number) {

        
    // if (this.form.invalid) {

    //   Object.keys(this.form.controls).forEach(key => {
    //     const control = this.form.get(key);

    //     if (control?.invalid && control.touched) {
    //       if (control.errors?.['required']) {
    //         this.toastr.error(`El campo ${key} esta vacio`, 'Error')
    //       } else if (control.errors?.['pattern']) {
    //         this.toastr.error(`El campo ${key} debe tener letras mayusculas`, 'Error')
    //       } 
    //     }

    //     control?.markAsTouched()
    //   })
    //   // this.toastr.error('No haz completado todo los datos', 'Alerta Campos Vacios')
    //   return
    // }

    

    const email: Email = {
      title: this.form.value.title,
      message: this.form.value.message,
    };


    console.log(email);
    console.log(CategoryId);
    
    if (!this.file) {
      this.toastr.error('Selecciona una imagen', 'Alerta Imagen Vacia');
      return;
    }


    this._emailService.SendEmailMasiveByCategory(email, this.file, CategoryId).subscribe({
      next: (v) => {
        this.toastr.success("Correo enviado exitosamente", "Correo Enviado");
        this.form.reset();
        this.resetImage();
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.messageError(e);
      },
      complete: () => console.info('complete')
    });
  }
 
  ReadUserCategoryId(CategoryId: number, page: number = 1): void {
    this.currentPage = page;

    this._userServices.ReadUserCategoryId(page, this.itemsRegisterPage, CategoryId).subscribe( {     
      next: (data: User[]) => {
        this.totalItems = data.length
        this.listUserCategory = data.slice((page-1) * this.itemsRegisterPage, page * this.itemsRegisterPage);
        console.log(data);
      }
    })
  }


  
  resetImage(): void {
    this.imageSelected = null;
    this.file = null;
    const input = document.getElementById('dropzone-file') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  openModal(modalId: number, modalType: 'Create' | 'CreateUserFile' | 'Read' | 'Delete') {
    this.currentModalId = modalId,
      this.currentModalType = modalType;
  }

  isModalOpen(modalType: 'Create' | 'CreateUserFile' | 'Read' | 'Delete') {
    return this.currentModalType === modalType;
  }

  closeModal() {
    this.currentModalId = null,
      this.currentModalType = null;
  }


  
  onPhotoSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSelected = reader.result;
      reader.readAsDataURL(this.file);
    }
  }


}
