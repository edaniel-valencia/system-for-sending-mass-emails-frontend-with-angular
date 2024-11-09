import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailService } from '../../services/email.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from '../../services/error.service';
import { Email } from '../../interfaces/email';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { Category } from '../../interfaces/category';
import { CategoryService } from '../../services/category.service';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PaginationComponent, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  search : string = '';
  filteredUsers: User[] = []

  listUser: User[] = [];
  listCategory: Category[] = [];

  fileSelected: boolean = false;
  fileName: string = '';
  fileExcel: File | null = null;

  imageSelected: string | ArrayBuffer | null = null;
  file: File | null = null;

  form: FormGroup;
  formUpdateUser: FormGroup;
  formCreateUser: FormGroup;
  title?: string;
  message?: string;
  
  MoldaId?: number =0
  currentModalId: number | null = null;
  currentModalType: 'Create' | 'Update' | 'Read' | 'Delete' | 'CreateUserFile' | 'Marketing' | null = null;

  //VARIABLE PARA LA PAGINACION
  totalItems: number = 0;
  itemsRegisterPage: number = 10;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  startItem: number = 1;
  endItem: number = 1;

  constructor(
    private _userService: UserService,
    private fb: FormBuilder,
    private _categoryService: CategoryService,
    private _emailService: EmailService,
    private _fileService: FileService,
    private toastr: ToastrService,
    private _errorService: ErrorService
  ) 
  {
    this.form = this.fb.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
    });
    this.formCreateUser = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      whatsapp: ['', Validators.required],
      CategoryId:  ['', Validators.required]
    });
    this.formUpdateUser = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      whatsapp: ['', Validators.required],
      CategoryId:  ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.ListUserAll();
    this.listCategoryAll()
    this.loadUser()
  }

  ListUserAll(page: number = 1) {

    this.currentPage = page;

    this._userService.ReadAll().subscribe({
      next: (data: User[]) => {
        this.listUser= data;
        this.totalItems = data.length
        this.filterUsers()
        // this.listUser = data.slice((page - 1) * this.itemsRegisterPage, page * this.itemsRegisterPage);
        console.log(data);
      }
    });
  }

  getPaginatedUsers(){
    const startIndex = (this.currentPage - 1 ) * this.itemsRegisterPage;
    return this.filteredUsers.slice(startIndex,  startIndex + this.itemsRegisterPage)
  }

  loadUser() {
    this.filteredUsers = this.listUser
  }

  filterUsers(){
    if(this.search){
      this.filteredUsers = this.listUser.filter(user =>
        user.Uname?.toLowerCase().includes(this.search.toLowerCase()) ||
        user.Ulastname?.toLowerCase().includes(this.search.toLowerCase()) ||
        user.Uemail?.toLowerCase().includes(this.search.toLowerCase()) ||
        user.Uwhatsapp?.toLowerCase().includes(this.search.toLowerCase())
      )
    }else{
      this.filteredUsers = this.listUser
    }

    this.totalItems = this.filteredUsers.length

    if(this.currentPage > Math.ceil(this.totalItems / this.itemsRegisterPage)){
      this.currentPage = 1
    }
  }

  listCategoryAll(): void {
    this._categoryService.ReadAll().subscribe(data => {
      this.listCategory = data;
      console.log(data);
    });
  }


  onPageChanged(page: number): void {
    this.ListUserAll(page)
  }


  SendEmailMasive() {
    if (this.form.invalid) {
      this.toastr.error('No haz completado todo los datos', 'Alerta Campos Vacios');
      return;
    }

    const email: Email = {
      title: this.form.value.title,
      message: this.form.value.message
    };

    if (!this.file) {
      this.toastr.error('Selecciona una imagen', 'Alerta Imagen Vacia');
      return;
    }

    console.log(email);

    this._emailService.SendEmailMasive(email, this.file).subscribe({
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

  createCargarFile(): void {

    if (!this.fileExcel) {
      this.toastr.error('Por favor, selecciona un archivo', 'Error');
      return;
    }

    this._userService.createUserFile(this.fileExcel).subscribe({
      next: () => {
        this.toastr.success('Archivo procesado correctamente', 'Éxito');
        this.fileExcel = null; // Cambiar a fileExcel
        this.fileSelected = false;
        this.ListUserAll();
        this.closeModal()

      },
      error: (error) => {
        this.toastr.error('Error al cargar el archivo', 'Error');
        console.error(error);
      }
    });
  }



  ///// CREART

  createUser() {

    if (this.formCreateUser.invalid) {
      this.toastr.warning('No haz completado todos los campos', 'Alert');
      return;
    }
    const user: User = {
      Uname: this.formCreateUser.value.name,
      Ulastname: this.formCreateUser.value.lastname,
      Uemail: this.formCreateUser.value.email,
      Uwhatsapp: this.formCreateUser.value.whatsapp,
      CategoryId: this.formCreateUser.value.CategoryId,
    }


    
    this._userService.PostUser(user).subscribe({
      next: (v) => {
        this.toastr.success(`Creacion exitosa del nuevo usuario ${user.Uemail}`, "Creación Exitosa");
        this.ListUserAll()
        this.formCreateUser.reset()
        this.closeModal()
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.messageError(e)
      },
      complete: () => console.info('complete')
    })



    
  }

  ///// ELIMINAR

  deleteUser(userIdTable: number) {

   const user: User = {
      Uid: userIdTable,      
    }

      
    this._userService.DeleteUser(userIdTable).subscribe({
      next: (v) => {
        this.toastr.success(`Eliminación exitosa del usuario ${user.Uid}`, "Eliminación Exitosa");
        this.ListUserAll()
        this.formUpdateUser.reset()
        this.closeModal()
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.messageError(e)
      },
      complete: () => console.info('complete')
    })
  }

  ///// ACTUALIZAR

  updateUser(userIdTable: number) {

    if (this.formUpdateUser.invalid) {
      this.toastr.warning('No haz completado todos los campos', 'Alert');
      return;
    }

    const user: User = {
      Uid: userIdTable,
      Uname: this.formUpdateUser.value.name,
      Ulastname: this.formUpdateUser.value.lastname,
      Uemail: this.formUpdateUser.value.email,
      Uwhatsapp: this.formUpdateUser.value.whatsapp,
      CategoryId: this.formUpdateUser.value.CategoryId,
      Ustatus: this.formUpdateUser.value.status
    }


     
    this._userService.PatchUser(user, userIdTable).subscribe({
      next: (v) => {
        this.toastr.success(`Actualización exitosa del usuario ${user.Uemail}`, "Actualización Exitosa");
        this.ListUserAll()
        this.formUpdateUser.reset()
        this.closeModal()
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.messageError(e)
      },
      complete: () => console.info('complete')
    })

    
  }

  onPhotoSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSelected = reader.result;
      reader.readAsDataURL(this.file);
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.fileExcel = <File>event.target.files[0];
      console.log('Archivo seleccionado:', this.fileExcel.name); // Log para verificar el archivo
      this.fileSelected = true;
    }
  }

  downloadFile(){
    const fileUrl = 'assets/matriz-tse.xlsx';
    const fileName  = 'Plantilla para la carga de listas de usuaurios en el sistema.xlsx';
    this._fileService.downloadFile(fileUrl, fileName)
  }

  resetImage(): void {
    this.imageSelected = null;
    this.file = null;
    const input = document.getElementById('dropzone-file') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  openModal(item: User| null | undefined, modalId: number, modalType: 'Create' | 'Update' | 'Read' | 'Delete' | 'CreateUserFile' | 'Marketing') {
    this.currentModalId = modalId,
      this.currentModalType = modalType;

      if(item){
        this.formUpdateUser.patchValue({
          name: item.Uname,
          lastname: item.Ulastname,
          email: item.Uemail,
          whatsapp: item.Uwhatsapp,
          CategoryId: item.CategoryId,
          status: item.Ustatus
        })
        this.MoldaId = item.Uid
        
      }else{
        this.formUpdateUser.reset()
        this.MoldaId=0
      }
  }

  isModalOpen(modalType: 'Create' | 'Update' | 'Read' | 'Delete' | 'CreateUserFile' | 'Marketing') {
    return this.currentModalType === modalType;
  }

  closeModal() {
    this.currentModalId = null,
      this.currentModalType = null;
  }




}