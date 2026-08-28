import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailService } from '../services/email.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../services/error.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Admin } from '../interfaces/admin';
import { AuthService } from '../services/auth.service';
import { Email } from '../interfaces/email';
import { LoginComponent } from '../login/login.component';

@Component({
    selector: 'app-page', // Especifica que es un componente standalone
    imports: [ReactiveFormsModule], // Asegúrate de que HttpClientModule está en imports
    providers: [EmailService],
    templateUrl: './page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './page.component.css'
})
export class PageComponent {

  name?: string
  lastname?: string
  email?: string
  whatsapp?: string
  subject?: string
  message?: string

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _emailService: EmailService,
    private toastr: ToastrService,
    private _errorService: ErrorService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Z ]+$')]],
      lastname: ['', [Validators.required, Validators.pattern('^[A-Z ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      whatsapp: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(15), Validators.minLength(10)]],
      subject: ['', Validators.required],
      message: ['', Validators.required],

    })

  }

  SendEmail() {

    if (this.form.invalid) {

      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);

        if (control?.invalid && control.touched) {
          if (control.errors?.['required']) {
            this.toastr.error(`El campo ${key} esta vacio`, 'Error')
          } else if (control.errors?.['pattern']) {
            this.toastr.error(`El campo ${key} debe tener letras mayusculas`, 'Error')
          } else if (control.errors?.['email']) {
            this.toastr.error(`El ${key} tiene un formato incorrecto`, 'Error')
          } else if (control.errors?.['minlength'] || control.errors?.['maxlength']) {
            this.toastr.error(`El ${key} debe tener al menos entre 10 a 15 digitos`, 'Error')
          }
        }
        control?.markAsTouched()
      })
      // this.toastr.error('No haz completado todo los datos', 'Alerta Campos Vacios')
      return
    }

    const email: Email = {
      name: this.form.value.name,
      lastname: this.form.value.lastname,
      email: this.form.value.email,
      whatsapp: this.form.value.whatsapp,
      subject: this.form.value.subject,
      message: this.form.value.message
    }

    this._emailService.SendEmail(email).subscribe({
      next: (v) => {
        this.toastr.success("Correo enviado exitosamente", "Correo Enviado")
        this.form.reset()
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.messageError(e)
      },
      complete: () => console.info('complete')
    })

  }


}
